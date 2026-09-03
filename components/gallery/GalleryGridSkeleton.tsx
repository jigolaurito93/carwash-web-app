import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryGridSkeleton() {
  return (
    <section className="px-4 pb-16 sm:px-8 lg:px-20 lg:pb-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="aspect-4/3 rounded-lg border border-white/10 bg-neutral-800"
          />
        ))}
      </div>
    </section>
  );
}
