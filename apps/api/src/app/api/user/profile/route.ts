import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@repo/auth/server";
import { profileService } from '@repo/api';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await profileService.getProfile(session.userId);
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("[user-profile] Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
} 