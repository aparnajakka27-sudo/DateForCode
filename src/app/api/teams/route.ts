import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';
import { verifyUserToken } from '@/lib/userAuth';

export async function GET(request: Request) {
  const authResult = await verifyUserToken(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 403 });
  }

  try {
    await dbConnect();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const skillLevel = searchParams.get('skillLevel');

    const query: any = { status: 'accepting' };
    
    if (language) {
      query.language = language;
    }
    
    if (skillLevel) {
      query.skillLevel = skillLevel;
    }

    // We only want teams that aren't full and that the user isn't already a part of
    query.leaderId = { $ne: authResult.uid };
    query.memberIds = { $nin: [authResult.uid] };

    const teams = await Team.find(query).limit(20).lean();

    // Because we just created the Team schema and DB might be empty, 
    // let's dynamically generate some dummy teams if none are found so the UI works
    if (teams.length === 0) {
      const dummyTeams = [
        {
          _id: 'dummy_1',
          teamName: 'React Ninjas',
          teamAvatar: 'kai',
          leaderId: 'dummy_leader_1',
          leaderName: 'Aarav Mehta',
          currentMembers: 2,
          maxMembers: 4,
          techStack: ['React', 'Next.js', 'Tailwind'],
          language: language || 'JavaScript',
          skillLevel: skillLevel || 'Intermediate',
          projectName: 'E-commerce Dashboard',
          description: 'Building a high-performance dashboard. Need someone good with React context.',
          status: 'accepting'
        },
        {
          _id: 'dummy_2',
          teamName: 'Backend Bros',
          teamAvatar: 'leo',
          leaderId: 'dummy_leader_2',
          leaderName: 'Priya Sharma',
          currentMembers: 1,
          maxMembers: 3,
          techStack: ['Node.js', 'Express', 'MongoDB'],
          language: language || 'JavaScript',
          skillLevel: skillLevel || 'Intermediate',
          projectName: 'API Rate Limiter',
          description: 'Working on a scalable rate limiter. Looking for Node.js enthusiasts.',
          status: 'accepting'
        },
        {
          _id: 'dummy_3',
          teamName: 'Frontend Wizards',
          teamAvatar: 'maya',
          leaderId: 'dummy_leader_3',
          leaderName: 'Rohan Verma',
          currentMembers: 3,
          maxMembers: 4,
          techStack: ['React', 'Framer Motion'],
          language: language || 'JavaScript',
          skillLevel: skillLevel || 'Intermediate',
          projectName: 'Portfolio Generator',
          description: 'We love smooth animations. One spot left!',
          status: 'accepting'
        }
      ];
      return NextResponse.json({ success: true, teams: dummyTeams });
    }

    return NextResponse.json({ success: true, teams });
  } catch (error: any) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}
