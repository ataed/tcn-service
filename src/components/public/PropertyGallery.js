"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export default function PropertyGallery({ images }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Handle Navigation
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // 2. Keyboard Support (Professional Touch)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  // 3. Prevent Scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!images || images.length === 0) return null;

  // We show max 4 images in the preview grid
  const previewImages = images.slice(0, 4);
  const hiddenCount = images.length - 4;

  return (
    <>
      {/* --- PREVIEW GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] md:h-[500px]">
        {previewImages.map((img, idx) => {
          // Logic to determine span for layout variety
          // First image takes full height on left, others stack on right
          const isFirst = idx === 0;

          return (
            <div
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsOpen(true);
              }}
              className={`relative cursor-pointer overflow-hidden rounded-2xl group border border-white/10 ${
                isFirst ? "md:row-span-2 md:h-full" : "h-[190px] md:h-auto"
              }`}
            >
              <Image
                src={img}
                alt={`Property ${idx}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes={isFirst ? "50vw" : "25vw"}
                unoptimized
              />

              {/* Overlay for the 4th image if there are more hidden images */}
              {idx === 3 && hiddenCount > 0 && (
                <div className="absolute inset-0 bg-primary-950/70 flex flex-col items-center justify-center text-white backdrop-blur-sm group-hover:bg-primary-950/80 transition-colors">
                  <span className="text-3xl font-serif">+{hiddenCount}</span>
                  <span className="text-[10px] uppercase tracking-widest mt-1">
                    See All
                  </span>
                </div>
              )}

              {/* Hover Effect Icon */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <PhotoIcon className="h-10 w-10 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* --- FULL SCREEN LIGHTBOX --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
          >
            <ChevronLeftIcon className="h-8 w-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
          >
            <ChevronRightIcon className="h-8 w-8" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full max-w-7xl max-h-[85vh] mx-4">
            <Image
              src={images[currentIndex]}
              alt="Gallery Fullscreen"
              fill
              className="object-contain"
              quality={100}
              priority
              unoptimized
            />
          </div>

          {/* Counter at Bottom */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
