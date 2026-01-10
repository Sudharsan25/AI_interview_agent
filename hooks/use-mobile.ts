"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if the current viewport is mobile-sized
 * Uses window.matchMedia to detect screens smaller than 768px (md breakpoint)
 * 
 * @returns boolean indicating if the viewport is mobile-sized
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    
    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Create event handler
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isMobile;
}
