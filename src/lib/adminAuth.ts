import { NextResponse } from 'next/server';

export async function verifyAdminToken(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, error: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.split('Bearer ')[1];
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@dateforcode.com';

  try {
    // We use the Identity Toolkit API to verify the ID token securely on the server
    // This avoids needing firebase-admin and setting up service accounts, keeping the current architecture intact.
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDmJE1xRgxPTXKoUJlEOfplNDMkKmJTMeo";
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': request.headers.get('referer') || request.url,
        'Origin': request.headers.get('origin') || new URL(request.url).origin
      },
      body: JSON.stringify({ idToken: token }),
    });

    const data = await response.json();

    if (data.error || !data.users || data.users.length === 0) {
      console.error("[verifyAdminToken] Identity Toolkit Error:", JSON.stringify(data.error || data));
      return { success: false, error: 'Invalid or expired token' };
    }

    const user = data.users[0];
    
    // Strict Owner Verification
    if (user.email !== adminEmail) {
      return { success: false, error: 'Forbidden: Insufficient privileges' };
    }

    return { success: true, uid: user.localId, email: user.email };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { success: false, error: 'Internal server error during authorization' };
  }
}

// Helper to wrap API routes securely
export function withAdminAuth(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    const authResult = await verifyAdminToken(request);
    
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 403 });
    }

    return handler(request, authResult, ...args);
  };
}
