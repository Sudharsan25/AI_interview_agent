// in app/api/interview/[id]/process/route.ts

import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio, updateInterview } from "@/lib/services";
import { ValidationError, toApiError } from "@/lib/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: interviewId } = await params;

    if (!interviewId || typeof interviewId !== "string") {
      throw new ValidationError("Interview ID is required");
    }

    const formData = await request.formData();
    const completedParam = formData.get("completed");
    const completed =
      completedParam === "true" || String(completedParam) === "true";

    // Process each transcript (sent as text files)
    // TODO: Implement complete transcript-based feedback logic later
    // This will include:
    // - Analyzing transcripts for feedback
    // - Storing transcripts and feedback in database
    // - Generating comprehensive interview evaluation

    for (const [questionId, file] of formData.entries()) {
      if (questionId === "completed") continue; // Skip the completed flag

      if (file instanceof Blob) {
        // Check if it's a text file (transcript) or audio file
        if (file.type === "text/plain" || file.type.startsWith("text/")) {
          // It's a transcript text file
          const transcript = await file.text();
          console.log(`Transcript for question ${questionId}:`, transcript);
          // TODO: Store transcript in database
        } else {
          // It's an audio file - transcribe it
          const audioBuffer = Buffer.from(await file.arrayBuffer());
          const transcript = await transcribeAudio(audioBuffer);
          console.log(`Transcript for question ${questionId}:`, transcript);
          // TODO: Store transcript in database
        }
      }
    }

    // Update interview completion status
    await updateInterview(interviewId, { completed });

    return NextResponse.json({
      success: true,
      message: completed
        ? "Interview completed successfully."
        : "Interview ended successfully.",
    });
  } catch (error) {
    console.error("Error processing interview:", error);
    const apiError = toApiError(error);
    return NextResponse.json(
      {
        success: false,
        message: apiError.message,
        code: apiError.code,
      },
      { status: apiError.statusCode }
    );
  }
}
