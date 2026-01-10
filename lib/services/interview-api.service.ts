/**
 * Service for interview-related API calls
 * Handles client-side API communication
 * Uses the centralized API client for consistent error handling
 */

import { apiClient } from "@/lib/api/client";

export interface CreateInterviewRequest {
  role: string;
  level: string;
  type: string;
  techstack: string;
  length: string;
  jobDesc: string;
  companyDetails?: string;
  specialization?: string;
  resumeDetails?: string;
  completed?: boolean;
}

export interface CreateInterviewResponse {
  success: boolean;
  interviewId?: string;
  message?: string;
}

/**
 * Creates a new interview session via API
 * Uses the centralized API client for type safety and error handling
 */
export async function createInterviewSession(
  data: CreateInterviewRequest
): Promise<CreateInterviewResponse> {
  return apiClient.createInterview({
    role: data.role,
    level: data.level,
    type: data.type,
    techstack: data.techstack,
    length: data.length,
    jobDesc: data.jobDesc,
    companyDetails: data.companyDetails,
    specialization: data.specialization,
    resumeDetails: data.resumeDetails,
    completed: data.completed,
  });
}
