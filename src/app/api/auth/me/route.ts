import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    await connectToDatabase();
    
    // Auto update lastActiveTime
    const user = await User.findByIdAndUpdate(
      decoded.id, 
      { lastActiveTime: new Date() },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 404 });
    }

    return NextResponse.json({ success: true, authenticated: true, data: { user } }, { status: 200 });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ success: false, authenticated: false }, { status: 500 });
  }
}
