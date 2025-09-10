// e.g., in components/InterviewListSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export function InterviewListSkeleton() {
  return (
    <div>
      {/* Skeleton placeholder for the <h1>My Interviews</h1> heading */}
      <Skeleton className="h-8 w-48 mb-6" />

      {/* Skeletons for the list items */}
      <div className="space-y-4">
        {/* Create 3 repeating skeleton list items to mimic the list */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}