// In app/api/interview/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getQuestionsByInterviewId } from "@/lib/services";
import { NotFoundError, ValidationError, toApiError } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Correctly get the interviewId from the params object.
    const { id: interviewId } = params;

    if (!interviewId || typeof interviewId !== "string") {
      throw new ValidationError("Interview ID is required");
    }

    // Call the centralized service function to fetch the data
    const fetchedQuestions = await getQuestionsByInterviewId(interviewId);

    if (fetchedQuestions.length === 0) {
      throw new NotFoundError("No questions found for this interview ID");
    }

    return NextResponse.json(
      { success: true, questions: fetchedQuestions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching interview questions:", error);
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
