"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { useEffect, useState } from "react";
import { Interview } from "@/types";
import { fetchUserInterviews } from "@/lib/utils";
import { InterviewListSkeleton } from "@/components/SkeletonInterviewList";
import { ContentWrapper } from "@/components/ComponentWrapper";

// import {
//   getInterviewsByUserId,
//   getLatestInterviews,
// } from "@/lib/actions/general.action";

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
    return <InterviewListSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ContentWrapper>
      <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Welcome to AI interview Agent.</h2>
          <p className="text-lg">
            The purpose of this app is to provide real-interview simulation, with live voice agent and customized interview settings to help you practice for your interviews.
            Every interview also has its own feedback. The interview questions and feedbacks are generated in real time using Google AI Studio and Gemini models.
          </p>

          <Button className="w-full rounded-2xl" variant="outline">
            <Link href="/interview/create/">Create a new Interview</Link>
          </Button>
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
        <h2>Your Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">  
        {interviews.map((interview) => (
          <InterviewCard 
            key={interview.userId}
            interviewId={interview.id} 
            role={interview.role}
            type = {interview.type}
            level={interview.level}
            techstack = {interview.techstack}
            length={interview.length}
            createdAt = {interview.createdAt}
            jobDesc = {interview.jobDesc}
            companyDetails = {interview.companyDetails}
            />
        ))}

        
        </div>
      </section>
    </>
    </ContentWrapper>
    
  );
};