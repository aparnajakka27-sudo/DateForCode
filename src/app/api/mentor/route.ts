import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Mentor from '@/models/Mentor';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId parameter' }, { status: 400 });
    }

    await dbConnect();
    let mentor = await Mentor.findOne({ userId });

    if (!mentor) {
      // Return default initialization status
      return NextResponse.json({
        userId,
        activePortal: 'student',
        level1Completed: false,
        submittedProjects: [],
        level2Completed: false,
        assessmentAttempts: [],
        isMentorApproved: false
      });
    }

    return NextResponse.json({ success: true, data: mentor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId parameter' }, { status: 400 });
    }

    await dbConnect();

    const mentor = await Mentor.findOneAndUpdate(
      { userId },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: mentor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
