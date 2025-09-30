// in app/api/deepgram/route.ts

import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
        apiKey: process.env.DEEPGRAM_API_KEY!
    })

  } catch (error) {
    console.error("Error creating Deepgram temp key:", error);
    return NextResponse.json(
      { error: "Failed to create temporary key" },
      { status: 500 }
    );
  }
}