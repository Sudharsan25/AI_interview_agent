"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  interviewFormSchema,
  type InterviewFormData,
  interviewFormDefaultValues,
} from "@/constants/interview-form.constants";
import { createInterviewSession } from "@/lib/services/client";

/**
 * Custom hook for interview form logic
 * Separates form state management and submission logic
 */
export function useInterviewForm() {
  const router = useRouter();

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: interviewFormDefaultValues,
  });

  const onSubmit = async (data: InterviewFormData) => {
    try {
      const response = await createInterviewSession({
        role: data.role,
        level: data.level,
        type: data.type,
        techstack: data.techstack,
        length: data.length,
        jobDesc: data.jobDesc,
        companyDetails: data.companyDetails || undefined,
        specialization: data.specialization || undefined,
        resumeDetails: data.resumeDetails || undefined,
        completed: false,
      });

      if (response.success) {
        toast.success("Interview created successfully!!");
        router.push("/home");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate interview. Please try again.";
      console.error("Error submitting form:", error);
      toast.error(errorMessage);
    }
  };

  const handleLengthChange = (value: string) => {
    if (value === "medium" || value === "long") {
      toast.info(
        "Beta limitation: Only short interviews are available currently."
      );
    }
    // Note: Actual field update is handled in the form field component
    // to prevent state updates when value is invalid
  };

  return {
    form,
    onSubmit,
    handleLengthChange,
  };
}
