/**
 * Loading state for upcoming interviews page
 */

import { ContentWrapper } from "@/components/layouts";
import { Skeleton } from "@/components/ui";

export default function UpcomingInterviewsLoading() {
  return (
    <ContentWrapper>
      <section className="flex flex-col gap-6 mt-8">
        <Skeleton className="h-9 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    </ContentWrapper>
  );
}
