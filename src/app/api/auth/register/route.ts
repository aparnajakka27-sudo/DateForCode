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
    const { fullName, username, role, provider, providerId, emailVerified } = body;

    if (!username) {
      return NextResponse.json({ success: false, error: 'Missing username' }, { status: 400 });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    let newUser = null;

    if (existingUser) {
      if (existingUser.firebaseUid && existingUser.firebaseUid !== firebaseUid) {
        return NextResponse.json({ success: false, error: 'Email or Username already exists' }, { status: 409 });
      } else if (!existingUser.firebaseUid) {
        // Legacy user migration during registration
        existingUser.set('firebaseUid', firebaseUid);
        existingUser.markModified('firebaseUid');
        newUser = existingUser; // We will save this below
      } else {
        // They somehow have the exact same firebaseUid, just log them in
        newUser = existingUser;
      }
    }

    if (!newUser) {
      console.log("Creating User:", {
        firebaseUid,
        email,
        fullName: fullName || '',
        username,
        role: role || 'student',
        provider: provider || 'email',
        providerId: providerId || firebaseUid,
        emailVerified: emailVerified || false,
        accountCreationSource: 'web'
      });
      
      newUser = new User({
        firebaseUid,
        email,
        fullName: fullName || '',
        username,
        role: role || 'student',
        provider: provider || 'email',
        providerId: providerId || firebaseUid,
        emailVerified: emailVerified || false,
        accountCreationSource: 'web'
      });
    }

    try {
      console.log("========== BEFORE SAVE (REGISTER) ==========");
      console.log(newUser.toObject());

      await newUser.validate();
      console.log("✅ Validation Passed");

      await newUser.save();
      console.log("✅ Save Passed");

    } catch (err: any) {
      console.error("❌ Validation Error (REGISTER):", err);

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
