import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyUserToken } from '@/lib/userAuth';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const authResult = await verifyUserToken(request);
    if (!authResult.success) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: 401 });
    }
    const firebaseUid = authResult.uid;
    const email = authResult.email;

    const body = await request.json().catch(() => ({}));
    const { browser, os, ip } = body;

    // Find user by firebaseUid (fallback to email if migrating)
    let user = await User.findOne({ $or: [{ firebaseUid }, { email }] });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // If migrating existing user who didn't have a firebaseUid yet
    if (!user.firebaseUid || user.firebaseUid !== firebaseUid) {
      user.set('firebaseUid', firebaseUid);
      user.markModified('firebaseUid');
    }

    // Check account status
    if (user.accountStatus && user.accountStatus !== 'active') {
      return NextResponse.json({ success: false, error: `Account is ${user.accountStatus}` }, { status: 403 });
    }

    // No password validation needed since Firebase handled it

    // Update Auto Update fields
    user.lastLogin = new Date();
    user.lastActiveTime = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    if (browser) user.browser = browser;
    if (os) user.operatingSystem = os;
    if (ip && !user.ipAddressLogs.includes(ip)) {
      user.ipAddressLogs.push(ip);
    }
    try {
      console.log("========== BEFORE SAVE ==========");
      console.log(user.toObject());

      await user.validate();
      console.log("✅ Validation Passed");

      await user.save();
      console.log("✅ Save Passed");

    } catch (err: any) {
      console.error("❌ Validation Error:", err);

      if (err.errors) {
        for (const key in err.errors) {
          console.log(
            "Field:",
            key,
            "Message:",
            err.errors[key].message,
            "Value:",
            err.errors[key].value
          );
        }
      }

      throw err;
    }

    // Removed custom JWT session cookie creation

    // Return success without JWT
    return NextResponse.json({ success: true, message: 'Login successful', data: { user } }, { status: 200 });
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during login.',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
