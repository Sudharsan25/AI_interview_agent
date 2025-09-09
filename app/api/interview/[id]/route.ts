import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';
// Removed 'collection', 'query', 'where', 'getDocs' as they are not needed for db.collection().where().get()
// import { collection, query, where, getDocs } from 'firebase-admin/firestore'; 

// Handles GET requests for a specific interview's questions
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } } // Destructure params to get the interview ID
) {
    try {
        const { id: interviewId } = await params;

        if (!interviewId) {
            return NextResponse.json({ message: 'Interview ID is required.' }, { status: 400 });
        }

        // Create a query to fetch questions for the given interviewId using db.collection and .where()
        const questionsRef = db.collection('questions'); // Use db.collection directly
        const q = questionsRef.where('interviewId', '==', interviewId); // Use .where() method on the collection reference

        // Execute the query using .get()
        const querySnapshot = await q.get(); // Use .get() on the query object

        const questions: { id: string; questionText: string }[] = [];
        querySnapshot.forEach((doc) => {
            // Ensure the document data matches your expected structure
            const data = doc.data();
            if (data.questionText) {
                questions.push({
                    id: doc.id, // Include the document ID for potential future use
                    questionText: data.questionText
                });
            }
        });

        if (questions.length === 0) {
            return NextResponse.json({ message: 'No questions found for this interview ID.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, questions }, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching interview questions:", error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}