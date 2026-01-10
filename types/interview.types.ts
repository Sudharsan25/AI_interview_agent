import { Question } from "./api.types";

export interface Interview {
  id: string; // Assuming uuid
  userId: string;
  role: string;
  level: string;
  type: string;
  techstack: string; // Or string[] if you store it as a JSON array
  length: string;
  jobDesc: string;
  completed: boolean;
  companyDetails?: string | null;
  specialization?: string | null;
  resumeDetails?: string | null;
  createdAt: Date; // ISO date string
}

export interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  level: string;
  length: string;
  techstack: string;
  jobDesc: string;
  companyDetails?: string | null;
  specialization?: string | null;
  createdAt: Date;
  completed: boolean;
}

export interface InterviewClientProps {
  initialData: {
    details: Interview;
    questions: Question[];
  };
}

export interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

export interface AgentProps {
  userName?: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

export interface TechIconProps {
  techStack: string[];
}
