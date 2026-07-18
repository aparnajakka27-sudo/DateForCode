import { NextResponse } from 'next/server';

export async function verifyUserToken(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, error: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: token }),
    });

    const data = await response.json();

    if (data.error || !data.users || data.users.length === 0) {
      return { success: false, error: 'Invalid or expired token' };
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
      return NextResponse.json({ error: authResult.error }, { status: 403 });
    }

    return handler(request, authResult, ...args);
  };
}
