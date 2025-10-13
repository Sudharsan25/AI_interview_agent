"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getTechLogo } from "@/lib/utils"; // Your async logo-fetching function

export function TechLogo({ techName }: { techName: string }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if techName is not provided
    if (!techName) return;

    const fetchLogo = async () => {
      const url = await getTechLogo(techName);
      setLogoUrl(url);
    };

    fetchLogo();
  }, [techName]); // Re-fetch if the techName prop changes

  // Display a placeholder or nothing while loading
  if (!logoUrl) {
    return (
      <div className="w-[35px] h-[35px] bg-gray-600 animate-pulse rounded-md" />
    );
  }

  return (
    <Image
      src={logoUrl}
      alt={`${techName} logo`}
      width={35}
      height={35}
      className="object-contain"
    />
  );
}
