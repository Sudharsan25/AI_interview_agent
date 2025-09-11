// in app/api/interview/[id]/questions/route.ts (or your chosen path)

import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';
import { questions } from '@/drizzle/schema'; // Import your questions schema
import { eq } from 'drizzle-orm'; // Import the 'equals' operator

// Handles GET requests for a specific interview's questions
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } } // Destructure params to get the interview ID
) {
    try {
        // Correctly get the interviewId from the params object (it's not a promise)
        const interviewId = await params.id;

        if (!interviewId) {
            return NextResponse.json({ message: 'Interview ID is required.' }, { status: 400 });
        }

        // --- Drizzle Query ---
        // This single line replaces the entire Firestore query and iteration logic.
        const fetchedQuestions = await db.select()
            .from(questions)
            .where(eq(questions.interviewId, interviewId));
        // --- End of Drizzle Query ---

        if (fetchedQuestions.length === 0) {
            return NextResponse.json({ message: 'No questions found for this interview ID.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, questions: fetchedQuestions }, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching interview questions:", error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}