import { auth } from "@/lib/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

import { Navbar } from "@/components/layouts";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. If no session, redirect to the login page.
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="root-layout bg-neutral-950 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
};

export default RootLayout;
