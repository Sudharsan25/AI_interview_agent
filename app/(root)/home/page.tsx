"use client";

import Image from "next/image";

import InterviewCard from "@/components/InterviewCard";
import { useEffect, useState } from "react";
import { Interview } from "@/types";
import { HomePageSkeleton } from "@/components/SkeletonInterviewList";
import { ContentWrapper } from "@/components/ComponentWrapper";

export default function Home() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        // --- THIS IS THE CHANGE ---
        const response = await fetch("/api/interview/user-interview");
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
    return <HomePageSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ContentWrapper>
      <>
        <section className="card-cta">
          <div className="flex flex-col items-center justify-center gap-6 max-w-2xl">
            <h2 className="text-2xl text-shadow-2xs font-bold">
              AI Interview Agent
            </h2>
            <p className="text-lg">
              Go beyond flashcards and theory. AI-powered Interivew agent
              creates a realistic, voice-driven interview experience tailored to
              your target role. Create a curated set of questions by uploading
              specific details about the interview and practice your answers in
              a true-to-life simulation, and build the confidence to ace any
              interview.
            </p>
          </div>

          <Image
            src="/robot.png"
            alt="robo-dude"
            width={400}
            height={400}
            className="max-sm:hidden"
          />
        </section>

        <section className="flex flex-col gap-6 mt-8">
          <h3>All Interviews</h3>
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
                  No Interviews Created Yet
                </h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  It looks like you&apos;re ready for a new challenge. Create
                  your first AI-powered interview to start practicing.
                </p>
              </div>
            ) : (
              interviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
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
