import React from "react";
import { Button, Badge } from "@/components/ui";
import { InterviewCardProps } from "@/types";
import Link from "next/link";
import { TechLogo } from "@/components/features/shared";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";

export function InterviewCard({
  interviewId,
  role,
  length,
  level,
  techstack,
  jobDesc,
  companyDetails,
  specialization,
  completed,
}: InterviewCardProps) {
  const techArray = techstack.split(",").map((t) => {
    const cleanedTech = t.trim().replace(/^"|"$/g, "");
    if (cleanedTech.length === 0) return "";
    return cleanedTech.charAt(0).toUpperCase() + cleanedTech.slice(1);
  });
  const primaryTech = techArray[0];

  return (
    <div className="group relative h-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-100 transition duration-500 blur-sm group-hover:blur"></div>
      <div className="relative h-full bg-neutral-900 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 hover:bg-neutral-800/50 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-xl border border-white/10">
              <TechLogo techName={primaryTech} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white capitalize leading-tight">
                {role}
              </h3>
              <p className="text-sm text-neutral-400 mt-1">
                {level} Level • {length}
              </p>
            </div>
          </div>
          {completed && (
            <Badge
              variant="secondary"
              className="bg-green-500/10 text-green-400 border-green-500/20">
              Completed
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-3 flex-1">
          {specialization && (
            <div className="text-sm">
              <span className="text-neutral-500">Specialization:</span>
              <span className="text-neutral-300 ml-2">{specialization}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Focus Area
            </span>
            <p className="text-sm text-neutral-300 line-clamp-2 leading-relaxed">
              {jobDesc}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex flex-wrap gap-2">
              {techArray.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10">
                  {tech}
                </Badge>
              ))}
              {techArray.length > 4 && (
                <Badge
                  variant="outline"
                  className="bg-white/5 border-white/10 text-neutral-400">
                  +{techArray.length - 4}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Action */}
        <div className="pt-2 mt-auto">
          {completed ? (
            <Button
              className="w-full bg-neutral-800 text-neutral-400 cursor-not-allowed hover:bg-neutral-800"
              disabled>
              View Results
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-900/20 transition-all duration-300 group-hover:shadow-blue-900/40">
                  Start Interview
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-neutral-900 border-white/10 sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <TechLogo techName={primaryTech} />
                      <span className="capitalize">{role} Interview</span>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="py-6 text-neutral-300">
                  <p>
                    You are about to start a simulated interview session. Ensure
                    you are in a quiet environment and have your microphone
                    ready.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-400 list-disc list-inside">
                    <li>Duration: {length}</li>
                    <li>Level: {level}</li>
                    <li>Cannot pause once started</li>
                  </ul>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Link
                      href={`/interview-start/${interviewId}`}
                      className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                        I'm Ready, Start Now
                      </Button>
                    </Link>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
