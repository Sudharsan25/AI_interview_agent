"use client";
import Image from "next/image";
import { InterviewCard, HomePageSkeleton } from "@/components/features/interview";
import { useEffect, useState } from "react";
import { Interview } from "@/types";
import { Button } from "@/components/ui";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/api/client";

export default function Home() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const result = await apiClient.getUserInterviews();
        if (result.success && result.data) {
          setInterviews(result.data as Interview[]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch interviews.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInterviews();
  }, []);

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950/0 to-neutral-950/0 pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Interview Practice</span>
                 </div>
                 <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                    Ace Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      Interview
                    </span>
                 </h1>
                 <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Experience realistic, voice-driven technical interviews tailored to your role. 
                    Practice with our personal Interview agent and build the confidence to ace your next interview.
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/interview/create" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto min-h-[44px] h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-base sm:text-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    Start New Interview
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image / Visual */}
            <div className="flex-1 relative w-full max-w-[500px] lg:max-w-none">
               <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden">
                  <Image
                    src="/background.jpg"
                    alt="AI Interview Agent"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                  />
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interview List Section */}
      <section className="container mx-auto max-w-7xl px-6 pb-20">
        <div className="flex items-center justify-between mb-10">
           <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              Your Interviews
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-sm font-medium">
                {interviews.length}
              </span>
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-neutral-900/30 border border-white/5 rounded-3xl border-dashed">
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
                 <Plus className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Interviews Yet
              </h3>
              <p className="text-neutral-400 max-w-md mb-8">
                You haven't created any interviews yet. Start your first session to begin practicing.
              </p>
              <Link href="/dashboard">
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                  Create Interview
                </Button>
              </Link>
            </div>
          ) : (
            interviews.map((interview) => (
              <div key={interview.id} className="h-[420px]">
                <InterviewCard
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
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
