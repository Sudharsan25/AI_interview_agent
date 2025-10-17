import { LogoutButton } from "@/components/logout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const InterviewLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. If no session, redirect to the login page.
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="root-layout">
      <div>
        <nav className="flex justify-between items-center pt-8 pb-2 px-14 sticky top-0 z-50">
          <div className="flex justify-evenly items-center gap-8 mt-2">
            <Link href="/">
              <span className="text-white font-bold">Home</span>
            </Link>
            <Link href="/interview/create">
              <span className="text-white font-bold">Create Interview</span>
            </Link>
            <Link href="/interview/upcoming">
              <span className="text-white font-bold">Upcoming Interviews</span>
            </Link>
          </div>

          <LogoutButton />
        </nav>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default InterviewLayout;
