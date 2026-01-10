"use client";

/**
 * Error boundary for interview session page
 */

import { useEffect } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";

interface InterviewSessionErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InterviewSessionError({
  error,
  reset,
}: InterviewSessionErrorProps) {
  useEffect(() => {
    console.error("Interview session error:", error);
  }, [error]);

  return (
    <div className="flex flex-col h-screen w-full bg-neutral-950 text-white items-center justify-center gap-6 p-6">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-red-400">Something went wrong!</h2>
        <p className="text-neutral-400">
          {error.message || "An unexpected error occurred while loading the interview session."}
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <Link href="/home">
          <Button variant="default">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}
