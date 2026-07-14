import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email, password, browser, os, ip } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Find user and explicitly select password (since select: false in schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check account status
    if (user.accountStatus !== 'active') {
      return NextResponse.json({ error: `Account is ${user.accountStatus}` }, { status: 403 });
    }

    // Verify Password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Update Auto Update fields
    user.lastLogin = new Date();
    user.lastActiveTime = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    if (browser) user.browser = browser;
    if (os) user.operatingSystem = os;
    if (ip && !user.ipAddressLogs.includes(ip)) {
      user.ipAddressLogs.push(ip);
    }
    await user.save();

    // Create JWT
    const token = signToken({ 
      id: user._id.toString(), 
      role: user.role, 
      email: user.email 
    });

    // Set HTTP-only cookie
    (await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    user.password = undefined;

    return NextResponse.json({ message: 'Login successful', user }, { status: 200 });
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'An unexpected error occurred during login.',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
