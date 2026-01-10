// in app/api/deepgram/route.ts

import { NextResponse } from "next/server";
import { InternalServerError, toApiError } from "@/lib/errors";

export async function GET() {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;

    if (!apiKey) {
      throw new InternalServerError("Deepgram API key is not configured");
    }

    return NextResponse.json({
      success: true,
      apiKey,
    });
  } catch (error) {
    console.error("Error getting Deepgram API key:", error);
    const apiError = toApiError(error);
    return NextResponse.json(
      {
        success: false,
        error: apiError.message,
        code: apiError.code,
      },
      { status: apiError.statusCode }
    );
  }
}