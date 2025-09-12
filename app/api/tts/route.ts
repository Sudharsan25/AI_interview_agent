// in app/api/tts/route.ts

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize the ElevenLabs client using the API key from environment variables
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // 1. Extract the text from the request body
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ message: 'Text is required.' }, { status: 400 });
    }

    // 2. Call the ElevenLabs API to get the audio stream
    const audioStream = await elevenlabs.textToSpeech.stream("JBFqnCBsd6RMkjVDRZzb",{
      outputFormat: "mp3_44100_128", // A default voice, you can make this dynamic
      text: text,
      modelId: "eleven_multilingual_v2",
    });

    // 3. Stream the audio back to the client
    // The 'ReadableStream' from the SDK is directly usable in a NextResponse
    return new NextResponse(audioStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in TTS API route:", error);
    return NextResponse.json({ message: error.message || 'Failed to generate audio.' }, { status: 500 });
  }
}