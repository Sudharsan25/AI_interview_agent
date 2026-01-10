"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getTechLogo } from "@/lib/utils";

interface TechLogoProps {
  techName: string;
}

export function TechLogo({ techName }: TechLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!techName) return;

    const fetchLogo = async () => {
      const url = await getTechLogo(techName);
      setLogoUrl(url);
    };

    fetchLogo();
  }, [techName]);

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
