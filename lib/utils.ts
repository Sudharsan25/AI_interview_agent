import { interviewCovers, mappings } from "@/constants";
import { Interview } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/[^a-z0-9]/gi, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};
export const getTechLogo = async (techName: string): Promise<string> => {
  // 1. Normalize the single tech name
  const normalized = normalizeTechName(techName);
  // 2. Construct the potential URL for the icon
  const potentialUrl = `${techIconBaseURL}/${normalized}/${normalized}-original.svg`;

  // 3. Check if the icon actually exists at that URL
  const iconExists = await checkIconExists(potentialUrl);

  // 4. Return the correct URL or the fallback
  return iconExists ? potentialUrl : "/tech.svg";
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

export async function fetchUserInterviews(): Promise<Interview[]> {
  const response = await fetch("/api/interview/get-users-interview");

  if (!response.ok) {
    // This will activate the nearest `error.js` Error Boundary
    throw new Error("Failed to fetch interviews");
  }

  const result = await response.json();
  return result.data;
}
