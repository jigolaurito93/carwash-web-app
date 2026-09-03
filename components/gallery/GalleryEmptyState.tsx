import Link from "next/link";
import { HiOutlinePhotograph } from "react-icons/hi";
import { Button } from "@/components/ui/button";

export default function GalleryEmptyState() {
  return (
    <section className="px-4 pb-16 sm:px-8 lg:px-20 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-lg rounded-2xl border border-white/15 bg-black/60 px-6 py-10 text-center shadow-2xl sm:px-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400">
            <HiOutlinePhotograph className="h-7 w-7 text-black" aria-hidden />
          </div>
          <h2 className="mt-5 font-lexend text-2xl font-bold tracking-tight text-yellow-400 sm:text-3xl">
            Photos coming soon
          </h2>
          <p className="mt-3 font-questrial text-sm text-white/80 sm:text-base">
            We&apos;re putting the finishing shine on this gallery. Check back
            shortly, or see our work in person.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="border-transparent bg-yellow-400 font-lexend text-black hover:bg-yellow-300 hover:text-black"
            >
              <Link href="/services">View services</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-yellow-400 bg-transparent font-lexend text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>

        <div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          aria-hidden="true"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex aspect-4/3 items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/5"
            >
              <HiOutlinePhotograph className="h-10 w-10 text-white/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
