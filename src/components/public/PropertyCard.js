"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";

export default function PropertyCard({ property, locale, priority = false }) {
  const supabase = createClient();
  const t = useTranslations("Property");

  const getImageUrl = (path) => {
    if (!path) return "/placeholder-house.jpg";
    if (path.startsWith("http")) return path;
    return supabase.storage.from("property-images").getPublicUrl(path).data
      .publicUrl;
  };

  const formatPrice = (price, currency) => {
    const isRent = property.attributes?.purpose === "rent";
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "MAD",
      maximumFractionDigits: 0,
    }).format(price);

    return isRent ? `${formatted} ${t("month")}` : formatted;
  };

  // Safely extract values
  const beds = property.bedrooms ?? property.attributes?.bedrooms ?? 0;
  const baths = property.bathrooms ?? property.attributes?.bathrooms ?? 0;
  const area = property.sqft ?? property.attributes?.area ?? 0;

  const displayTitle =
    property[`title_${locale}`] || property.title_en || "Untitled Property";
  const displayCity =
    property[`city_${locale}`] || property.city_en || "Morocco";

  return (
    <Link
      href={`/${locale}/property/${property.id}`}
      className="group block h-full"
    >
      <article className="relative flex flex-col h-full bg-primary-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-accent-500/50 hover:shadow-2xl hover:shadow-accent-500/10 transition-all duration-500 group-hover:-translate-y-1">
        {/* IMAGE CONTAINER */}
        <div className="relative h-72 w-full overflow-hidden">
          {/* 🟢 NEW BADGE SYSTEM */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            {/* Property Type Badge */}
            <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-full">
              {property.type}
            </span>

            {/* Off-Plan Badge (Gold/Accent) */}
            {property.is_off_plan && (
              <span className="px-3 py-1 bg-accent-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-accent-400/20">
                {t("offPlan")}
              </span>
            )}

            {property.attributes?.purpose === "rent" && (
              <span className="px-3 py-1 bg-white text-primary-950 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                {t("forRent") || "For Rent"}
              </span>
            )}
          </div>

          <Image
            src={getImageUrl(property.main_image_url)}
            alt={displayTitle}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            unoptimized
            // This adds loading="eager" and fetchPriority="high" automatically
            priority={priority}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent opacity-80" />

          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="text-2xl md:text-3xl font-serif italic text-white drop-shadow-lg">
              {formatPrice(property.price, property.currency)}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 flex flex-col flex-grow justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-accent-500 font-bold uppercase tracking-widest mb-3">
              <MapPinIcon className="h-4 w-4" />
              {displayCity}
            </div>

            <h3 className="text-xl font-light text-white leading-snug group-hover:text-accent-500 transition-colors line-clamp-2">
              {displayTitle}
            </h3>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* 🟢 SPECS: Only show if value > 0 */}
          <div className="flex items-center justify-start gap-8 text-sm text-white/60">
            {beds > 0 && (
              <div className="flex flex-col items-center gap-1">
                <strong className="text-white text-lg font-serif">
                  {beds}
                </strong>
                <span className="text-[10px] uppercase tracking-wider">
                  {t("beds")}
                </span>
              </div>
            )}

            {baths > 0 && (
              <div className="flex flex-col items-center gap-1">
                <strong className="text-white text-lg font-serif">
                  {baths}
                </strong>
                <span className="text-[10px] uppercase tracking-wider">
                  {t("baths")}
                </span>
              </div>
            )}

            {area > 0 && (
              <div className="flex flex-col items-center gap-1">
                <strong className="text-white text-lg font-serif">
                  {area}
                </strong>
                <span className="text-[10px] uppercase tracking-wider">
                  {t("sqft")}
                </span>
              </div>
            )}

            {/* If all are 0 (e.g. Land), show a CTA label */}
            {beds === 0 && baths === 0 && area === 0 && (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-500/80">
                {t("viewDetails") || "View Details"}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
