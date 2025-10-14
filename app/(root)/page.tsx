"use client";

import Image from "next/image";

import InterviewCard from "@/components/InterviewCard";
import { useEffect, useState } from "react";
import { Interview } from "@/types";
import { fetchUserInterviews } from "@/lib/utils";
import { HomePageSkeleton } from "@/components/SkeletonInterviewList";
import { ContentWrapper } from "@/components/ComponentWrapper";

export default function InterviewList() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const data = await fetchUserInterviews();
        setInterviews(data);
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
            {interviews.map((interview) => (
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
            ))}
          </div>
        </section>
      </>
    </ContentWrapper>
  );
}
