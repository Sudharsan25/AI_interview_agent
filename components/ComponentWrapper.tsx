// e.g., in components/ContentWrapper.tsx
import React from 'react';
import { clsx } from 'clsx'; // Optional: for conditional classes

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentWrapper = ({ children, className }: ContentWrapperProps) => {
  return (
    <main className={clsx(
      "max-w-full px-12 max-sm:px-4 my-12 max-sm:my-8",
      className
    )}>
      {children}
    </main>
  );
};