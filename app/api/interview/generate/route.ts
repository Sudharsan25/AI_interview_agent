import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils"; // Assuming this utility exists and provides a string
import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest and NextResponse
import { db } from "@/drizzle/db";

// Handles GET requests to the API route
export async function GET(){
    return NextResponse.json({success: true, data: "Thank you"},{status:200});
}

// Handles POST requests to the API route for generating and storing interviews
export async function POST(request: NextRequest){
    const { role, level, type, techstack, length, companyDetails, specialization, jobDesc }= await request.json();

    try{
        // Basic validation for incoming data
        if (!role || !level || !type || !techstack || !user?.id || length === undefined) {
            return NextResponse.json({ message: 'Missing or invalid required fields.' }, { status: 400 });
        }

        // Construct the prompt for the Gemini model
        // Ensure techstack is an array before joining, as it's sent as an array from the client
        const techstackString = Array.isArray(techstack) ? techstack.join(', ') : techstack;

        const prompt = `Prepare exactly ${length} questions for a job interview.
                        The job role is ${role}.
                        The job experience level is ${level}.
                        The tech stack used in the job is: ${techstackString}.
                        The focus between behavioural and technical questions should lean towards: ${type}.
                        Please return only the questions, without any additional text or conversational filler.
                        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
                        Return the questions formatted as a JSON array of strings, like this:
                        ["Question 1", "Question 2", "Question 3"]
                        Ensure there are exactly ${length} questions.`;

        // Generate text (interview questions) using the AI SDK
        const result = await generateText({
            model: google('gemini-2.0-flash-001'), // Using gemini-2.0-flash-001 as per your original code
            prompt: prompt,
        });

        console.log("Raw generated text (questions):", result.text); // Log the raw output from the AI model

        let questionsArray: string[];
        try {
            // *** START OF MODIFICATION ***
            // Remove markdown code block delimiters (```json and ```) before parsing
            const cleanText = result.text.replace(/```json\n|```/g, '').trim();
            console.log("Cleaned text for parsing:", cleanText); // Log the cleaned text
            questionsArray = JSON.parse(cleanText);
            // *** END OF MODIFICATION ***

            // Validate that the parsed result is indeed an array of strings
            if (!Array.isArray(questionsArray) || !questionsArray.every(q => typeof q === 'string')) {
                throw new Error("AI model did not return a valid JSON array of strings.");
            }
        } catch (parseError) {
            console.error("Error parsing AI generated questions:", parseError);
            return NextResponse.json({
                success: false,
                message: "Failed to parse AI generated questions. Ensure the model output is a valid JSON array.",
                rawAiOutput: result.text // Include raw output for debugging
            }, { status: 500 });
        }

        // Prepare data for the 'interviews' collection
        const interviewData = {
            role,
            type,
            level,
            techstack: techstack, // Store techstack as an array
            length: parseInt(length, 10), // Ensure length is stored as a number
            userId: user?.id,
            finalized: true,
            coverImage: getRandomInterviewCover(), // Use the utility function for a cover image
            createdAt: new Date().toISOString() // Store creation timestamp
        };

        // Add the interview details to the 'interviews' collection
        const interviewDocRef = await db.collection('interviews').add(interviewData);
        const interviewId = interviewDocRef.id; // Get the ID of the newly created interview document
        console.log(`Interview details saved with ID: ${interviewId}`);

        // Store each generated question in the 'questions' collection, linked by interviewId
        // Using a batch write for efficiency when adding multiple documents
        const questionsBatch = db.batch();
        for (const questionText of questionsArray) {
            // Create a new document reference with an auto-generated ID for each question
            const questionDocRef = db.collection('questions').doc();
            questionsBatch.set(questionDocRef, {
                interviewId: interviewId, // Link question to the interview
                questionText: questionText.trim() // Store the question text, trimming whitespace
            });
        }
        await questionsBatch.commit(); // Commit the batch write
        console.log(`${questionsArray.length} questions saved for interview ID: ${interviewId}`);

        // Return a success response with the new interview ID
        return NextResponse.json({ success: true, interviewId: interviewId }, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any){ // Use 'any' for error type if not strictly typed
        console.error("Error in POST /api/interview:", error);
        // Return an error response with a descriptive message
        return NextResponse.json({ success: false, message: error.message || 'An unexpected error occurred during interview generation.' }, { status: 500 });
    }
}
