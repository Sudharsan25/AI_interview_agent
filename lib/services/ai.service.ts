import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import type { Interview } from "@/types";

/**
 * Service for AI/LLM operations
 */

export interface GenerateQuestionsParams {
  role: string;
  level: string;
  type: string;
  techstack: string;
  length: "short" | "mid" | "long";
  jobDesc: string;
  companyDetails?: string;
  specialization?: string;
  resumeDetails?: string;
}

const LENGTH_MAP = {
  short: 5,
  mid: 8,
  long: 10,
} as const;

/**
 * Generates interview questions using Google Gemini AI
 * @param params - Parameters for question generation
 * @returns Array of generated question strings
 */
export async function generateInterviewQuestions(
  params: GenerateQuestionsParams
): Promise<string[]> {
  const { role, level, type, techstack, length, jobDesc, companyDetails, specialization, resumeDetails } = params;

  const techstackString = Array.isArray(techstack)
    ? techstack.join(", ")
    : techstack;

  const numberOfQuestions = LENGTH_MAP[length] || 5;

  // Build the prompt
  let prompt = `Prepare exactly ${numberOfQuestions} questions for a job interview.
    The job role is ${role}.
    The job experience level is ${level}.
    The tech stack used in the job is: ${techstackString}.
    The focus between behavioural and technical questions should lean towards: ${type}.
    Here are some specific skills and responsibilities from the job description to focus on: ${jobDesc}.`;

  if (companyDetails) {
    prompt += `\nFor context, here are some details about the company: ${companyDetails}.`;
  }

  if (specialization) {
    prompt += `\nPlease tailor some questions towards this specialization: ${specialization}.`;
  }

  if (resumeDetails) {
    prompt += `\nThe candidate has provided the following resume details (projects, experience, skills). Please tailor the questions to relate to their background where appropriate:\n${resumeDetails}`;
  }

  prompt += `\n
    Please return only the questions, without any additional text or conversational filler.
    The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
    Return the questions formatted as a JSON array of strings, like this:
    ["Question 1", "Question 2", "Question 3"]
    Ensure there are exactly ${numberOfQuestions} questions.`;

  const result = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
  });

  // Parse the response
  const cleanText = result.text.replace(/```json\n|```/g, "").trim();
  const questionsArray: string[] = JSON.parse(cleanText);

  // Validate that the parsed result is indeed an array of strings
  if (
    !Array.isArray(questionsArray) ||
    !questionsArray.every((q) => typeof q === "string")
  ) {
    throw new Error("AI model did not return a valid JSON array of strings.");
  }

  return questionsArray;
}
