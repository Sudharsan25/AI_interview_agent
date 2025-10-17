import React from "react";
import { Button } from "./ui/button";
import { InterviewCardProps } from "@/types";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { TechLogo } from "./TechLogo";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
// A helper component for consistent styling
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-2 items-center">
    <span className="text-sm font-medium text-muted-foreground col-span-1">
      {label}
    </span>
    <span className="col-span-1 text-sm">{value}</span>
  </div>
);

const InterviewCard = ({
  interviewId,
  role,
  length,
  level,
  techstack,
  jobDesc,
  companyDetails,
  specialization,
  completed,
}: InterviewCardProps) => {
  const techArray = techstack.split(",").map((t) => {
    // First, trim whitespace and remove quotes
    const cleanedTech = t.trim().replace(/^"|"$/g, "");

    // Then, capitalize the first letter and add the rest of the string
    if (cleanedTech.length === 0) return ""; // Handle empty strings
    return cleanedTech.charAt(0).toUpperCase() + cleanedTech.slice(1);
  });
  const primaryTech = techArray[0];

  return (
    <div className="card-border w-[405] min-h-[120]">
      <div className="card-interview">
        <div className="flex flex-col justify-around gap-4">
          <div className="flex flex-col justify-around gap-4">
            <div className="flex gap-4 items-center justify-center py-4">
              <TechLogo techName={primaryTech} />
              <p className="capitalize text-2xl">{role} Interview</p>
            </div>
            <div className="grid gap-4 py-2">
              {/* Conditionally render optional fields */}
              <DetailRow label="Required experience" value={`${level} level`} />
              <DetailRow label="Length of Interview" value={length} />
              {specialization && (
                <DetailRow label="Specialization" value={specialization} />
              )}
              {companyDetails && (
                <div className="grid gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Company Details
                  </span>
                  <p className="text-sm text-foreground">{companyDetails}</p>
                </div>
              )}

              {/* Description */}
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Job Description Focus
                </span>
                <p className="text-sm text-foreground">{jobDesc}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Technologies:{" "}
              </span>
              <div className="flex flex-wrap gap-2">
                {techArray.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-around gap-2">
          {completed ? (
            <span className="text-white text-lg font-bold text-center my-4">
              Interview Completed
            </span>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-fit rounded-2xl" variant="outline">
                  Start Interview
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    <p className="capitalize text-2xl">{role} Interview</p>
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <p className="text-white text-center">
                    You are about the start the interview. You can not exit the
                    application until the interview is completed. Do you want to
                    proceed.
                  </p>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Link href={`/interview-start/${interviewId}`}>
                      <Button
                        className="rounded-2xl w-full text-center"
                        variant="outline">
                        Start Interview
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
};

export default InterviewCard;
