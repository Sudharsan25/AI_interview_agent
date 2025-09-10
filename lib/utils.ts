import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { mappings } from "@/constants";
import { Interview } from "@/types";
const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const knownTechs = ["nextjs", "react", "python", "typescript", "javascript", "nodejs"];



const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
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

export const getInterviewLogo = async (interviewTitle: string) => {
  const defaultIcon = "/interview-icon.svg"; // Define your default icon path
  
  // Logic will go here
  const titleLower = interviewTitle.toLowerCase();
  const foundTech = knownTechs.find(tech => titleLower.includes(tech));

  if (!foundTech) {
    return defaultIcon;
  }

  const normalized = normalizeTechName(foundTech);
  const iconUrl = `${techIconBaseURL}/${normalized}/${normalized}-original.svg`;

  const exists = await checkIconExists(iconUrl);

  return exists ? iconUrl : defaultIcon;
};

export async function fetchUserInterviews(): Promise<Interview[]> {
  const response = await fetch('/api/interview/get-users-interview');

  if (!response.ok) {
    // This will activate the nearest `error.js` Error Boundary
    throw new Error('Failed to fetch interviews');
  }

  const result = await response.json();
  return result.data;
}