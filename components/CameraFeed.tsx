// in components/CameraFeed.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react"; // 1. Import icons

export function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null); // Store the stream in state
  const [error, setError] = useState<string | null>(null);
  
  // 2. Add state for video and audio toggles
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  // This effect runs once to get the initial media stream
  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream); // Store the stream in state
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions and refresh.");
      }
    };

    getMediaStream();

    // Cleanup function
    return () => {
      // Access the stream from the state variable in the cleanup
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []); // The empty dependency array ensures this runs only once

  // 3. Create toggle functions
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(prev => !prev);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(prev => !prev);
    }
  };

  return (
    <Card className="flex flex-col h-full border-0.5 rounded-2xl border-gray-500"> {/* Make card a flex column */}
      <CardHeader>
        <CardTitle>Your Camera Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center"> {/* Make content grow */}
        {error ? (
          <div className="flex items-center justify-center h-full bg-muted rounded-md">
            <p className="text-destructive text-center p-4">{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto rounded-md bg-muted"
          />
        )}
      </CardContent>
      {/* 4. Add the CardFooter with control buttons */}
      <CardFooter className="flex justify-center gap-4">
        <Button 
          onClick={toggleAudio}
          variant={isAudioEnabled ? "secondary" : "destructive"}
          size="icon"
        >
          {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>
        <Button
          onClick={toggleVideo}
          variant={isVideoEnabled ? "secondary" : "destructive"}
          size="icon"
        >
          {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}