import { LogoutButton } from "@/components/logout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const RootLayout = async ({ children }: { children: ReactNode }) => {
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
        <nav className="flex justify-between items-center pt-8 pb-2 px-24 sticky top-0 z-50">
          <Link href="/" className="bg-gray-600 rounded-4xl">
            <Image src="/logo.svg" alt="logo" height={58} width={58} />
          </Link>
          <LogoutButton />
        </nav>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default RootLayout;
