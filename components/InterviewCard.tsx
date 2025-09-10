import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Feedback, InterviewCardProps } from '@/types';
import Link from 'next/link';
import { Badge } from './ui/badge';
// A helper component for consistent styling
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="col-span-2 text-sm">{value}</span>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InterviewCard = ({interviewId, role, type, length, level, techstack, jobDesc, companyDetails, specialization, createdAt}: InterviewCardProps) => {

    const feedback = null as Feedback | null;
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
    
    // ...existing code...
    // ...existing code...
    const techArray = techstack.split(",").map((t) => t.trim());



    return (
        <div className='card-border w-[405] min-h-[120]'>
            <div className="card-interview">
                <div className='flex flex-col justify-around gap-4'>
                    <div>
                        <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                            <p className='badge-text'>{normalizedType}</p>
                        </div>

                        {/* <Image src={getRandomInterviewCover()} alt='cover image' width={90} height={90} className='rounded-full object-fit size-[90px]' /> */}

                        <h3 className='mt-5 capitalize'>
                            {role} Interview
                        </h3>

                        <div className='flex flex-row gap-5 mt-3'>
                            <div className='flex flex-row gap-2'>
                                <Image src='/calendar.svg' alt='calendar' width={22} height={22}/>
                                <p>{formattedDate}</p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <Image src='/star.svg' alt='star' height={22} width={22}/>
                                <p>{feedback?.totalScore || '--'}/100</p>
                            </div>
                        </div>
                    </div>

                    <p className="line-clamp-2 mt-5">
                        {feedback?.finalAssessment || "You haven't taken the interview yet!! Take it now"}
                    </p>
                </div>

                <div className='flex flex-row justify-end'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full rounded-2xl" variant="outline">
                            Interview Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                            <DialogTitle>{role}</DialogTitle>
                            <DialogDescription>
                                Created on {formattedDate}. Type: {type}.
                            </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                            <DetailRow label="Experience Level" value={level} />
                            <DetailRow label="Interview Length" value={length} />

                            {/* Conditionally render optional fields */}
                            {specialization && (
                                <DetailRow label="Specialization" value={specialization} />
                            )}
                            {companyDetails && (
                                <DetailRow label="Company Details" value={companyDetails} />
                            )}

                            {/* Description */}
                            <div className="grid gap-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                Job Description Focus
                                </span>
                                <p className="text-sm text-foreground">{jobDesc}</p>
                            </div>

                            {/* Tech Stack with Badges */}
                            <div className="grid gap-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                Technologies
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

                            <DialogFooter className="sm:justify-between">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                Close
                                </Button>
                            </DialogClose>
                                <Link href={`/interview/${interviewId}`}>
                                    <Button type="button">Start Interview</Button>
                                </Link>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>
                </div>
            </div>
        
        </div>
    )
}

export default InterviewCard
