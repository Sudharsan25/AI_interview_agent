// - api/interview/get-users-interview

import { NextResponse } from 'next/server';
import { db } from "@/drizzle/db";
import { interviews, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Assuming this is your NextAuth.js helper
import { headers } from 'next/headers';

export async function GET() {
    try {
        // 1. Authenticate the user
        const session = await auth.api.getSession({
                headers: await headers() // you need to pass the headers object.
            })

        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        // 2. Find the user in your database by email
        const userEmail = session.user.email;
        const userResult = await db.select({ id: user.id })
                                   .from(user)
                                   .where(eq(user.email, userEmail));

        if (userResult.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const userId = userResult[0].id;

        // 3. Fetch all interviews for that user, ordered by most recent
        const userInterviews = await db.select()
                                       .from(interviews)
                                       .where(eq(interviews.userId, userId));

        // 4. Return the data
        return NextResponse.json({ success: true, data: userInterviews }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user interviews:", error);
        return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}