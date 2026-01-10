/**
 * Service for interview session operations
 * Handles interview session state and transcript management
 */

import { apiClient } from "@/lib/api/client";

export interface InterviewSessionState {
  currentQuestionIndex: number;
  completedTranscripts: Record<string, string>;
  isProcessing: boolean;
}

/**
 * Processes interview completion - saves transcripts and updates interview status
 * Uses the centralized API client for type safety and error handling
 * 
 * @param interviewId - The ID of the interview
 * @param transcripts - Map of question IDs to transcript texts
 * @param completed - Whether the interview was fully completed (all questions answered)
 */
export async function processInterviewCompletion(
  interviewId: string,
  transcripts: Record<string, string>,
  completed: boolean = false
): Promise<void> {
  // TODO: Implement complete transcript-based feedback logic
  // This will include:
  // - Storing transcripts in database
  // - Generating feedback
  // - Comprehensive interview evaluation

  try {
    await apiClient.processInterview(interviewId, transcripts, completed);
    console.log(`Successfully processed interview ${interviewId}, completed: ${completed}`);
  } catch (error) {
    console.error(`Error processing interview ${interviewId}:`, error);
    throw error; // Re-throw to be handled by the calling component/hook
  }
}
