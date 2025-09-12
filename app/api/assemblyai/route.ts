// in app/api/assemblyai-token/route.ts

import { AssemblyAI } from 'assemblyai';
import { NextResponse } from 'next/server';

// Initialize the AssemblyAI client on the server with your secret API key
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function GET() {
  try {
    // Generate a temporary token with a 1-hour expiration
    const token = await client.streaming.createTemporaryToken({
      expires_in_seconds: 600,
    });

    return NextResponse.json({ token });

  } catch (error) {
    console.error("Error creating AssemblyAI session token:", error);
    return NextResponse.json({ error: "Failed to create token" }, { status: 500 });
  }
}