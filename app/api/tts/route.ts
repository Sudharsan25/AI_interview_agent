// in app/api/tts/route.ts

import { NextRequest, NextResponse } from "next/server";
import {PollyClient, SynthesizeSpeechCommand} from "@aws-sdk/client-polly"
import { Readable } from "stream";
import { ttsRequestSchema } from "@/lib/validation/api-schemas";
import { ValidationError, InternalServerError, toApiError } from "@/lib/errors";

const pollyCilent = new PollyClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

export async function POST(request: NextRequest){
    try{
        const body = await request.json();

        // Validate request body
        const validationResult = ttsRequestSchema.safeParse(body);
        if (!validationResult.success) {
            throw new ValidationError(
                validationResult.error.errors[0]?.message || "Invalid request data"
            );
        }

        const { text } = validationResult.data;

        const command = new SynthesizeSpeechCommand({
            OutputFormat: "mp3",
            Text: text,
            VoiceId:"Joanna",
            Engine:"neural"
        });

        const response = await pollyCilent.send(command);

        if(!response.AudioStream){
            throw new InternalServerError(
                `No audio stream received from Polly: ${JSON.stringify(response.$metadata)}`
            );
        }

        // 1. Check if the AudioStream from AWS is a valid Node.js Readable stream.
        if (response.AudioStream && response.AudioStream instanceof Readable) {
          const nodeStream = response.AudioStream as Readable;

          // 2. Create a new Web API ReadableStream.
          const webStream = new ReadableStream({
            start(controller) {
              // 3. Set up event listeners to pipe the data.
              nodeStream.on("data", (chunk) => {
                // When the Node stream gets a chunk of data, enqueue it in our new Web stream.
                controller.enqueue(chunk);
              });
              nodeStream.on("end", () => {
                // When the Node stream finishes, close our new Web stream.
                controller.close();
              });
              nodeStream.on("error", (err) => {
                // If the Node stream has an error, propagate it to our Web stream.
                controller.error(err);
              });
            },
          });

      // 4. Return the new, fully compliant Web Stream.
      return new NextResponse(webStream, {
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      });
      }
    } catch(error){
        console.error("Error in TTS route:", error);
        const apiError = toApiError(error);
        return NextResponse.json(
            {
                error: apiError.message,
                code: apiError.code,
            },
            { status: apiError.statusCode }
        );
    }
}
