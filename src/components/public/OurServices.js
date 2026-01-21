"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ChartBarIcon,
  BuildingOffice2Icon,
  KeyIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function OurServices({ locale }) {
  const t = useTranslations("Services");

  const services = [
    {
      id: "buySell",
      icon: KeyIcon,
      link: "/search?status=available",
    },
    {
      id: "offPlan",
      icon: BuildingOffice2Icon,
      link: "/search?type=off-plan",
      highlight: true,
    },
    {
      id: "management",
      icon: ChartBarIcon,
      link: "/contact",
    },
  ];

  return (
    <section className="py-24 bg-primary-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent-500 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
            {t("header")}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
            {t("title")}{" "}
            <span className="font-serif italic text-accent-500">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-primary-200/60 font-light text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* 🟢 LAYOUT FIX: Changed from Grid to Flexbox for better Tablet sizing */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              // 🟢 SIZING LOGIC:
              // Mobile (w-full): Stacked
              // Tablet (md): 2 cards per row (calc 50% - gap). 3rd card centers below.
              // Desktop (lg): 3 cards per row.
              className={`group relative p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] flex flex-col
                ${
                  service.highlight
                    ? "bg-white/5 border border-accent-500/30 hover:border-accent-500 hover:shadow-[0_0_30px_rgba(198,153,99,0.1)]"
                    : "bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10"
                }
              `}
            >
              {/* ICON */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors shrink-0
                ${
                  service.highlight
                    ? "bg-accent-500 text-white"
                    : "bg-white/10 text-accent-500 group-hover:bg-accent-500 group-hover:text-white"
                }
              `}
              >
                <service.icon className="h-7 w-7" />
              </div>

              {/* CONTENT */}
              <h3 className="text-xl font-medium text-white mb-4">
                {t(`cards.${service.id}.title`)}
              </h3>
              <p className="text-primary-200/50 text-sm leading-relaxed mb-8 flex-grow">
                {t(`cards.${service.id}.desc`)}
              </p>

              {/* LINK (Pinned to bottom) */}
              <div className="mt-auto pt-4">
                <Link
                  href={`/${locale}${service.link}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-accent-500 transition-colors"
                >
                  {t("learnMore")}
                  <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
