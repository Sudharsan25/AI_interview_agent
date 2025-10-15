import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getInterviewsByUserId } from "@/lib/services/interviews";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const userInterviews = await getInterviewsByUserId(userId); // 4. Return the data

    return NextResponse.json(
      { success: true, data: userInterviews },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user interviews:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
