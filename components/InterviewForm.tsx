"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormFieldCompnent from "./FormField"; // Assuming this path is correct
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";

const interviewSchema = () => {
  return z.object({
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
};

const InterviewForm = () => {
  const formSchema = interviewSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      level: "",
      type: "",
      techstack: "",
      length: "short",
      companyDetails: "",
      specialization: "",
      jobDesc: "",
      resumeDetails: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Clicked");
    const {
      role,
      level,
      type,
      techstack,
      length,
      companyDetails,
      specialization,
      jobDesc,
      resumeDetails,
    } = data; // Destructure amount

    console.log("Submitted data:", {
      role,
      level,
      type,
      techstack,
      length,
      companyDetails,
      specialization,
      jobDesc,
      resumeDetails,
    });

    try {
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          level,
          type,
          techstack,
          length,
          jobDesc,
          companyDetails,
          specialization,
          resumeDetails,
          completed: false,
        }),
      });

      if (!response.ok) {
        // Handle non-2xx responses
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Something went wrong with the interview generation."
        );
      }

      const result = await response.json();
      console.log("API Response:", result);
      toast("Interview created successfully!!");
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Use 'any' for error type if not strictly typed
      console.error("Error submitting form:", error);
      // Handle errors, e.g., display an error message to the user
      alert(`Failed to generate interview: ${error.message}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-10 blur-sm transition duration-500 group-hover:opacity-25"></div>
        <div className="relative flex flex-col items-center gap-8 p-8 md:p-12 bg-neutral-900 rounded-3xl border border-white/10 shadow-2xl">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Create New Interview
            </h2>
            <p className="text-neutral-400 max-w-md mx-auto">
              Configure your AI interview session. Provide the details below to generate a tailored experience.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormFieldCompnent
                  control={form.control}
                  name="role"
                  label="Role"
                  placeholder="e.g. Senior Frontend Engineer"
                  type="text"
                />

                <FormFieldCompnent
                  control={form.control}
                  name="level"
                  label="Experience Level"
                  placeholder="e.g. Senior, Mid-level"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormFieldCompnent
                  control={form.control}
                  name="type"
                  label="Interview Type"
                  placeholder="e.g. System Design, Behavioral"
                  type="text"
                />

                <FormFieldCompnent
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
                        if (value === "medium" || value === "long") {
                          toast.info(
                            "Beta limitation: Only short interviews are available currently."
                          );
                        } else {
                          field.onChange(value);
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-12 rounded-xl bg-neutral-800 border-white/10 text-white focus:ring-blue-500/50 focus:ring-offset-0">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-neutral-900 border-white/10 text-white">
                        <SelectItem className="focus:bg-white/10 cursor-pointer" value="short">
                          Short (15 mins)
                        </SelectItem>
                        <SelectItem className="focus:bg-white/10 cursor-pointer opacity-50" value="medium" disabled>
                          Medium (30 mins) - Coming Soon
                        </SelectItem>
                        <SelectItem className="focus:bg-white/10 cursor-pointer opacity-50" value="long" disabled>
                          Long (60 mins) - Coming Soon
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="space-y-6 pt-2">
                <FormFieldCompnent
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
                  <FormFieldCompnent
                    control={form.control}
                    name="specialization"
                    label="Specialization (Optional)"
                    placeholder="e.g. Platform, UI/UX"
                    type="text"
                  />

                  <FormFieldCompnent
                    control={form.control}
                    name="companyDetails"
                    label="Company Context (Optional)"
                    placeholder="e.g. Fintech startup, fast-paced"
                    type="text"
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button
                  className="w-full h-14 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  type="submit"
                >
                  Generate Interview Session
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default InterviewForm;
