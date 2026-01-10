export interface Question {
  id: string;
  interviewId: string;
  questionText: string;
}

export interface Feedback {
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

export interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

export interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

export interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

export interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

// API Response Types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  fields?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Interview API Response Types
export interface CreateInterviewResponse extends ApiSuccessResponse {
  interviewId: string;
}

export interface GetInterviewQuestionsResponse extends ApiSuccessResponse<Question[]> {
  questions: Question[];
}

// Note: Interview type is imported from interview.types.ts via barrel export
export interface GetUserInterviewsResponse extends ApiSuccessResponse {
  data: unknown[]; // Will be Interview[] when imported
}

export interface ProcessInterviewResponse extends ApiSuccessResponse {
  message: string;
}

// TTS API Types
export interface TTSRequest {
  text: string;
}

// Deepgram API Types
export interface DeepgramKeyResponse extends ApiSuccessResponse {
  apiKey: string;
}

// Process Interview Request Types
export interface ProcessInterviewRequest {
  [questionId: string]: File | Blob;
}
