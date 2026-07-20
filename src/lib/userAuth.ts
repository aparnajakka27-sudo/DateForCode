import { NextResponse } from 'next/server';

export async function verifyUserToken(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, error: 'Token missing' };
  }

  const token = authHeader.split('Bearer ')[1].trim();

  if (!token) {
    return { success: false, error: 'Token missing' };
  }

  try {
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
      console.error("[verifyUserToken] Identity Toolkit Error:", JSON.stringify(data.error || data));
      const errorMsg = data.error?.message || '';
      if (errorMsg.includes('TOKEN_EXPIRED')) return { success: false, error: 'Session expired' };
      if (errorMsg.includes('INVALID_ID_TOKEN')) return { success: false, error: 'Invalid or expired token' };
      return { success: false, error: 'Firebase verification failed: ' + (errorMsg || 'Unknown error') };
    }

    const user = data.users[0];
    
    return { success: true, uid: user.localId, email: user.email };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { success: false, error: 'Internal server error during authorization' };
  }
}

export function withUserAuth(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    const authResult = await verifyUserToken(request);
    
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    return handler(request, authResult, ...args);
  };
}
