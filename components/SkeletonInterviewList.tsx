// e.g., in components/HomePageSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export function HomePageSkeleton() {
  return (
    <>
      {/* === Skeleton for the Top CTA Section === */}
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg w-full">
          {/* h2 skeleton */}
          <Skeleton className="h-9 w-3/4" />

          {/* p skeleton (mimicking multiple lines) */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>

        {/* Image skeleton */}
        <Skeleton className="h-[400px] w-[400px] rounded-2xl max-sm:hidden" />
      </section>

      {/* === Skeleton for the Interviews List Section === */}
      <section className="flex flex-col gap-6 mt-8">
        {/* h2 skeleton */}
        <Skeleton className="h-9 w-1/3" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Create 6 skeleton cards to fill the grid */}
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    </>
  );
}