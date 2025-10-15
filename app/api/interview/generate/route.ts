import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server"; // Import NextRequest and NextResponse
import { db } from "@/drizzle/db";
import { user, interviews, questions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Handles GET requests to the API route
export async function GET() {
  return NextResponse.json(
    { success: true, data: "Thank you" },
    { status: 200 }
  );
}

// New POST function
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  console.log("Session Data:", session);

  if (!session) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const userEmail = session.user.email;
  const currentUserArray = await db
    .select()
    .from(user)
    .where(eq(user.email, userEmail));

  if (currentUserArray.length === 0) {
    return NextResponse.json(
      { message: "User not found in database" },
      { status: 404 }
    );
  }

  const currentUser = currentUserArray[0];
  const userId = currentUser.id;

  console.log("Current user ID", userId);

  const {
    role,
    level,
    type,
    techstack,
    length,
    jobDesc,
    companyDetails,
    specialization,
  } = await request.json();

  try {
    if (
      !role ||
      !level ||
      !type ||
      !techstack ||
      !userId ||
      !length ||
      !jobDesc
    ) {
      return NextResponse.json(
        { message: "Missing or invalid required fields." },
        { status: 400 }
      );
    }

    const techstackString = Array.isArray(techstack)
      ? techstack.join(", ")
      : techstack;

    // Place this logic before your prompt string
    const lengthMap = {
      short: 5,
      mid: 8,
      long: 10,
    };

    // Use the map to get the number, with a fallback to a default value
    const numberOfQuestions = lengthMap[length as keyof typeof lengthMap] || 5;
    // Start with the base prompt containing all the required information
    let prompt = `Prepare exactly ${numberOfQuestions} questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstackString}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            Here are some specific skills and responsibilities from the job description to focus on: ${jobDesc}.`;

    // Conditionally add the optional details only if they have a value
    if (companyDetails) {
      prompt += `\nFor context, here are some details about the company: ${companyDetails}.`;
    }

    if (specialization) {
      prompt += `\nPlease tailor some questions towards this specialization: ${specialization}.`;
    }

    // Finally, add the formatting instructions at the end
    prompt += `\n
            Please return only the questions, without any additional text or conversational filler.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted as a JSON array of strings, like this:
            ["Question 1", "Question 2", "Question 3"]
            Ensure there are exactly ${numberOfQuestions} questions.`;

    const result = await generateText({
      model: google("gemini-2.0-flash-001"), // Using gemini-2.0-flash-001 as per your original code
      prompt: prompt,
    });

    console.log("Raw generated text (questions):", result.text);

    const interviewData = {
      userId,
      role,
      level,
      type,
      techstack: techstackString, // Store techstack as an array
      length, // Ensure length is stored as a number
      jobDesc,
      companyDetails,
      specialization,
    };

    let questionsArray: string[];
    try {
      // *** START OF MODIFICATION ***
      // Remove markdown code block delimiters (```json and ```) before parsing
      const cleanText = result.text.replace(/```json\n|```/g, "").trim();
      console.log("Cleaned text for parsing:", cleanText); // Log the cleaned text
      questionsArray = JSON.parse(cleanText);
      // *** END OF MODIFICATION ***

      // Validate that the parsed result is indeed an array of strings
      if (
        !Array.isArray(questionsArray) ||
        !questionsArray.every((q) => typeof q === "string")
      ) {
        throw new Error(
          "AI model did not return a valid JSON array of strings."
        );
      }
    } catch (parseError) {
      console.error("Error parsing AI generated questions:", parseError);
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to parse AI generated questions. Ensure the model output is a valid JSON array.",
          rawAiOutput: result.text, // Include raw output for debugging
        },
        { status: 500 }
      );
    }
    // The entire database operation is now wrapped in a transaction.
    const newInterviewResult = await db
      .insert(interviews)
      .values(interviewData)
      .returning({ insertedId: interviews.id });

    const interviewId = newInterviewResult[0]?.insertedId;

    // If the first insert fails, throw an error.
    if (!interviewId) {
      throw new Error("Failed to create the interview record in the database.");
    }

    // STEP 2: Prepare the questions with the new interview ID.
    const questionsToInsert = questionsArray.map((questionText) => ({
      questionText: questionText.trim(),
      interviewId: interviewId,
    }));

    // STEP 3: Insert all the associated questions.
    if (questionsToInsert.length > 0) {
      await db.insert(questions).values(questionsToInsert);
    }

    // If the code reaches here, the transaction was successful and has been committed.
    // Now, return the final success response to the client.
    return NextResponse.json(
      { success: true, interviewId: interviewId },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in POST /api/interview:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "An unexpected error occurred during interview generation.",
      },
      { status: 500 }
    );
  }
}
