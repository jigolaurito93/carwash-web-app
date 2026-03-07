"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  src: string;
  alt: string;
  label: string;
};

const galleryImages: GalleryImage[] = [
  {
    src: "/images/carwash-2.jpg",
    alt: "Car being hand washed with foam",
    label: "Premium Hand Wash",
  },
  {
    src: "/images/carwash-3.jpg",
    alt: "Detailer drying a luxury car",
    label: "Paint-Safe Drying",
  },
  {
    src: "/images/carwash-4.jpg",
    alt: "Close-up of wheels being cleaned",
    label: "Wheel & Tire Detail",
  },
  {
    src: "/images/carwash-5.jpg",
    alt: "Wet car under lights after wash",
    label: "Showroom Finish",
  },
  {
    src: "/images/carwash-6.jpg",
    alt: "Detailing interior dashboard",
    label: "Interior Refresh",
  },
  {
    src: "/images/carwash-7.jpg",
    alt: "Team working on multiple vehicles",
    label: "Onyx Experience",
  },
];

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <main className="min-h-screen bg-black/95 text-white">
      {/* Header */}
      <section className="px-6 py-16 sm:px-10 lg:px-24 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-lexend text-4xl font-extrabold tracking-tight text-yellow-400 drop-shadow-2xl sm:text-5xl lg:text-6xl">
            Onyx Gallery
          </h1>
          <p className="mt-4 font-questrial text-sm text-white/80 sm:text-base lg:text-lg">
            A look behind the shine. Explore real moments from the Onyx Hand
            Premium Wash experience—from foamy hand washes to flawless finishes.
          </p>
        </div>
      </section>

      {/* Grid Gallery */}
      <section className="px-4 pb-16 sm:px-8 lg:px-20 lg:pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {galleryImages.map((image) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedImage(image)}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-black/40 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-yellow-400/80"
            >
              <div className="relative h-full w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={false}
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-left">
                <div className="font-lexend text-sm font-semibold tracking-tight sm:text-base">
                  {image.label}
                </div>
                <div className="font-questrial text-xs text-white/80 sm:text-sm">
                  Tap to view closer
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-lg border border-white/15 bg-black/60 p-3 shadow-2xl sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <div className="font-lexend text-base font-semibold sm:text-lg">
                  {selectedImage.label}
                </div>
                <p className="mt-1 font-questrial text-xs text-white/80 sm:text-sm">
                  {selectedImage.alt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1 font-lexend text-xs text-white shadow-sm transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default GalleryPage;
