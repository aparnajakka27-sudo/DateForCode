import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const students = await User.find({ role: 'student' }).sort({ xpPoints: -1 }).limit(10).lean();
    
    const formattedStudents = students.map((s: any) => ({
      id: s._id.toString(),
      name: s.fullName || s.username,
      avatar: s.username ? s.username.substring(0, 2).toUpperCase() : 'ST',
      hp: s.xpPoints || 0,
      matches: s.totalMatches || 0,
      level: Math.floor((s.xpPoints || 0) / 100) + 1,
      topSkill: s.skills && s.skills.length > 0 ? s.skills[0] : 'Coding'
    }));

    return NextResponse.json({ success: true, data: formattedStudents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
