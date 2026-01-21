"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageWithLoader({ src, alt, className, ...props }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-white/5 ${className}`}>
      {/* 1. Skeleton Pulse (Visible only while loading) */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse z-10">
          {/* Optional: Add a tiny logo or icon here if you want extra branding */}
        </div>
      )}

      {/* 2. The Image (Starts blurred/invisible, then fades in) */}
      <Image
        src={src}
        alt={alt}
        {...props}
        // 🟢 THE MAGIC:
        // We start with 'opacity-0 blur-xl scale-110' (Invisible & blurry & zoomed in)
        // When loaded, we switch to 'opacity-100 blur-0 scale-100' (Visible & sharp & normal size)
        className={`
          transition-all duration-700 ease-in-out
          ${isLoading ? "opacity-0 blur-xl scale-110" : "opacity-100 blur-0 scale-100"}
          object-cover
        `}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
