import { createClient } from "@deepgram/sdk";

/**
 * Service for audio transcription operations
 */

/**
 * Transcribes audio buffer using Deepgram
 * @param audioBuffer - Audio buffer to transcribe
 * @returns Transcript text
 */
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    audioBuffer,
    { smart_format: true, model: "nova-2", language: "en-US" }
  );

  if (error) {
    throw error;
  }

  return result.results.channels[0].alternatives[0].transcript;
}

/**
 * Processes multiple audio files and returns transcripts
 * @param audioFiles - Map of questionId to audio buffer
 * @returns Map of questionId to transcript
 */
export async function transcribeMultipleAudio(
  audioFiles: Map<string, Buffer>
): Promise<Map<string, string>> {
  const transcripts = new Map<string, string>();
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

  for (const [questionId, audioBuffer] of audioFiles.entries()) {
    try {
      const transcript = await transcribeAudio(audioBuffer);
      transcripts.set(questionId, transcript);
    } catch (error) {
      console.error(`Error transcribing audio for question ${questionId}:`, error);
      // Continue with other files even if one fails
    }
  }

  return transcripts;
}
