"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormFieldCompnent from './FormField'; // Assuming this path is correct
import { useRouter } from 'next/navigation';

const interviewSchema = () => {
    return z.object({
        role: z.string().min(1, { message: "Role cannot be empty." }),
        level: z.string().min(1, { message: "Level cannot be empty." }),
        type: z.string().min(1, { message: "Type cannot be empty." }),
        techstack: z.string().nonempty({ message: "Tech stack cannot be empty." }),
        length: z.string().nonempty({ message: "Please provide the interview Length." }),
        jobDesc: z.string().min(4),
        companyDetails:z.string().optional(),
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
            length:"",
            companyDetails:"",
            specialization:"",
            jobDesc:"",
        },
    });
    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      console.log("Clicked")
        const { role, level, type, techstack, length, companyDetails, specialization, jobDesc } = data; // Destructure amount
        const techstack_array = techstack.split(",").map(item => item.trim()); // Trim whitespace

        // IMPORTANT: In a real application, 'userid' should come from your authentication system (e.g., Firebase Auth currentUser.uid).
        // For demonstration purposes, we're generating a simple placeholder ID.
        const userId = "user_" + Math.random().toString(36).substring(2, 15);

        console.log("Submitted data:", { role, level, type, techstack: techstack_array, length, companyDetails, specialization , jobDesc});

        try {
            const response = await fetch('/api/interview/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role,
                    level,
                    type,
                    techstack: techstack_array,
                    length,
                    companyDetails,
                    specialization,
                    userid: userId,
                }),
            });

            if (!response.ok) {
                // Handle non-2xx responses
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong with the interview generation.');
            }

            const result = await response.json();
            console.log("API Response:", result);
            // Here you can handle the successful response from your API,
            // e.g., redirect the user, display a success message, etc.
            alert(`Interview generated successfully! Interview ID: ${result.interviewId || 'N/A'}`);
            router.push('/')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) { // Use 'any' for error type if not strictly typed
            console.error("Error submitting form:", error);
            // Handle errors, e.g., display an error message to the user
            alert(`Failed to generate interview: ${error.message}`);
        }
    };

    return (
        <div className="card-border w-full">
            <div className="flex flex-col items-center gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    {/* Assuming /logo.svg exists in your public directory */}
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">Create your interview now</h2>
                </div>

                <h3>Provide the required details to simulate your interview!</h3>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4 form"
                    >
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
                            placeholder="Experience required for job (Entry, Mid, Senior)..."
                            type="text"
                        />

                        <FormFieldCompnent
                            control={form.control}
                            name="techstack"
                            label="Skills/Technologies"
                            placeholder="Skills required for job (comma-separated, e.g., React, Node.js, Python)..."
                            type="text"
                        />

                        <FormFieldCompnent
                            control={form.control}
                            name="length"
                            label="The length of interview"
                            placeholder="Would you like the interview to be short, medium, or long?"
                            type="text" // Changed to number type for input
                        />

                        <FormFieldCompnent
                            control={form.control}
                            name="jobDesc "
                            label="Job Description"
                            placeholder="Skills or responsibilities specific to the Job description"
                            type="text" // Changed to number type for input
                        />

                        <FormFieldCompnent
                            control={form.control}
                            name="specialization"
                            label="Specialization of the role (If Applicable)"
                            placeholder="Any specific domain or team that you would be working on"
                            type="text" // Changed to number type for input
                        />

                        <FormFieldCompnent
                            control={form.control}
                            name="companyDetails"
                            label="Details about the company (Optional)"
                            placeholder="The company name, vision, mission and principles followed"
                            type="text" // Changed to number type for input
                        />

                        <Button className="btn" type="submit">
                            Generate an Interview
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default InterviewForm;