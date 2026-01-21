import { createClient } from "@/utils/supabase/client";
import { getTranslations } from "next-intl/server";
import PropertyCard from "@/components/public/PropertyCard";
import { AMENITIES } from "@/lib/schema/definitions";

export default async function SearchResults({ locale, searchParams }) {
  const supabase = createClient();
  const t = await getTranslations({ locale, namespace: "Search" });

  const purpose = searchParams.purpose;
  const type = searchParams.type;
  const city = searchParams.city;
  const bedrooms = searchParams.bedrooms;
  const bathrooms = searchParams.bathrooms;
  const minPrice = searchParams.minPrice;
  const maxPrice = searchParams.maxPrice;

  let query = supabase
    .from("listings")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  // ... (PASTE ALL YOUR EXISTING FILTER LOGIC HERE) ...
  if (purpose === "rent") query = query.eq("attributes->>purpose", "rent");
  else if (purpose === "sale") query = query.eq("attributes->>purpose", "sale");

  if (type === "off-plan") query = query.eq("is_off_plan", true);
  else if (type) query = query.eq("type", type.toLowerCase());

  if (city) query = query.ilike(`city_${locale}`, `%${city}%`);
  if (minPrice) query = query.gte("price", minPrice);
  if (maxPrice) query = query.lte("price", maxPrice);

  if (bedrooms) {
    if (bedrooms === "4+") query = query.gte("bedrooms", 4);
    else query = query.eq("bedrooms", parseInt(bedrooms));
  }
  if (bathrooms) {
    if (bathrooms === "4+") query = query.gte("bathrooms", 4);
    else query = query.eq("bathrooms", parseInt(bathrooms));
  }

  AMENITIES.forEach((amenity) => {
    if (searchParams[amenity.id] === "true") {
      query = query.eq(`attributes->amenities->>${amenity.id}`, "true");
    }
  });

  const { data: listings } = await query;

  // 🟢 EMPTY STATE
  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm text-center px-4">
        <h3 className="text-2xl font-serif text-white mb-2">
          {t("noResultsTitle")}
        </h3>
        <p className="text-primary-400 max-w-md mb-8">{t("noResultsDesc")}</p>
        <a
          href={`/${locale}/search`}
          className="px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all"
        >
          {t("clearFilters")}
        </a>
      </div>
    );
  }

  // 🟢 RESULTS GRID
  return (
    <>
      {/* Optional: Put count here if you want it to update dynamically inside the grid area */}
      <p className="mb-6 text-white/50 text-sm">
        {t("count", { count: listings.length })}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            locale={locale} // 🟢 FIX: Prioritize the first 2 images for LCP Speed
            priority={index < 2}
          />
        ))}
      </div>
    </>
  );
}
