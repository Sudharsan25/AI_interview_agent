"use client";

/**
 * Interview Form Container Component
 * Orchestrates form state and submission logic
 */

import { Form } from "@/components/ui";
import { Button } from "@/components/ui";
import { useInterviewForm } from "@/hooks";
import { InterviewFormHeader } from "./interview-form-header";
import { InterviewFormFields } from "./interview-form-fields";

export function InterviewFormContainer() {
  const { form, onSubmit, handleLengthChange } = useInterviewForm();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-10 blur-sm transition duration-500 group-hover:opacity-25"></div>
        <div className="relative flex flex-col items-center gap-6 sm:gap-8 p-6 sm:p-8 md:p-12 bg-neutral-900 rounded-3xl border border-white/10 shadow-2xl">
          <InterviewFormHeader />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6">
              <InterviewFormFields
                form={form}
                onLengthChange={handleLengthChange}
              />

              <div className="pt-6">
                <Button
                  className="w-full h-14 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  type="submit"
                  disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Generating..."
                    : "Generate Interview Session"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
