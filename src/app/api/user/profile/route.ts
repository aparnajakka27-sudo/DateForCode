import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyUserToken } from '@/lib/userAuth';

export async function GET(request: Request) {
  const authResult = await verifyUserToken(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ firebaseUid: authResult.uid });
    
    if (!user) {
      return NextResponse.json({ success: true, profile: null });
    }

    return NextResponse.json({ success: true, profile: user });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authResult = await verifyUserToken(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    
    // Whitelist allowed fields to prevent injection
    const updateData: any = {
      firebaseUid: authResult.uid,
      email: authResult.email,
    };
    
    if (data.username !== undefined) updateData.username = data.username;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.skills !== undefined) updateData.skills = data.skills;
    if (data.techStack !== undefined) updateData.techStack = data.techStack;
    if (data.college !== undefined) updateData.college = data.college;
    if (data.role !== undefined) updateData.role = data.role;

    let user;

    // 4. First search by UID
    const existingByUid = await User.findOne({ firebaseUid: authResult.uid });

    if (existingByUid) {
      console.log('[PROFILE] Existing user by UID');
      console.log('[PROFILE] Updating existing user');
      user = await User.findByIdAndUpdate(
        existingByUid._id,
        { $set: updateData },
        { new: true }
      );
    } else {
      // 6. Otherwise search by email
      const existingByEmail = await User.findOne({ email: authResult.email });

      if (existingByEmail) {
        console.log('[PROFILE] Existing user by Email');
        console.log('[PROFILE] Updating existing user');
        user = await User.findByIdAndUpdate(
          existingByEmail._id,
          { $set: updateData },
          { new: true }
        );
      } else {
        // 8. Create a brand new user
        console.log('[PROFILE] Creating new user');
        if (!updateData.username && updateData.email) {
          updateData.username = updateData.email.split('@')[0] + Math.floor(Math.random() * 10000);
        }
        console.log("Creating User:", updateData);
        user = await User.create(updateData);
      }
    }

    return NextResponse.json({ success: true, profile: user });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "User already exists." }, { status: 409 });
    }
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return PUT(request);
}
