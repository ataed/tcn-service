"use client";
import { useState, useTransition } from "react"; //
import { useRouter, usePathname } from "next/navigation";
import {
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { AMENITIES } from "@/lib/schema/definitions";

export default function SearchFilters({ locale, currentFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Search");
  const [isOpen, setIsOpen] = useState(false);

  // 🟢 2. Initialize Transition Hook
  const [isPending, startTransition] = useTransition();

  const updateParams = (newParams) => {
    const params = new URLSearchParams(currentFilters);
    Object.entries(newParams).forEach(([key, value]) => {
      if (!value || value === "all" || value === false) params.delete(key);
      else params.set(key, value);
    });

    // 🟢 3. Wrap navigation in startTransition
    // This stops the "Freeze" and allows the UI to update immediately
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const removeFilter = (key) => {
    const params = new URLSearchParams(currentFilters);
    params.delete(key);

    // 🟢 4. Wrap remove logic too
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const hasFilters = Object.keys(currentFilters).length > 1;

  return (
    <div
      className={`flex flex-col gap-6 w-full ${isPending ? "opacity-70 animate-pulse pointer-events-none" : ""}`}
    >
      {/* 🟢 Optional: Add visual feedback (opacity) when loading */}

      <div className="flex flex-wrap items-center gap-4">
        {/* 1. PURPOSE QUICK TOGGLE */}
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
          {["buy", "rent", "all"].map((p) => (
            <button
              key={p}
              onClick={() => updateParams({ purpose: p })}
              className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                (currentFilters.purpose || "all") === p
                  ? "bg-accent-500 text-white shadow-lg shadow-accent-500/20"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {p === "all" ? t("allTypes") : t(p)}
            </button>
          ))}
        </div>

        {/* 2. ADVANCED TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 px-6 py-2.5 border rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
            isOpen
              ? "bg-white text-primary-950 border-white"
              : "bg-white/5 hover:bg-white/10 text-white border-white/10"
          }`}
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4" />
          <span>{t("filters")}</span>
          <ChevronDownIcon
            className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* 3. DYNAMIC ACTIVE PILLS */}
        <div className="flex flex-wrap gap-2">
          {currentFilters.city && (
            <FilterPill
              label={currentFilters.city}
              onRemove={() => removeFilter("city")}
            />
          )}
          {currentFilters.type && (
            <FilterPill
              label={currentFilters.type}
              onRemove={() => removeFilter("type")}
            />
          )}
          {currentFilters.bedrooms && (
            <FilterPill
              label={`${currentFilters.bedrooms} ${t("bedrooms")}`}
              onRemove={() => removeFilter("bedrooms")}
            />
          )}
          {currentFilters.bathrooms && (
            <FilterPill
              label={`${currentFilters.bathrooms} ${t("bathrooms")}`}
              onRemove={() => removeFilter("bathrooms")}
            />
          )}
          {AMENITIES.map(
            (am) =>
              currentFilters[am.id] === "true" && (
                <FilterPill
                  key={am.id}
                  label={am.label[locale]}
                  onRemove={() => removeFilter(am.id)}
                />
              ),
          )}
        </div>

        {/* RESET */}
        {hasFilters && (
          <button
            onClick={() => router.push(`/${locale}/search`)}
            className="text-white/30 hover:text-accent-500 text-[10px] font-bold uppercase tracking-widest ml-auto transition-colors"
          >
            {t("clearFilters")}
          </button>
        )}
      </div>

      {/* 🟢 EXPANDED PANEL - PRO LAYOUT */}
      {isOpen && (
        <div className="w-full bg-primary-950/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 animate-fade-in-up shadow-3xl z-50">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 xl:gap-8 items-start">
            {/* 1. PRICE RANGE (Unified Single Bar) */}
            <div className="flex flex-col gap-4">
              <h4 className="text-accent-500 text-[11px] font-bold uppercase tracking-[0.2em]">
                {t("priceRange")}
              </h4>
              <div className="flex items-center w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-4 focus-within:border-accent-500 transition-colors">
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue={currentFilters.minPrice}
                  onBlur={(e) => updateParams({ minPrice: e.target.value })}
                  className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/20 text-center"
                />
                <div className="w-px h-6 bg-white/20 mx-4" />{" "}
                {/* Vertical Divider */}
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue={currentFilters.maxPrice}
                  onBlur={(e) => updateParams({ maxPrice: e.target.value })}
                  className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/20 text-center"
                />
              </div>
            </div>

            {/* 2. BEDROOMS (Segmented) */}
            <div className="flex flex-col gap-4">
              <h4 className="text-accent-500 text-[11px] font-bold uppercase tracking-[0.2em]">
                {t("bedrooms")}
              </h4>
              <div className="grid grid-cols-4 bg-white/5 p-1 rounded-2xl border border-white/10 h-14">
                {[1, 2, 3, "4+"].map((n) => (
                  <button
                    key={n}
                    onClick={() => updateParams({ bedrooms: n })}
                    className={`flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 ${
                      currentFilters.bedrooms == n
                        ? "bg-accent-500 text-white shadow-lg"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. BATHROOMS (Segmented) */}
            <div className="flex flex-col gap-4">
              <h4 className="text-accent-500 text-[11px] font-bold uppercase tracking-[0.2em]">
                {t("bathrooms")}
              </h4>
              <div className="grid grid-cols-4 bg-white/5 p-1 rounded-2xl border border-white/10 h-14">
                {[1, 2, 3, "4+"].map((n) => (
                  <button
                    key={n}
                    onClick={() => updateParams({ bathrooms: n })}
                    className={`flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 ${
                      currentFilters.bathrooms == n
                        ? "bg-accent-500 text-white shadow-lg"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. AMENITIES (Grid) */}
            <div className="flex flex-col gap-4">
              <h4 className="text-accent-500 text-[11px] font-bold uppercase tracking-[0.2em]">
                {t("amenities")}
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                {AMENITIES.map((amenity) => (
                  <label
                    key={amenity.id}
                    className="flex items-center gap-3 cursor-pointer group p-1"
                  >
                    <input
                      type="checkbox"
                      checked={currentFilters[amenity.id] === "true"}
                      onChange={(e) =>
                        updateParams({
                          [amenity.id]: e.target.checked ? "true" : "",
                        })
                      }
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0 ${
                        currentFilters[amenity.id] === "true"
                          ? "bg-accent-500 border-accent-500 text-white"
                          : "border-white/20 group-hover:border-white/40"
                      }`}
                    >
                      {currentFilters[amenity.id] === "true" && (
                        <span className="text-[9px]">✓</span>
                      )}
                    </div>
                    <span className="text-xs text-white/60 group-hover:text-white transition-colors truncate">
                      {amenity.label[locale]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-2 px-4 py-2 bg-accent-500/10 border border-accent-500/20 text-accent-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all group shrink-0"
    >
      <span>{label}</span>
      <XMarkIcon className="h-3 w-3 group-hover:rotate-90 transition-transform" />
    </button>
  );
}
