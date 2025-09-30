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
import { getRandomInterviewCover } from '@/lib/utils';
// A helper component for consistent styling
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="col-span-2 text-sm">{value}</span>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InterviewCard = ({interviewId, role, type, length, level, techstack, jobDesc, companyDetails, specialization}: InterviewCardProps) => {

  const techArray = techstack.split(",").map((t) => t.trim());
    return (
        <div className='card-border w-[405] min-h-[120]'>
            <div className="card-interview">
                <div className='flex flex-col justify-around gap-4'>
                    <div className='flex flex-col justify-around gap-4'>
                        <div className='flex gap-4'>
                            <Image src={getRandomInterviewCover()} alt='cover image' width={50} height={50} className='rounded-full object-fit size-[90px]' />

                        <h3 className='mt-5 capitalize'>
                            {role} Interview
                        </h3>
                        </div>

                        <div className="flex flex-col items-start justify-around gap-4 text-lg text-muted-foreground">
                            <span className="flex items-center gap-1.5">Experience level: {level}</span>
                            <span className="flex items-center gap-1.5">Interview length: {length}</span>
                        </div>

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
                </div>

                <div className='flex flex-row justify-around gap-2'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-fit rounded-2xl" variant="outline">
                                More Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                            <DialogTitle>{role}</DialogTitle>
                            <DialogDescription>
                                Type: {type}.
                            </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">

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
                    <Link href={`/interview/${interviewId}`}>
                        <Button className='rounded-2xl' variant="outline">Start Interview</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default InterviewCard
