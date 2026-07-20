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
    const { fullName, provider, providerId, browser, os, ip, role } = body;

    if (!provider || !providerId) {
      return NextResponse.json({ success: false, error: 'Missing required social fields' }, { status: 400 });
    }

    let user = await User.findOne({ $or: [{ firebaseUid }, { email }] });

    if (!user) {
      // Create new user if they don't exist
      console.log("Creating User:", {
        firebaseUid,
        email,
        fullName: fullName || email.split('@')[0],
        username: email.split('@')[0] + Math.floor(Math.random() * 10000),
        provider,
        providerId,
        role: role || 'student',
        emailVerified: true,
        accountCreationSource: 'social'
      });
      user = await User.create({
        firebaseUid,
        email,
        fullName: fullName || email.split('@')[0],
        username: email.split('@')[0] + Math.floor(Math.random() * 10000),
        provider,
        providerId,
        role: role || 'student',
        emailVerified: true,
        accountCreationSource: 'social'
      });
    } else {
      // Sync firebaseUid if it was missing
      if (!user.firebaseUid || user.firebaseUid !== firebaseUid) {
        user.set('firebaseUid', firebaseUid);
        user.markModified('firebaseUid');
      }
    }

    // Check account status
    if (user.accountStatus && user.accountStatus !== 'active') {
      return NextResponse.json({ success: false, error: `Account is ${user.accountStatus}` }, { status: 403 });
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
    try {
      console.log("========== BEFORE SAVE (SOCIAL) ==========");
      console.log(user.toObject());

      await user.validate();
      console.log("✅ Validation Passed");

      await user.save();
      console.log("✅ Save Passed");

    } catch (err: any) {
      console.error("❌ Validation Error (SOCIAL):", err);

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

    return NextResponse.json({ success: true, message: 'Social login successful', data: { user } }, { status: 200 });
  } catch (error: any) {
    console.error('Social Login Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during social login.',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
