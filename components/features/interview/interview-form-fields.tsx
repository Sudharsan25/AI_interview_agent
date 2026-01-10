/**
 * Interview Form Fields Component (Presentational)
 * Renders form input fields
 */

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { FormField as FormFieldComponent } from "@/components/features/shared";
import type { UseFormReturn } from "react-hook-form";
import type { InterviewFormData } from "@/constants/interview-form.constants";

interface InterviewFormFieldsProps {
  form: UseFormReturn<InterviewFormData>;
  onLengthChange: (value: string) => void;
}

export function InterviewFormFields({
  form,
  onLengthChange,
}: InterviewFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormFieldComponent
          control={form.control}
          name="role"
          label="Role"
          placeholder="e.g. Senior Frontend Engineer"
          type="text"
        />

        <FormFieldComponent
          control={form.control}
          name="level"
          label="Experience Level"
          placeholder="e.g. Senior, Mid-level"
          type="text"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormFieldComponent
          control={form.control}
          name="type"
          label="Interview Type"
          placeholder="e.g. System Design, Behavioral"
          type="text"
        />

        <FormFieldComponent
          control={form.control}
          name="techstack"
          label="Tech Stack"
          placeholder="e.g. React, Node.js, AWS"
          type="text"
        />
      </div>

      <FormField
        control={form.control}
        name="length"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-neutral-300 font-medium">
              Interview Duration
            </FormLabel>
            <Select
              onValueChange={(value) => {
                // handleLengthChange validates and prevents medium/long
                // Only update field if validation passes
                if (value !== "medium" && value !== "long") {
                  field.onChange(value);
                }
                onLengthChange(value);
              }}
              value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full h-12 rounded-xl bg-neutral-800 border-white/10 text-white focus:ring-blue-500/50 focus:ring-offset-0">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-neutral-900 border-white/10 text-white">
                <SelectItem
                  className="focus:bg-white/10 cursor-pointer"
                  value="short">
                  Short (15 mins)
                </SelectItem>
                <SelectItem
                  className="focus:bg-white/10 cursor-pointer opacity-50"
                  value="medium"
                  disabled>
                  Medium (30 mins) - Coming Soon
                </SelectItem>
                <SelectItem
                  className="focus:bg-white/10 cursor-pointer opacity-50"
                  value="long"
                  disabled>
                  Long (60 mins) - Coming Soon
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      <div className="space-y-6 pt-2">
        <FormFieldComponent
          control={form.control}
          name="jobDesc"
          label="Job Description Focus"
          placeholder="Paste key requirements or responsibilities..."
          type="text"
        />

        <FormField
          control={form.control}
          name="resumeDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-300 font-medium">
                Resume Details (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste your resume details (projects, experience, skills)..."
                  className="min-h-[120px] rounded-xl bg-neutral-800 border-white/10 text-white placeholder:text-neutral-500 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormFieldComponent
            control={form.control}
            name="specialization"
            label="Specialization (Optional)"
            placeholder="e.g. Platform, UI/UX"
            type="text"
          />

          <FormFieldComponent
            control={form.control}
            name="companyDetails"
            label="Company Context (Optional)"
            placeholder="e.g. Fintech startup, fast-paced"
            type="text"
          />
        </div>
      </div>
    </>
  );
}
