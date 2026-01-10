"use client";

/**
 * Error boundary for interview create page
 */

import { useEffect } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { ContentWrapper } from "@/components/layouts";

interface InterviewCreateErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InterviewCreateError({
  error,
  reset,
}: InterviewCreateErrorProps) {
  useEffect(() => {
    console.error("Interview create error:", error);
  }, [error]);

  return (
    <ContentWrapper>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-red-400">
            Something went wrong!
          </h2>
          <p className="text-neutral-400">
            {error.message ||
              "An unexpected error occurred while loading the form."}
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
    </ContentWrapper>
  );
}
