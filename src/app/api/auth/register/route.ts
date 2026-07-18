import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { fullName, username, email, password, role } = body;

    if (!fullName || !username || !email || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email or Username already exists' }, { status: 409 });
    }

    const newUser = await User.create({
      fullName,
      username,
      email,
      password,
      role: role || 'user',
      accountCreationSource: 'web'
    });

    // Create JWT
    const token = signToken({ 
      id: newUser._id.toString(), 
      role: newUser.role, 
      email: newUser.email 
    });

    // Set HTTP-only cookie
    (await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Don't return the password
    newUser.password = undefined;

    return NextResponse.json({ success: true, message: 'Registration successful', data: { user: newUser } }, { status: 201 });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during registration.',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
