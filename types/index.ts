// Barrel export for all types
export * from "./auth.types";
export * from "./interview.types";
export * from "./api.types";
export * from "./vapi.types";

// Global window types
declare global {
  interface Window {
    puter: {
      ai: {
        txt2speech: (text: string) => Promise<HTMLAudioElement>;
      };
    };
  }
}