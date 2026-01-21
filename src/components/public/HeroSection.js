"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  MagnifyingGlassIcon,
  HomeIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

// Ensure this path matches your project structure
import { PROPERTY_TYPES } from "@/lib/schema/definitions";
import heroBg from "../../../public/hero-bg-luxury.jpg";

export default function HeroSection({ locale }) {
  const t = useTranslations("Hero");
  const router = useRouter();

  // Search State
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const cities = ["Casablanca", "Marrakech", "Rabat", "Tangier"];

  const handleSearch = () => {
    const purpose = activeTab === "buy" ? "sale" : "rent";
    const params = new URLSearchParams();
    params.set("purpose", purpose);

    if (selectedCity) params.set("city", selectedCity);
    if (selectedType) params.set("type", selectedType);

    router.push(`/${locale}/search?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[85vh] lg:h-[90vh] w-full flex items-center justify-center overflow-hidden bg-primary-950">
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBg} //
          alt="Luxury Real Estate Morocco"
          fill
          placeholder="blur" // 🟢 Activates the automatic luxury blur
          className="object-cover object-center animate-subtle-zoom opacity-60"
          priority
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/40 to-primary-950/60"></div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full lg:pt-40 pt-32 pb-12">
        {/* HEADLINE */}
        <h1 className="text-center tracking-tight mb-8 drop-shadow-2xl animate-fade-in-up">
          <span className="block font-medium mb-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white">
            {t("titleLine1")}
          </span>
          <span className="block font-serif italic text-accent-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            {t("titleLine2")}
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/80 text-center max-w-2xl font-light mb-12 drop-shadow-lg px-4 leading-relaxed">
          {t("subtitle")}
        </p>

        {/* 3. THE OMNI-SEARCH ENGINE */}
        <div className="w-full max-w-6xl bg-primary-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-in-up delay-100">
          {/* TABS (Buy / Rent) */}
          <div className="flex justify-center sm:justify-start gap-4 mb-6">
            {["buy", "rent"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2 rounded-full text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 border ${
                  activeTab === tab
                    ? "bg-accent-500 text-white border-accent-500 shadow-lg shadow-accent-500/20"
                    : "text-white/60 bg-transparent border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>

          {/* INPUT GRID SYSTEM */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
            {/* 1. CITY SELECT */}
            <div className="lg:col-span-4 relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
                <MapPinIcon className="h-5 w-5 text-primary-400 group-focus-within:text-accent-500 transition-colors" />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-16 pl-14 pr-4 bg-white/95 text-primary-900 rounded-2xl font-medium focus:ring-2 focus:ring-accent-500 outline-none appearance-none cursor-pointer border border-white/10 shadow-inner hover:bg-white transition-colors"
              >
                <option value="">{t("allCities")}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. TYPE SELECT */}
            <div className="lg:col-span-3 relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
                <HomeIcon className="h-5 w-5 text-primary-400 group-focus-within:text-accent-500 transition-colors" />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-16 pl-14 pr-4 bg-white/95 text-primary-900 rounded-2xl font-medium focus:ring-2 focus:ring-accent-500 outline-none appearance-none cursor-pointer border border-white/10 shadow-inner hover:bg-white transition-colors"
              >
                <option value="">{t("propertyType")}</option>
                {PROPERTY_TYPES?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label[locale] || t.label.en}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. FILTERS BUTTON */}
            <div className="lg:col-span-3">
              <button
                onClick={handleSearch}
                className="w-full h-16 px-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-medium flex items-center justify-between transition-all backdrop-blur-sm group hover:border-white/30"
              >
                <span className="flex items-center gap-3">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-white/70 group-hover:text-accent-500 transition-colors" />
                  <span>{t("filters")}</span>
                </span>
                <span className="text-xs text-white/40 group-hover:text-white/80 transition-colors">
                  {t("moreOptions")}
                </span>
              </button>
            </div>

            {/* 4. SEARCH ACTION */}
            <div className="lg:col-span-2">
              <button
                onClick={handleSearch}
                className="w-full h-16 bg-accent-500 hover:bg-accent-600 text-white rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-accent-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span className="hidden lg:inline">{t("searchButton")}</span>
                <span className="lg:hidden">Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* 🟢 NEW: EXCLUSIVE INDICATORS (No fake numbers) */}
        <div className="mt-12 hidden sm:flex items-center gap-8 text-white/50 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase animate-fade-in delay-200">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hover:text-white transition-colors cursor-default">
              {t("curatedPortfolio")}
            </span>
          </div>

          <div className="w-px h-4 bg-white/10"></div>

          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>
            <span className="hover:text-white transition-colors cursor-default">
              {t("privateClient")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
