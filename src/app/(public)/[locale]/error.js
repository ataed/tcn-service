"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Error({ error, reset }) {
  const t = useTranslations("Error");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <span className="text-2xl">⚠️</span>
      </div>

      <h2 className="text-2xl md:text-3xl text-white font-serif mb-3">
        {t("somethingWentWrong")}
      </h2>

      <p className="text-white/40 max-w-md mb-8 text-sm">{t("errorDesc")}</p>

      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-white text-primary-950 hover:bg-primary-200 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
      >
        <ArrowPathIcon className="h-4 w-4" />
        {t("tryAgain")}
      </button>
    </div>
  );
}
