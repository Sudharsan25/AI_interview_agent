/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { InterviewClientProps } from '@/types';
import React, { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {Avatar, AvatarFallback} from "./ui/avatar";
import { CameraFeed } from './CameraFeed';
import { Button } from './ui/button';
import clsx from 'clsx';

const InterviewClient = ({ initialData }: InterviewClientProps) => {
    const [interviewDetails, setInterviewDetails] = useState(initialData.details);
    const [questions, setQuestions] = useState(initialData.questions);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Start at -1 for the welcome message
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const [agentTranscript, setAgentTranscript] = useState("I will be your interviewer today! Let us start with the questions once you click the 'I am ready' button");

    return (
        <div className='flex h-fit w-full bg-background text-foreground'>
            {/* SideBar for questions*/}
            {/* <div className='w-64 flex-col border-r bg-muted/40 p-4 md:flex'>
                 <Sidebar>
                    <SidebarContent>
                        <SidebarGroup>
                        <SidebarGroupLabel className='mb-4'>Questions</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                            {questions.map((question, index) => (
                                <SidebarMenuItem key={question.id}>
                                    <span>{`Question-${index+1}`}</span>
                                </SidebarMenuItem>
                            ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
            </div> */}

            {/* 1. Refined Sidebar */}
            <aside className="w-64 flex-col border-0.5 rounded-2xl border-gray-500 bg-muted/40 p-4 mr-4 hidden md:flex">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Questions</h2>
                </div>
                <nav className="flex flex-col gap-2">
                    {questions.map((question, index) => (
                        <Button
                            key={question.id}
                            variant="ghost"
                            className={clsx(
                                "justify-start text-left",
                                { "bg-accent text-accent-foreground": index === currentQuestionIndex }
                            )}
                        >
                            {`Question ${index + 1}`}
                        </Button>
                    ))}
                </nav>
            </aside>
            
            <main className='flex flex-1 flex-col p-4 md:p-8 min-h-[400]'>
                <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <Card className={clsx(
                        "flex flex-col items-center border-0.5 rounded-2xl border-gray-500 justify-center text-center transition-all duration-300",
                         { "ring-2 ring-blue-500 ring-offset-4 ring-offset-background": isAgentSpeaking }
                    )}>
                        <CardContent className="flex flex-col items-center justify-center gap-6">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="text-3xl">AI</AvatarFallback>
                            </Avatar>
                            {isAgentSpeaking && <div className="text-sm text-blue-400">Speaking...</div>}
                            <p className="text-lg text-muted-foreground p-4">
                                {agentTranscript}
                            </p>
                        </CardContent>
                    </Card>
                    {/* 3. Dynamic Camera Feed Card */}
                    
                    <CameraFeed />
                </div>
                <footer className="flex items-center justify-center pt-8">
                    <Button size="lg">
                        {currentQuestionIndex === 0 ? "I am ready" : "Next Question"}
                    </Button>
                </footer>
            </main>

        </div>
    )
}

export default InterviewClient