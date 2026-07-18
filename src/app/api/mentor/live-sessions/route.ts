import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Currently no live sessions model exists. Returning empty data for real-time fetch.
  return NextResponse.json({ success: true, data: [] });
}
