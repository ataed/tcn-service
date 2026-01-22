"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

export default function AgencyValue({ locale }) {
  const t = useTranslations("Heritage");

  return (
    <section className="relative py-24 bg-primary-950 overflow-hidden">
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 1. THE MESSAGE */}
          <div className="relative z-10">
            <span className="text-accent-500 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
              {t("tagline")}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
              {t("title")} <br />
              <span className="font-serif italic text-accent-500">
                {t("titleHighlight")}
              </span>
            </h2>
            <div className="space-y-6 text-primary-200 font-light text-lg">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
            </div>

            <div className="mt-10 pt-10 border-t border-white/10 flex items-center gap-12">
              <div>
                <div className="text-3xl font-serif text-white">200+</div>
                <div className="text-xs text-primary-400 uppercase tracking-widest mt-1">
                  {t("stats.sold")}
                </div>
              </div>
              <div>
                <div className="text-3xl font-serif text-white">MAD 500m</div>
                <div className="text-xs text-primary-400 uppercase tracking-widest mt-1">
                  {t("stats.volume")}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href={`/${locale}/about`}
                className="group inline-flex items-center gap-4 text-white hover:text-accent-500 transition-colors"
              >
                <span className="uppercase tracking-widest text-sm font-bold">
                  {t("button")}
                </span>
                <ArrowLongRightIcon className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 2. THE VISUAL (Optimized) */}
          <div className="relative h-[600px] w-full rounded-2xl overflow-hidden group">
            <Image
              src="/agency-interior.webp"
              alt="Luxury Interior Design"
              fill
              // 🟢 FIX: Optimized for 50% width on desktop
              sizes="(max-width: 1024px) 100vw, 50vw"
              // 🟢 FIX: Priority loading for high-visibility section
              priority={true}
              className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent opacity-60"></div>

            {/* Floating Quote Card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
              <p className="font-serif italic text-white text-lg">
                &quot;{t("quote")}&quot;
              </p>
              <p className="text-accent-500 text-xs font-bold uppercase tracking-widest mt-4">
                {t("founder")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
