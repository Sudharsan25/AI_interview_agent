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
      // Here you can handle the successful response from your API,
      // e.g., redirect the user, display a success message, etc.
      alert(
        `Interview generated successfully! Interview ID: ${
          result.interviewId || "N/A"
        }`
      );
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
    <div className="w-2xl">
      <div className="flex flex-col items-center gap-6 card py-14 px-10 shadow-sm shadow-primary-200/10 bg-gray-900/25">
        <div className="flex flex-row justify-evenly items-center w-full">
          <h2 className="text-white">Create your interview now</h2>
        </div>

        <p className="text-white font-semibold">
          Provide the required details to simulate your interview!
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form">
            <FormFieldCompnent
              control={form.control}
              name="role"
              label="Role"
              placeholder="Interview/Job role"
              type="text"
            />

            <FormFieldCompnent
              control={form.control}
              name="type"
              label="Type"
              placeholder="Technical, Behavioural or Screening..."
              type="text"
            />

            <FormFieldCompnent
              control={form.control}
              name="level"
              label="Experience Level"
              placeholder="Entry, Mid, Senior..."
              type="text"
            />

            <FormFieldCompnent
              control={form.control}
              name="techstack"
              label="Skills/Technologies"
              placeholder="e.g., React, Node.js, Python..."
              type="text"
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">
                    The length of interview
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (value === "medium" || value === "long") {
                        toast(
                          "This is a beta version using free resources, so usage is restricted to short interviews only. We apologize for the inconvenience."
                        );
                      } else {
                        field.onChange(value); // Only update form for 'short'
                      }
                    }}
                    value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-2xl min-h-12 !bg-dark-200">
                        <SelectValue placeholder="Select an interview length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="rounded-2xl" value="short">
                        Short
                      </SelectItem>
                      <SelectItem className="rounded-2xl" value="medium">
                        Medium (Coming Soon)
                      </SelectItem>
                      <SelectItem className="rounded-2xl" value="long">
                        Long (Coming Soon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormFieldCompnent
              control={form.control}
              name="jobDesc"
              label="Job Description"
              placeholder="Skills or responsibilities specific to the Job description"
              type="text" // Changed to number type for input
            />

            <FormFieldCompnent
              control={form.control}
              name="specialization"
              label="Specialization of the role (If Applicable)"
              placeholder="Any specific domain or team"
              type="text" // Changed to number type for input
            />

            <FormFieldCompnent
              control={form.control}
              name="companyDetails"
              label="Details about the company (Optional)"
              placeholder="Company Name, Vision, Mission and Principles followed"
              type="text" // Changed to number type for input
            />

            <Button
              className="bg-primary text-primary-foreground hover:bg-sidebar-primary/90 rounded-full min-h-12 font-bold w-full"
              type="submit">
              Generate an Interview
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InterviewForm;
