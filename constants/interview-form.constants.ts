/**
 * Interview form constants and schema
 */

import z from "zod";

export const interviewFormSchema = z.object({
  role: z.string().min(1, { message: "Role cannot be empty." }),
  level: z.string().min(1, { message: "Level cannot be empty." }),
  type: z.string().min(1, { message: "Type cannot be empty." }),
  techstack: z.string().nonempty({ message: "Tech stack cannot be empty." }),
  length: z.enum(["short", "medium", "long"], {
    required_error: "Please select an interview length.",
  }),
  jobDesc: z.string().min(8),
  companyDetails: z.string().optional(),
  specialization: z.string().optional(),
  resumeDetails: z.string().optional(),
});

export type InterviewFormData = z.infer<typeof interviewFormSchema>;

export const interviewFormDefaultValues: InterviewFormData = {
  role: "",
  level: "",
  type: "",
  techstack: "",
  length: "short",
  companyDetails: "",
  specialization: "",
  jobDesc: "",
  resumeDetails: "",
};
