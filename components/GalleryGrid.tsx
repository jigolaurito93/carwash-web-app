"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/lib/app.types";
import { Button } from "@/components/ui/button";
import GalleryEmptyState from "@/components/gallery/GalleryEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PREVIEW_COUNT = 6;

type Props = {
  images: GalleryImage[];
};

type Orientation = "landscape" | "portrait";

export default function GalleryGrid({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [orientation, setOrientation] = useState<Orientation | null>(null);
  const [expanded, setExpanded] = useState(false);

  const closeLightbox = () => {
    setSelectedImage(null);
    setOrientation(null);
  };

  const openLightbox = (image: GalleryImage) => {
    setOrientation(null);
    setSelectedImage(image);
  };

  if (images.length === 0) {
    return <GalleryEmptyState />;
  }

  const visibleImages = expanded ? images : images.slice(0, PREVIEW_COUNT);
  const hasMore = images.length > PREVIEW_COUNT;

  return (
    <>
      <section className="px-4 pb-16 sm:px-8 lg:px-20 lg:pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {visibleImages.map((image) => (
            <GalleryTile
              key={image.id}
              image={image}
              onOpen={() => openLightbox(image)}
            />
          ))}
        </div>
        {hasMore ? (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="lg"
              aria-expanded={expanded}
              onClick={() => setExpanded((prev) => !prev)}
              className="border-yellow-400 bg-transparent font-lexend text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              {expanded ? "Show less" : "Show more"}
            </Button>
          </div>
        ) : null}
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
          onClick={closeLightbox}
        >
          <div
            className={cn(
              "relative rounded-lg border border-white/15 bg-black/60 p-3 shadow-2xl sm:p-4",
              orientation === "portrait"
                ? "w-auto max-w-[90vw]"
                : "w-full max-w-4xl",
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-center">
              <Image
                key={selectedImage.id}
                src={selectedImage.image_url}
                alt={
                  selectedImage.alt_text ||
                  selectedImage.caption ||
                  "Gallery photo"
                }
                width={1600}
                height={1200}
                priority
                sizes={
                  orientation === "portrait"
                    ? "90vw"
                    : "(max-width: 896px) 100vw, 896px"
                }
                onLoad={(event) => {
                  const { naturalWidth, naturalHeight } = event.currentTarget;
                  setOrientation(
                    naturalWidth >= naturalHeight ? "landscape" : "portrait",
                  );
                }}
                className={cn(
                  "rounded-md object-contain",
                  orientation === "portrait" && "h-[75vh] w-auto max-w-[90vw]",
                  orientation === "landscape" && "h-auto max-h-[75vh] w-full",
                  orientation === null && "max-h-[75vh] max-w-full",
                )}
                style={
                  orientation === "portrait"
                    ? { width: "auto", height: "75vh", maxWidth: "90vw" }
                    : orientation === "landscape"
                      ? { width: "100%", height: "auto", maxHeight: "75vh" }
                      : { width: "auto", height: "auto", maxHeight: "75vh" }
                }
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <div className="font-lexend text-base font-semibold sm:text-lg">
                  {selectedImage.caption || "Gallery photo"}
                </div>
                {selectedImage.alt_text ? (
                  <p className="mt-1 font-questrial text-xs text-white/80 sm:text-sm">
                    {selectedImage.alt_text}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1 font-lexend text-xs text-white shadow-sm transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryTile({
  image,
  onOpen,
}: {
  image: GalleryImage;
  onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const label = image.caption || "Gallery photo";
  const alt = image.alt_text || label;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-4/3 overflow-hidden rounded-lg border border-white/10 bg-black/40 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-yellow-400/80"
    >
      {!loaded ? (
        <Skeleton
          className="absolute inset-0 z-10 rounded-none bg-neutral-800"
          aria-busy="true"
          aria-label="Loading photo"
        />
      ) : null}
      <Image
        src={image.image_url}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={cn(
          "object-cover object-center transition-[opacity,transform] duration-500 group-hover:scale-110",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
      {loaded ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-90" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-left">
            <div className="font-lexend text-sm font-semibold tracking-tight sm:text-base">
              {label}
            </div>
            <div className="font-questrial text-xs text-white/80 sm:text-sm">
              Tap to view closer
            </div>
          </div>
        </>
      ) : null}
    </button>
  );
}
