"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
// 🟢 1. Import the shared component
import PropertyCard from "@/components/public/PropertyCard";

export default function FeaturedListings({ locale }) {
  const t = useTranslations("Featured");

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("status", "available")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) console.error("Supabase Error:", error);
        else setListings(data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-primary-950 flex justify-center">
        <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (!listings || listings.length === 0) return null;

  return (
    <section className="py-24 bg-primary-950 relative overflow-hidden">
      {/* Decorative Background Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-white">
              {t("title")}{" "}
              <span className="font-serif italic text-accent-500">
                {t("titleHighlight")}
              </span>
            </h2>
            <p className="mt-3 text-white/60 font-light max-w-lg">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href={`/${locale}/search`}
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-500 hover:text-accent-400 transition-colors"
          >
            {t("viewAll")}
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 🟢 2. FLEX LAYOUT WITH COMPONENT REUSE */}
        <div className="flex flex-wrap justify-center gap-8">
          {listings.map((property) => (
            <div
              key={property.id}
              // This width logic ensures iPad/Tablet (md) shows 2 per row centered,
              // and Desktop (lg) shows 3 per row.
              className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] flex-grow-0"
            >
              <PropertyCard property={property} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
