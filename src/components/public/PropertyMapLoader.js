"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Keep SSR disabled
const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-white/5 animate-pulse flex items-center justify-center text-white/20">
      Loading...
    </div>
  ),
});

export default function PropertyMapLoader({ lat, lng }) {
  const [isVisible, setIsVisible] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    // 🟢 intersectionObserver: Only load the map when it enters the screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop watching once loaded
        }
      },
      { rootMargin: "200px" }, // Start loading 200px before user reaches it
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={mapRef} className="h-full w-full">
      {isVisible ? (
        <PropertyMap lat={lat} lng={lng} />
      ) : (
        <div className="h-full w-full bg-white/5 flex items-center justify-center text-white/20">
          {/* Static placeholder before map loads */}
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Location Map
          </span>
        </div>
      )}
    </div>
  );
}
