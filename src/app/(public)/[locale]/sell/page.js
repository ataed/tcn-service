import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  BuildingOffice2Icon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default async function SellPage({ params }) {
  // Await params if necessary in your Next.js version, or access directly
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Sell" });

  return (
    <div className="relative min-h-screen bg-primary-950 flex items-center justify-center overflow-hidden pt-20">
      {/* 1. CINEMATIC BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-900/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* 2. ICON & BADGE */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl shadow-black/50 backdrop-blur-md">
            <BuildingOffice2Icon className="h-10 w-10 text-accent-500" />
          </div>
          <span className="px-4 py-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 text-accent-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            {t("badge")}
          </span>
        </div>

        {/* 3. MAIN CONTENT */}
        <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
          {t("title")}{" "}
          <span className="font-serif italic text-accent-500">
            {t("titleHighlight")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-primary-200/60 font-light leading-relaxed max-w-2xl mx-auto mb-10">
          {t("description")}
        </p>

        {/* 4. CALL TO ACTION (Don't lose the lead!) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link
            href={`/${locale}/contact`}
            className="group relative px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-full transition-all shadow-[0_0_30px_rgba(198,153,99,0.3)] hover:shadow-[0_0_50px_rgba(198,153,99,0.5)]"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest">
                {t("cta")}
              </span>
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href={`/${locale}`}
            className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            {t("backHome")}
          </Link>
        </div>

        {/* 5. TRUST INDICATOR */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-4 text-white/30 text-sm font-light">
          <p>{t("trustText")}</p>
        </div>
      </div>
    </div>
  );
}
