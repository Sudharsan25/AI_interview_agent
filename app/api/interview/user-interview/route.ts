import { NextResponse } from "next/server";
import { auth } from "@/lib/config";
import { headers } from "next/headers";
import { getInterviewsByUserId } from "@/lib/services";
import { AuthenticationError, toApiError } from "@/lib/errors";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError("Authentication required");
    }

    // Debug logging
    console.log("[user-interview] Fetching interviews for userId:", userId);
    
    const userInterviews = await getInterviewsByUserId(userId);
    
    // Debug logging
    console.log("[user-interview] Found interviews:", userInterviews.length);
    if (userInterviews.length > 0) {
      console.log("[user-interview] First interview sample:", {
        id: userInterviews[0]?.id,
        userId: userInterviews[0]?.userId,
        role: userInterviews[0]?.role,
      });
    }

    return NextResponse.json(
      { success: true, data: userInterviews },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user interviews:", error);
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
