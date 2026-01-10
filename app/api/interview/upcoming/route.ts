// in app/api/upcoming/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/lib/config";
import { headers } from "next/headers";
import { getUpcomingInterviewsByUserId } from "@/lib/services";
import { AuthenticationError, toApiError } from "@/lib/errors";

export async function GET() {
  try {
    // 1. Get the current user's session
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    // 2. If no user is authenticated, return an unauthorized error
    if (!userId) {
      throw new AuthenticationError("Authentication required");
    }

    // 3. Call your centralized service function to fetch the data
    const upcomingInterviews = await getUpcomingInterviewsByUserId(userId);

    // 4. Return the fetched data
    return NextResponse.json(
      { success: true, data: upcomingInterviews },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching upcoming interviews:", error);
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
