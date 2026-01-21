"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image"; // Keep for Lightbox (needs object-contain)
import ImageWithLoader from "@/components/ui/ImageWithLoader"; // 🟢 Import the new loader
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

  // 2. Keyboard Support
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

  const previewImages = images.slice(0, 4);
  const hiddenCount = images.length - 4;

  return (
    <>
      {/* --- PREVIEW GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {previewImages.map((img, idx) => {
          const isFirst = idx === 0;

          return (
            <div
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsOpen(true);
              }}
              className={`relative cursor-pointer overflow-hidden rounded-2xl group border border-white/10 ${
                isFirst
                  ? "h-[300px] md:h-[500px] md:row-span-2"
                  : "h-[200px] md:h-[240px]"
              }`}
            >
              {/* 🟢 REPLACED: Use ImageWithLoader for the grid */}
              {/* className="h-full w-full" ensures the wrapper fills the parent div */}
              <ImageWithLoader
                src={img}
                alt={`Property ${idx}`}
                fill
                className="h-full w-full"
                sizes={
                  isFirst
                    ? "(max-width: 768px) 100vw, 50vw"
                    : "(max-width: 768px) 100vw, 25vw"
                }
                unoptimized
              />

              {/* Overlay for the 4th image */}
              {idx === 3 && hiddenCount > 0 && (
                <div className="absolute inset-0 bg-primary-950/70 flex flex-col items-center justify-center text-white backdrop-blur-sm group-hover:bg-primary-950/80 transition-colors z-20">
                  <span className="text-3xl font-serif">+{hiddenCount}</span>
                  <span className="text-[10px] uppercase tracking-widest mt-1">
                    See All
                  </span>
                </div>
              )}

              {/* Hover Effect Icon */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
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
            {/* 🟢 KEPT STANDARD IMAGE: We need object-contain here, not object-cover */}
            <Image
              src={images[currentIndex]}
              alt="Gallery Fullscreen"
              fill
              className="object-contain"
              quality={100}
              priority
              unoptimized
              sizes="100vw"
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
