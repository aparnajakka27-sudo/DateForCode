import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email, fullName, provider, providerId, browser, os, ip, role } = body;

    if (!email || !provider || !providerId) {
      return NextResponse.json({ error: 'Missing required social fields' }, { status: 400 });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        email,
        fullName: fullName || email.split('@')[0],
        username: email.split('@')[0] + Math.floor(Math.random() * 10000),
        provider,
        providerId,
        role: role || 'user',
        emailVerified: true,
        accountCreationSource: 'social'
      });
    }

    // Check account status
    if (user.accountStatus !== 'active') {
      return NextResponse.json({ error: `Account is ${user.accountStatus}` }, { status: 403 });
    }

    // Auto Updates
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

    return NextResponse.json({ message: 'Social login successful', user }, { status: 200 });
  } catch (error: any) {
    console.error('Social Login Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'An unexpected error occurred during social login.',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
