import HeroSection from "@/components/public/HeroSection";
import FeaturedListings from "@/components/public/FeaturedListings";
import AgencyValue from "@/components/public/AgencyValue";
import OurServices from "@/components/public/OurServices";
import { Suspense } from "react";
import FeaturedListingsSkeleton from "@/components/public/skeleton/FeaturedListingsSkeleton";

export default async function LandingPage({ params }) {
  const { locale } = await params;

  return (
    <div className="bg-primary-950 min-h-screen">
      {/* 1. HERO ENGINE */}
      <HeroSection locale={locale} />

      {/* This prevents the "freeze" and shows the skeleton immediately */}
      <Suspense fallback={<FeaturedListingsSkeleton />}>
        <FeaturedListings locale={locale} />
      </Suspense>

      {/* 3. BRAND HERITAGE (The Trust Builder) */}
      <AgencyValue locale={locale} />
      {/* 4. SERVICES TRIO  */}
      <OurServices locale={locale} />
    </div>
  );
}
