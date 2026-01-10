import { mappings, interviewCovers } from "@/constants";

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/[^a-z0-9]/gi, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

export const getTechLogo = async (techName: string): Promise<string> => {
  const normalized = normalizeTechName(techName);
  const potentialUrl = `${techIconBaseURL}/${normalized}/${normalized}-original.svg`;
  const iconExists = await checkIconExists(potentialUrl);
  return iconExists ? potentialUrl : "/tech.svg";
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
