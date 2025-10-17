"use client";
import InterviewCard from "@/components/InterviewCard";
import { useEffect, useState } from "react";
import { Interview } from "@/types";
import { ContentWrapper } from "@/components/ComponentWrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        // --- THIS IS THE CHANGE ---
        const response = await fetch("/api/interview/upcoming");
        if (!response.ok) {
          throw new Error("Failed to fetch interviews.");
        }
        const result = await response.json();
        if (result.success) {
          setInterviews(result.data);
        }
        // --- END OF CHANGE ---
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInterviews();
  }, []);

  if (isLoading) {
    // 2. Render the skeleton component instead of the old text
    return (
      <>
        {/* === Skeleton for the Interviews List Section === */}
        <section className="flex flex-col gap-6 mt-8">
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {/* Create 6 skeleton cards to fill the grid */}
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-2xl" />
            ))}
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ContentWrapper>
      <>
        <section className="flex flex-col gap-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {interviews.length === 0 ? (
              // 2. Use a more descriptive and actionable empty state component
              <div className="col-span-full flex flex-col items-center justify-center text-center p-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" x2="12" y1="18" y2="12" />
                  <line x1="9" x2="15" y1="15" y2="15" />
                </svg>
                <h3 className="text-xl font-semibold mt-4 text-white">
                  You have completed all scheduled interviews
                </h3>
                <p className="text-muted-foreground mt-6 max-w-sm">
                  Looks like you have aced your existing interviews!! Up for a
                  new challenge? Create a new interview now!!
                </p>
              </div>
            ) : (
              interviews.map((interview) => (
                <InterviewCard
                  key={interview.userId}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  level={interview.level}
                  techstack={interview.techstack}
                  length={interview.length}
                  createdAt={interview.createdAt}
                  jobDesc={interview.jobDesc}
                  companyDetails={interview.companyDetails}
                  completed={interview.completed}
                />
              ))
            )}
          </div>
        </section>
      </>
    </ContentWrapper>
  );
}
