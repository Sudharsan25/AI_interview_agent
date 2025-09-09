// middleware.ts (in the root of your project)
// this middleware is from better-auth setup, not default middleware for Next.js
import { NextResponse } from "next/server";

export async function middleware() {
	return NextResponse.next();
}

export const config = {
	matcher: ["/"], // Specify the routes the middleware applies to
};