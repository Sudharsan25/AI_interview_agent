import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/config";
import {
  generateInterviewQuestions,
  createInterview,
  createQuestions,
  getUserByEmail,
} from "@/lib/services";
import { createInterviewSchema } from "@/lib/validation/api-schemas";
import { ValidationError, AuthenticationError, NotFoundError, toApiError } from "@/lib/errors";

// Handles GET requests to the API route
export async function GET() {
  return NextResponse.json(
    { success: true, data: "Thank you" },
    { status: 200 }
  );
}

// New POST function
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(), // you need to pass the headers object.
    });

    if (!session) {
      throw new AuthenticationError("Authentication required");
    }

    const userEmail = session.user.email;
    const currentUser = await getUserByEmail(userEmail);

    if (!currentUser) {
      throw new NotFoundError("User not found in database");
    }

    const userId = currentUser.id;

    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = createInterviewSchema.safeParse(body);
    if (!validationResult.success) {
      const fields: Record<string, string[]> = {};
      validationResult.error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!fields[path]) {
          fields[path] = [];
        }
        fields[path].push(err.message);
      });
      throw new ValidationError("Invalid request data", fields);
    }

    const {
      role,
      level,
      type,
      techstack,
      length,
      jobDesc,
      companyDetails,
      specialization,
      resumeDetails,
    } = validationResult.data;

    const techstackString = Array.isArray(techstack)
      ? techstack.join(", ")
      : techstack;

    // Generate questions using AI service
    const questionsArray = await generateInterviewQuestions({
      role,
      level,
      type,
      techstack: techstackString,
      length: length as "short" | "mid" | "long",
      jobDesc,
      companyDetails,
      specialization,
      resumeDetails,
    });

    // Create interview using service
    const interview = await createInterview({
      userId,
      role,
      level,
      type,
      techstack: techstackString,
      length,
      jobDesc,
      companyDetails: companyDetails || null,
      specialization: specialization || null,
      resumeDetails: resumeDetails || null,
      completed: false,
    });

    const interviewId = interview.id;

    // Create questions using service
    await createQuestions(interviewId, questionsArray);

    // If the code reaches here, the transaction was successful and has been committed.
    // Now, return the final success response to the client.
    return NextResponse.json(
      { success: true, interviewId: interviewId },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in POST /api/interview/generate:", error);
    const apiError = toApiError(error);
    return NextResponse.json(
      {
        success: false,
        message: apiError.message,
        code: apiError.code,
        ...(apiError instanceof ValidationError && { fields: apiError.fields }),
      },
      { status: apiError.statusCode }
    );
  }
}
