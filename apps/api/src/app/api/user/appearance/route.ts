import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@repo/auth/server";
import { appearanceSettingsService } from '@repo/api';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await appearanceSettingsService.getAppearanceSettings(session.userId);
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[user-appearance] Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
} 