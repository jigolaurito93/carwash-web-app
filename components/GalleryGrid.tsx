"use client";

import Image from "next/image";
import { useEffect, useState, type SyntheticEvent } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const selectedImage =
    selectedIndex !== null ? (images[selectedIndex] ?? null) : null;
  const canNavigate = images.length > 1;

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const goToAdjacent = (direction: -1 | 1) => {
    if (!canNavigate) return;
    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current + direction + images.length) % images.length;
    });
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
        return;
      }
      if (images.length <= 1) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      setSelectedIndex((current) => {
        if (current === null) return current;
        return (current + direction + images.length) % images.length;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, images.length]);

  if (images.length === 0) {
    return <GalleryEmptyState />;
  }

  const visibleImages = expanded ? images : images.slice(0, PREVIEW_COUNT);
  const hasMore = images.length > PREVIEW_COUNT;

  return (
    <>
      <section className="px-4 pb-16 sm:px-8 lg:px-20 lg:pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {visibleImages.map((image, index) => (
            <GalleryTile
              key={image.id}
              image={image}
              onOpen={() => openLightbox(index)}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-14 py-6 sm:px-20"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery photo viewer"
        >
          {canNavigate ? (
            <LightboxNavButton
              direction="prev"
              onClick={() => goToAdjacent(-1)}
            />
          ) : null}
          <LightboxCard
            key={selectedImage.id}
            image={selectedImage}
            onClose={closeLightbox}
          />
          {canNavigate ? (
            <LightboxNavButton
              direction="next"
              onClick={() => goToAdjacent(1)}
            />
          ) : null}
        </div>
      )}
    </>
  );
}

function LightboxCard({
  image,
  onClose,
}: {
  image: GalleryImage;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [orientation, setOrientation] = useState<Orientation | null>(null);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) {
      setOrientation(naturalWidth >= naturalHeight ? "landscape" : "portrait");
    }
    setLoaded(true);
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border border-white/15 bg-black/60 p-3 shadow-2xl sm:p-4",
        loaded && orientation === "portrait"
          ? "w-auto max-w-full"
          : "w-full max-w-4xl",
      )}
      onClick={(event) => event.stopPropagation()}
      aria-busy={!loaded && !failed}
    >
      <div
        className={cn(
          "relative flex items-center justify-center",
          !loaded && "min-h-[50vh] sm:min-h-[65vh]",
        )}
      >
        {!loaded && !failed ? (
          <Skeleton
            className="absolute inset-0 rounded-md bg-neutral-800"
            aria-busy="true"
            aria-label="Loading photo"
          />
        ) : null}
        {failed ? (
          <p className="font-questrial text-sm text-white/70">
            This photo could not be loaded.
          </p>
        ) : (
          <Image
            src={image.image_url}
            alt={image.alt_text || image.caption || "Gallery photo"}
            width={1600}
            height={1200}
            priority
            sizes={
              orientation === "portrait"
                ? "calc(100vw - 7rem)"
                : "(max-width: 896px) 100vw, 896px"
            }
            onLoad={handleLoad}
            onError={() => setFailed(true)}
            className={cn(
              "rounded-md object-contain transition-opacity duration-300",
              loaded
                ? "relative opacity-100"
                : "pointer-events-none absolute opacity-0",
              loaded &&
                orientation === "portrait" &&
                "h-[75vh] w-auto max-w-full",
              loaded &&
                orientation === "landscape" &&
                "h-auto max-h-[75vh] w-full",
              loaded && orientation === null && "max-h-[75vh] max-w-full",
            )}
            style={
              !loaded
                ? undefined
                : orientation === "portrait"
                  ? { width: "auto", height: "75vh", maxWidth: "100%" }
                  : orientation === "landscape"
                    ? { width: "100%", height: "auto", maxHeight: "75vh" }
                    : { width: "auto", height: "auto", maxHeight: "75vh" }
            }
          />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="font-lexend text-base font-semibold sm:text-lg">
            {image.caption || "Gallery photo"}
          </div>
          {image.alt_text ? (
            <p className="mt-1 font-questrial text-xs text-white/80 sm:text-sm">
              {image.alt_text}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/30 bg-white/10 px-3 py-1 font-lexend text-xs text-white shadow-sm transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function LightboxNavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      aria-label={isPrev ? "Previous photo" : "Next photo"}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-lg transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black sm:size-12",
        isPrev ? "left-2 sm:left-4 lg:left-8" : "right-2 sm:right-4 lg:right-8",
      )}
    >
      {isPrev ? (
        <FiChevronLeft className="size-6 sm:size-7" />
      ) : (
        <FiChevronRight className="size-6 sm:size-7" />
      )}
    </button>
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
