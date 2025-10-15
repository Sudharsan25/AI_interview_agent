// In app/api/interview/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getQuestionsByInterviewId } from "@/lib/services/interviews"; // Import the new service function

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Correctly get the interviewId from the params object.
    const { id: interviewId } = params;

    if (!interviewId) {
      return NextResponse.json(
        { message: "Interview ID is required." },
        { status: 400 }
      );
    }

    // Call the centralized service function to fetch the data
    const fetchedQuestions = await getQuestionsByInterviewId(interviewId);

    if (fetchedQuestions.length === 0) {
      return NextResponse.json(
        { message: "No questions found for this interview ID." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, questions: fetchedQuestions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching interview questions:", error);
    return NextResponse.json(
      { success: false, message: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
