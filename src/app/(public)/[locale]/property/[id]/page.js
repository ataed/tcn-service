import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  PhoneIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  MapIcon,
} from "@heroicons/react/24/outline";

import PropertyMapLoader from "@/components/public/PropertyMapLoader";
import PropertyGallery from "@/components/public/PropertyGallery";
import { AMENITIES } from "@/lib/schema/definitions";

export default async function PropertyDetailsPage({ params }) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "Property" });
  const supabase = createClient();

  // 1. Fetch Property
  const { data: property, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) notFound();

  // 2. Data Parsing
  const attrs = property.attributes || {};

  // Specs
  const beds = property.bedrooms ?? attrs.bedrooms ?? 0;
  const baths = property.bathrooms ?? attrs.bathrooms ?? 0;
  const area = property.sqft ?? attrs.area ?? 0;

  // DYNAMIC AMENITIES TRANSLATION
  const amenities = attrs.amenities || {};
  const activeAmenities = Object.entries(amenities)
    .filter(([_, value]) => value === true)
    .map(([key]) => {
      const def = AMENITIES.find((a) => a.id === key);
      return def?.label[locale] || def?.label["en"] || key.replace(/_/g, " ");
    });

  const zoning = property.zoning_type ?? attrs.zoning_type;
  const deliveryDate = attrs.delivery_date;

  // Text Data
  const title = property[`title_${locale}`] || property.title_en || "Untitled";
  const description = property[`desc_${locale}`] || property.desc_en || "";
  const city = property[`city_${locale}`] || property.city_en || "Morocco";

  const isRent = attrs.purpose === "rent";
  const price = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: property.currency || "MAD",
    maximumFractionDigits: 0,
  }).format(property.price);

  const getPublicUrl = (path, bucket = "property-images") => {
    if (!path) return "/placeholder-house.jpg";
    if (path.startsWith("http")) return path;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  const gallery = property.gallery_urls || [];
  const fullGalleryUrls = gallery.map((url) => getPublicUrl(url));

  const files = property.technical_plans || [];
  const lat = property.latitude;
  const lng = property.longitude;
  const hasCoords = lat && lng;

  return (
    <div className="bg-primary-950 min-h-screen pb-20 pt-24 text-white">
      {/* 1. HERO IMAGE */}
      <div className="relative h-[60vh] lg:h-[70vh] w-full">
        <Image
          src={getPublicUrl(property.main_image_url)}
          alt={title}
          fill
          // 🟢 CRITICAL PERFORMANCE FIXES:
          // 1. sizes="100vw" tells browser this is full width
          // 2. Removed 'unoptimized' so sharp can compress it
          sizes="100vw"
          className="object-cover"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/40 to-transparent"></div>

        <div className="absolute top-8 left-4 lg:left-8 z-20">
          <Link
            href={`/${locale}/search`}
            className="flex items-center gap-2 px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-bold transition-all border border-white/10"
          >
            <ArrowLeftIcon className="h-4 w-4" /> {t("backToSearch")}
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12 z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-accent-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {property.type}
                </span>
                <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                  {isRent ? t("forRent") : t("forSale")}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-2 leading-tight">
                {title}
              </h1>
              <div className="flex items-center text-white/70 gap-2 text-lg">
                <MapPinIcon className="h-5 w-5 text-accent-500" />
                {city}
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-4xl lg:text-5xl font-serif italic text-white mb-1">
                {price}
                {isRent && (
                  <span className="text-lg not-italic text-white/50 font-sans ml-2">
                    {t("month")}
                  </span>
                )}
              </div>
              <p className="text-white/50 text-sm uppercase tracking-widest">
                {t("guidePrice")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN (Details) */}
        <div className="lg:col-span-2 space-y-12">
          {/* 🟢 FIXED SPECS BAR: Mobile-Proof & RTL-Ready */}
          {(beds > 0 || baths > 0 || area > 0) && (
            <div className="flex flex-nowrap items-center w-full bg-white/5 rounded-2xl border border-white/10 divide-x divide-white/10 rtl:divide-x-reverse overflow-hidden">
              {beds > 0 && (
                <div className="flex-1 py-4 px-2 text-center group hover:bg-white/[0.02] transition-colors">
                  <div className="text-xl md:text-2xl font-serif text-accent-500 leading-none mb-1">
                    {beds}
                  </div>
                  <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/50 truncate">
                    {t("beds")}
                  </div>
                </div>
              )}

              {baths > 0 && (
                <div className="flex-1 py-4 px-2 text-center group hover:bg-white/[0.02] transition-colors">
                  <div className="text-xl md:text-2xl font-serif text-accent-500 leading-none mb-1">
                    {baths}
                  </div>
                  <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/50 truncate">
                    {t("baths")}
                  </div>
                </div>
              )}

              {area > 0 && (
                <div className="flex-1 py-4 px-2 text-center group hover:bg-white/[0.02] transition-colors">
                  <div className="text-xl md:text-2xl font-serif text-accent-500 leading-none mb-1">
                    {area}
                  </div>
                  <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/50 truncate">
                    {t("sqft")}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-2xl font-serif mb-6 border-b border-white/10 pb-4">
              {t("about")}
            </h3>
            <div
              className="prose prose-invert prose-lg max-w-none text-white/70 font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          {/* FEATURES & AMENITIES */}
          {(activeAmenities.length > 0 || zoning || deliveryDate) && (
            <div>
              <h3 className="text-2xl font-serif mb-6 border-b border-white/10 pb-4">
                {t("features")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {zoning && (
                  <div className="flex items-center gap-4 p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl">
                    <MapIcon className="h-6 w-6 text-accent-500" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-accent-500 font-bold">
                        {t("zoning")}
                      </p>
                      <p className="text-white font-serif text-lg">{zoning}</p>
                    </div>
                  </div>
                )}
                {deliveryDate && (
                  <div className="flex items-center gap-4 p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl">
                    <CalendarDaysIcon className="h-6 w-6 text-accent-500" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-accent-500 font-bold">
                        {t("deliveryDate")}
                      </p>
                      <p className="text-white font-serif text-lg">
                        {deliveryDate}
                      </p>
                    </div>
                  </div>
                )}
                {activeAmenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <CheckCircleIcon className="h-5 w-5 text-accent-500" />
                    <span className="text-white/80">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY */}
          {fullGalleryUrls.length > 0 && (
            <div>
              <h3 className="text-2xl font-serif mb-6 border-b border-white/10 pb-4">
                {t("gallery")}
              </h3>
              <PropertyGallery images={fullGalleryUrls} />
            </div>
          )}

          {/* MAP */}
          <div className="border-t border-white/10 pt-10">
            <h3 className="text-2xl font-serif mb-6">{t("location")}</h3>
            {hasCoords ? (
              <div className="relative h-[450px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <PropertyMapLoader lat={lat} lng={lng} />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 z-[400] bg-white text-primary-950 px-5 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-accent-500 hover:text-white transition-all shadow-xl"
                >
                  {t("openMaps")}{" "}
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="h-[200px] w-full bg-white/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/30">
                <MapPinIcon className="h-8 w-8 mb-2" />
                <span className="text-sm uppercase tracking-widest">
                  {t("noCoords")}
                </span>
              </div>
            )}
          </div>

          {/* FILES */}
          {files.length > 0 && (
            <div>
              <h3 className="text-2xl font-serif mb-6 border-b border-white/10 pb-4">
                {t("documents")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map((fileUrl, idx) => (
                  <a
                    key={idx}
                    href={getPublicUrl(fileUrl, "technical-plans")}
                    target="_blank"
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                  >
                    <div className="p-3 bg-accent-500/20 rounded-lg text-accent-500 group-hover:text-white group-hover:bg-accent-500 transition-colors">
                      <DocumentTextIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">
                        {t("document")} {idx + 1}
                      </p>
                      <p className="text-xs text-white/40">{t("download")}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <h4 className="text-xl font-serif mb-2">{t("interested")}</h4>
              <p className="text-white/50 text-sm mb-6">{t("contactText")}</p>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all mb-4"
              >
                <PhoneIcon className="h-4 w-4" /> {t("contactButton")}
              </Link>
              <div className="text-center text-xs text-white/30 uppercase tracking-widest">
                {t("reference")}: {property.ref_id || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
