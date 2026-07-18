import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import JoinRequest from '@/models/JoinRequest';
import Team from '@/models/Team';
import User from '@/models/User';
import { verifyUserToken } from '@/lib/userAuth';

export async function POST(request: Request) {
  const authResult = await verifyUserToken(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 403 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    const { teamId } = data;

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    // Dummy ID handling for our UI simulation
    if (teamId.startsWith('dummy_')) {
      const leaderId = teamId.replace('dummy_', 'dummy_leader_');
      return NextResponse.json({ 
        success: true, 
        requestId: 'dummy_req_' + Date.now(),
        leaderId: leaderId,
        message: 'Request simulated successfully'
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.status !== 'accepting') {
      return NextResponse.json({ error: 'Team is no longer accepting members' }, { status: 400 });
    }

    // Check if request already exists
    const existing = await JoinRequest.findOne({
      senderId: authResult.uid,
      receiverTeamId: teamId,
      status: 'Pending'
    });

    if (existing) {
      return NextResponse.json({ error: 'You have already sent a request to this team' }, { status: 400 });
    }

    const newRequest = await JoinRequest.create({
      senderId: authResult.uid,
      receiverTeamId: team._id,
      leaderId: team.leaderId,
      status: 'Pending'
    });

    return NextResponse.json({ 
      success: true, 
      requestId: newRequest._id,
      leaderId: team.leaderId 
    });
  } catch (error: any) {
    console.error('Error creating join request:', error);
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}
