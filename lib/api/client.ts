/**
 * Base API client with consistent error handling
 * Provides typed fetch wrapper for all API calls
 */

import { ApiError, toApiError } from "@/lib/errors";
import type { ApiResponse, ApiErrorResponse } from "@/types";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Base fetch wrapper with error handling and type safety
 * 
 * @param endpoint - API endpoint URL (relative or absolute)
 * @param options - Fetch options including method, body, headers, and query params
 * @returns Typed response data
 * @throws {ApiError} If the request fails or returns an error response
 */
async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = endpoint;
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url = `${endpoint}?${searchParams.toString()}`;
  }

  try {
    // Don't set Content-Type for FormData - browser will set it with boundary
    const isFormData = fetchOptions.body instanceof FormData;
    const headers: HeadersInit = isFormData
      ? { ...fetchOptions.headers }
      : {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        };

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle non-JSON responses (e.g., audio streams)
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      if (!response.ok) {
        throw new ApiError(
          `Request failed with status ${response.status}`,
          response.status
        );
      }
      return response as unknown as T;
    }

    const data: ApiResponse<T> | ApiErrorResponse = await response.json();

    // Handle API error responses
    if (!response.ok || ("success" in data && !data.success)) {
      const errorData = data as ApiErrorResponse;
      throw new ApiError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData.code
      );
    }

    // Return typed data
    if ("data" in data && data.data !== undefined) {
      return data.data as T;
    }

    // For responses that don't follow the standard format
    return data as unknown as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw toApiError(error);
  }
}

/**
 * Typed API client functions for each endpoint
 */
export const apiClient = {
  /**
   * Create a new interview session
   * 
   * @param data - Interview creation data including role, level, type, techstack, etc.
   * @returns Success response with interviewId
   * @throws {ApiError} If interview creation fails
   */
  async createInterview(data: {
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
  }): Promise<{ success: true; interviewId: string }> {
    return apiFetch("/api/interview/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get questions for an interview
   * 
   * @param interviewId - The ID of the interview
   * @returns Success response with array of questions
   * @throws {ApiError} If questions cannot be fetched
   */
  async getInterviewQuestions(
    interviewId: string
  ): Promise<{ success: true; questions: Array<{ id: string; interviewId: string; questionText: string }> }> {
    return apiFetch(`/api/interview/${interviewId}`);
  },

  /**
   * Get all interviews for the current user
   */
  async getUserInterviews(): Promise<{
    success: true;
    data: unknown[];
  }> {
    const response = await fetch("/api/interview/user-interview");
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData.code
      );
    }
    
    const data = await response.json();
    return data as { success: true; data: unknown[] };
  },

  /**
   * Get upcoming/incomplete interviews
   */
  async getUpcomingInterviews(): Promise<{
    success: true;
    data: unknown[];
  }> {
    const response = await fetch("/api/interview/upcoming");
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData.code
      );
    }
    
    const data = await response.json();
    return data as { success: true; data: unknown[] };
  },

  /**
   * Process interview completion with transcripts
   * 
   * @param interviewId - The ID of the interview
   * @param transcripts - Map of question IDs to transcript texts
   * @param completed - Whether the interview was fully completed (all questions answered)
   */
  async processInterview(
    interviewId: string,
    transcripts: Record<string, string>,
    completed: boolean = false
  ): Promise<{ success: true; message: string }> {
    const formData = new FormData();
    
    // Add completed flag
    formData.append("completed", completed.toString());
    
    // Add transcripts as text files
    for (const [questionId, transcriptText] of Object.entries(transcripts)) {
      formData.append(
        questionId,
        new Blob([transcriptText], { type: "text/plain" }),
        `${questionId}.txt`
      );
    }

    return apiFetch(`/api/interview/${interviewId}/process`, {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Get Deepgram API key
   */
  async getDeepgramKey(): Promise<{ success: true; apiKey: string }> {
    return apiFetch("/api/deepgram");
  },

  /**
   * Generate text-to-speech audio using AWS Polly
   * Returns a Blob response, not JSON
   * 
   * @param text - The text to convert to speech
   * @returns Audio blob (MP3 format)
   * @throws {ApiError} If TTS generation fails
   */
  async generateTTS(text: string): Promise<Blob> {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `TTS generation failed with status ${response.status}`,
        response.status
      );
    }

    return response.blob();
  },
};

// Re-export auth client for convenience
export { authClient, signIn, signUp, useSession, signOut } from "../auth-client";
