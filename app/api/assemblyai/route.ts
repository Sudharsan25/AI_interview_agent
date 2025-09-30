// in app/api/tts/route.ts

import { createClient } from "@deepgram/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Initialize the Deepgram client with your API key
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

    // 2. Extract the text from the request body
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ message: 'Text is required.' }, { status: 400 });
    }

    // 3. Make the TTS request to Deepgram
    const response = await deepgram.speak.request(
      { text },
      {
        model: "aura-stella-en", // A good, general-purpose voice
        encoding: "mp3",         // Standard web audio format
        container: "wav"         // WAV container is easy to stream
      }
    );

    // 4. Get the stream and headers from the Deepgram response
    const stream = await response.getStream();
    const headers = await response.getHeaders();

    if (!stream) {
      throw new Error("Failed to get audio stream from Deepgram.");
    }
    // 5. Stream the audio directly back to the client in a NextResponse
    // The Deepgram SDK conveniently provides a Web Standard ReadableStream
    return new NextResponse(stream, {
      headers: {
        'Content-Type': headers.get('content-type') || 'audio/mp3',
      },
    });

  } catch (error: any) {
    console.error("Error in Deepgram TTS API route:", error);
    return NextResponse.json({ message: error.message || 'Failed to generate audio.' }, { status: 500 });
  }
}