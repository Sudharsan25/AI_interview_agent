// in app/api/interview/[id]/process/route.ts

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@deepgram/sdk";
import { db } from "@/drizzle/db";
import { Readable } from "stream";
import { transcripts } from "@/drizzle/schema"; // Assuming a 'transcript' column exists

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const interviewId = params.id;
  const formData = await request.formData();

  try {
    // 1. Authenticate with Google Drive using the service account
    const auth = new google.auth.GoogleAuth({
      keyFile: "aiinterviewagent-471504-cb232dcb1f06.json", // Store this securely!
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const drive = google.drive({ version: "v3", auth });

    // 2. Create a new folder in Google Drive for this interview
    const folderResponse = await drive.files.create({
      requestBody: {
        name: interviewId,
        mimeType: "application/vnd.google-apps.folder",
        parents: ["1ZfVn78hi0YH_KtFPjAioIE0LBplDV-BQ"], // ID of the folder you shared
      },
      fields: "id",
    });
    const folderId = folderResponse.data.id;
    if (!folderId) throw new Error("Could not create Google Drive folder.");

    // 3. Initialize Deepgram Client
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

    // 4. Process each file
    for (const [questionId, file] of formData.entries()) {
      if (file instanceof Blob) {
        const audioBuffer = Buffer.from(await file.arrayBuffer());

        // A. Upload to Google Drive (optional, but good for storage)
        await drive.files.create({
          requestBody: { name: `${questionId}.webm`, parents: [folderId] },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          media: { mimeType: file.type, body: Readable.from(audioBuffer), },
        });

        // B. Transcribe with Deepgram using the buffer
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
          audioBuffer,
          { smart_format: true, model: "nova-2", language: "en-US" }
        );

        if (error) throw error;
        const transcript = result.results.channels[0].alternatives[0].transcript;

        // C. Save the transcript to your database
        await db.insert(transcripts).values({
            questionId: questionId,
            transcript: transcript,
        });
      }
    }

    return NextResponse.json({ success: true, message: "Processing complete." });

  } catch (error) {
    console.error("Error processing interview:", error);
    return NextResponse.json({ success: false, message: "Processing failed." }, { status: 500 });
  }
}