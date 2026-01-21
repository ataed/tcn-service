"use client";

import dynamic from "next/dynamic";

// This is where we safely disable SSR
const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-white/5 animate-pulse flex items-center justify-center text-white/20">
      Loading...
    </div>
  ),
});

export default function PropertyMapLoader({ lat, lng }) {
  return <PropertyMap lat={lat} lng={lng} />;
}
