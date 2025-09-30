interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

export interface Interview {
  id: string; // Assuming uuid
  userId: string;
  role: string;
  level: string;
  type: string;
  techstack: string; // Or string[] if you store it as a JSON array
  length: string;
  jobDesc: string;
  companyDetails?: string | null;
  specialization?: string | null;
  createdAt: Date; // ISO date string
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  level: string;
  length: string;
  techstack: string;
  jobDesc: string,
  companyDetails?: string | null;
  specialization?: string | null;
  createdAt: Date;
}

interface Question {
  id: string,
  interviewId: string,
  questionText: string
}

interface InterviewClientProps {
  initialData: {
    details: Interview;
    questions: Question[];
  };
}

interface AgentProps {
  userName?: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

declare global {
  interface Window {
    puter: {
      ai: {
        txt2speech: (text: string) => Promise<HTMLAudioElement>;
      };
    };
  }
}