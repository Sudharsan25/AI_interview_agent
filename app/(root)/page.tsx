/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";

// import {
//   getInterviewsByUserId,
//   getLatestInterviews,
// } from "@/lib/actions/general.action";

async function Home() {


  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Welcome to AI interview Agent.</h2>
          <p className="text-lg">
            The purpose of this app is to provide real-interview simulation, with live voice agent and customized interview settings to help you practice for your interviews.
            Every interview also has its own feedback. The interview questions and feedbacks are generated in real time using Google AI Studio and Gemini models.
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
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
        {dummyInterviews.map((interview) => (
          <InterviewCard 
            key={interview.userId}
            interviewId={interview.id} 
            role={interview.role}
            type = {interview.type}
            techstack = {interview.techstack}
            createdAt = {interview.createdAt}
            />
        ))}

        
        </div>
      </section>
    </>
  );
}

export default Home;