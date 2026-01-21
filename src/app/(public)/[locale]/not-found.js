"use client"; // Client component for interaction
import Link from "next/link";
import { useTranslations } from "next-intl";
import { HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  const t = useTranslations("Error");

  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center px-4">
        {/* Big 404 Typography */}
        <h1 className="text-[120px] md:text-[180px] font-serif font-light text-white/5 leading-none select-none">
          404
        </h1>

        <div className="-mt-12 mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl text-white font-light">
            {t("pageNotFound")}
          </h2>
          <p className="text-primary-200/50 max-w-md mx-auto">
            {t("notFoundDesc")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-accent-500/20 flex items-center gap-2"
          >
            <HomeIcon className="h-4 w-4" />
            {t("backHome")}
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t("goBack")}
          </button>
        </div>
      </div>
    </div>
  );
}
