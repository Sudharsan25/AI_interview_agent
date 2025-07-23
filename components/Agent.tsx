"use client"

import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage{
    role: 'user' | 'system' | 'assistant',
    content: string
}

const Agent = ({userName, userId, interviewId, feedbackId, type, questions} : AgentProps) => {
    const router = useRouter();

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [lastMessage, setLastMessage] = useState<string>("");

    useEffect(() => {
      const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

      const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

      const onMessage = (message: Message) => {
        if(message.type === 'transcript' && message.transcriptType === 'final'){
            const newMessage = {role: message.role, content: message.transcript}

             setMessages((prev) => [...prev, newMessage])
        }
      }

      const onSpeakStart = () => setIsSpeaking(true);
      const onSpeakEnd = () => setIsSpeaking(false);
      
      const onError = (error: Error) => console.log('Error', error);
      
      vapi.on('call-start', onCallStart);
      vapi.on('call-end', onCallEnd);
      vapi.on('message', onMessage);
      vapi.on('speech-start', onSpeakStart);
      vapi.on('speech-end', onSpeakEnd);
      vapi.on('error', onError);


      return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeakStart);
            vapi.off('speech-end', onSpeakEnd);
            vapi.off('error', onError);
      }
    }, [])
    
    useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    // const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    //   console.log("handleGenerateFeedback");

    //   const { success, feedbackId: id } = await createFeedback({
    //     interviewId: interviewId!,
    //     userId: userId!,
    //     transcript: messages,
    //     feedbackId,
    //   });

    //   if (success && id) {
    //     router.push(`/interview/${interviewId}/feedback`);
    //   } else {
    //     console.log("Error saving feedback");
    //     router.push("/");
    //   }
    // };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } 
    }
  }, [messages, callStatus,router,type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    };
    };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
        <div className='call-view'>
            <div className='card-interviewer'>
                <div className="avatar">
                    <Image src="/ai-avatar.png" alt="vapi" width={65} height={64} className='object-cover' />

                    {isSpeaking && <span className='animate-speak'></span>}
                </div>
                <h3> AI interview</h3>
            </div>
                <div className="card-border">
                    <div className='card-content'>
                        <Image src='/user-avatar.png'  alt='user-avatar' width={540} height={540} className='rounded-full object-cover size-[120px]'/>
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>  

            {messages.length > 0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                {callStatus !== "ACTIVE" ? (
                <button className="relative btn-call" onClick={() => handleCall()}>
                    <span
                    className={cn(
                        "absolute animate-ping rounded-full opacity-75",
                        callStatus !== "CONNECTING" && "hidden"
                    )}
                    />

                    <span className="relative">
                    {callStatus === "INACTIVE" || callStatus === "FINISHED"
                        ? "Call"
                        : ". . ."}
                    </span>
                </button>
                ) : (
                <button className="btn-disconnect" onClick={() => handleDisconnect()}>
                    End
                </button>
                )}
            </div>

    </>
  )
}

export default Agent