import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import JoinRequest from '@/models/JoinRequest';
import Team from '@/models/Team';
import { verifyUserToken } from '@/lib/userAuth';

export async function POST(request: Request) {
  const authResult = await verifyUserToken(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 403 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    const { requestId, action } = data;

    if (!requestId || !['Accept', 'Reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (requestId.startsWith('dummy_')) {
      return NextResponse.json({ success: true, message: 'Simulated response' });
    }

    const joinRequest = await JoinRequest.findById(requestId);
    if (!joinRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (joinRequest.leaderId !== authResult.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const team = await Team.findById(joinRequest.receiverTeamId);
    if (!team) {
      return NextResponse.json({ error: 'Team no longer exists' }, { status: 404 });
    }

    joinRequest.status = action === 'Accept' ? 'Accepted' : 'Rejected';
    await joinRequest.save();

    if (action === 'Accept') {
      if (team.currentMembers >= team.maxMembers) {
        return NextResponse.json({ error: 'Team is already full' }, { status: 400 });
      }

      team.memberIds.push(joinRequest.senderId);
      team.currentMembers += 1;
      
      if (team.currentMembers >= team.maxMembers) {
        team.status = 'full';
      }
      
      await team.save();
    }

    return NextResponse.json({ 
      success: true, 
      senderId: joinRequest.senderId,
      teamId: team._id
    });
  } catch (error: any) {
    console.error('Error responding to request:', error);
    return NextResponse.json({ error: 'Failed to process response' }, { status: 500 });
  }
}
