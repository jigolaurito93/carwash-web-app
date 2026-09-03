import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceCardsSkeleton() {
  return (
    <div className="my-16 sm:px-6">
      <section className="px-4 py-10">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-9 w-48 bg-neutral-800" />
          <Skeleton className="mx-auto mt-4 h-1 w-24 bg-neutral-700" />
        </div>
        <div className="mx-auto grid max-w-350 grid-cols-1 gap-8 sm:max-w-200 sm:grid-cols-2 lg:max-w-250 lg:grid-cols-3 xl:max-w-355 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="mx-auto grid w-full max-w-90 grid-rows-[96px_1fr] overflow-hidden rounded-2xl bg-[#1c1c1c] xl:max-w-250"
            >
              <div className="row-start-1 flex h-24 shrink-0 items-center justify-center bg-yellow-400 p-4">
                <div className="flex w-full flex-col items-center gap-2">
                  <Skeleton className="h-5 w-32 bg-yellow-500/70" />
                  <Skeleton className="h-3 w-44 bg-yellow-500/50" />
                </div>
              </div>
              <div className="row-start-2 space-y-3 p-6">
                <Skeleton className="h-4 w-28 bg-neutral-700" />
                <Skeleton className="h-4 w-full bg-neutral-800" />
                <Skeleton className="h-4 w-5/6 bg-neutral-800" />
                <Skeleton className="h-4 w-4/6 bg-neutral-800" />
                <Skeleton className="h-4 w-3/4 bg-neutral-800" />
              </div>
              <div className="row-start-3 space-y-3 border-t border-white/10 bg-gray-900/50 p-6 pt-4">
                <Skeleton className="h-4 w-full bg-neutral-800" />
                <Skeleton className="h-4 w-full bg-neutral-800" />
                <Skeleton className="h-4 w-full bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
