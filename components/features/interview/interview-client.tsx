/**
 * Interview Client Component (Legacy - Deprecated)
 * Use InterviewSessionContainer instead
 * This component is kept for backward compatibility during migration
 */

"use client";

import { InterviewSessionContainer } from "./interview-session-container";
import type { InterviewClientProps } from "@/types";

/**
 * @deprecated Use InterviewSessionContainer instead
 */
export function InterviewClient(props: InterviewClientProps) {
  return <InterviewSessionContainer {...props} />;
}
