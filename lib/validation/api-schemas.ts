/**
 * Zod schemas for API request validation
 * Used to validate incoming API requests
 */

import { z } from "zod";

/**
 * Schema for creating an interview
 */
export const createInterviewSchema = z.object({
  role: z.string().min(1, "Role is required"),
  level: z.string().min(1, "Level is required"),
  type: z.string().min(1, "Type is required"),
  techstack: z.union([
    z.string().min(1, "Tech stack is required"),
    z.array(z.string()).min(1, "Tech stack is required"),
  ]),
  length: z.enum(["short", "medium", "long"], {
    required_error: "Length is required",
  }),
  jobDesc: z.string().min(8, "Job description must be at least 8 characters"),
  companyDetails: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  resumeDetails: z.string().optional().nullable(),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;

/**
 * Schema for TTS request
 */
export const ttsRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export type TTSRequestInput = z.infer<typeof ttsRequestSchema>;
