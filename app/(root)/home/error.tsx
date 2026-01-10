"use client";

import { ContentWrapper } from "@/components/layouts";
import { Button } from "@/components/ui";
import { useEffect } from "react";

interface HomeErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HomeError({ error, reset }: HomeErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ContentWrapper>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h2 className="text-2xl font-bold text-red-500">
          Something went wrong!
        </h2>
        <p className="text-neutral-400">
          We could not load your interviews. Please try again.
        </p>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }>
          Try again
        </Button>
      </div>
    </ContentWrapper>
  );
}
