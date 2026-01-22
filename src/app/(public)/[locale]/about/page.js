import { getTranslations } from "next-intl/server";
import { Great_Vibes, Aref_Ruqaa } from "next/font/google";
import Link from "next/link";
import {
  BuildingLibraryIcon,
  UserGroupIcon,
  GlobeEuropeAfricaIcon,
  TrophyIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import StatsSection from "@/components/public/StatsSection";

const signatureFontAr = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
});
const signatureFont = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  const isArabic = locale === "ar";
  const signatureClass = isArabic
    ? signatureFontAr.className
    : signatureFont.className;
  const founderName = isArabic ? "محمد الشريف" : "Mhamed Chrif";

  const stats = [
    { label: t("statYears"), value: "12+" },
    { label: t("statProperties"), value: "850+" },
    { label: t("statClients"), value: "2K+" },
    { label: t("statAwards"), value: "15" },
  ];

  const values = [
    {
      icon: BuildingLibraryIcon,
      title: t("value1Title"),
      desc: t("value1Desc"),
    },
    { icon: UserGroupIcon, title: t("value2Title"), desc: t("value2Desc") },
    {
      icon: GlobeEuropeAfricaIcon,
      title: t("value3Title"),
      desc: t("value3Desc"),
    },
    { icon: TrophyIcon, title: t("value4Title"), desc: t("value4Desc") },
  ];

  return (
    <div className="bg-primary-950 min-h-screen text-white overflow-hidden">
      {/* 1. HERO SECTION */}
      {/* 🟢 FIXED: Updated padding and min-height for better spacing on mobile and large screens */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-40 pb-20 lg:pt-52 lg:pb-32">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* 🟢 FIXED: Increased margin below badge for more breathing room */}
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-accent-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
            {t("badge")}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-8 leading-tight">
            {t("heroTitle")}{" "}
            <span className="text-accent-500 italic">{t("heroHighlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
            {t("heroDesc")}
          </p>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <StatsSection stats={stats} />

      {/* 3. OUR STORY */}
      <section className="py-24 relative" dir={isArabic ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div
              className={`order-2 lg:order-1 space-y-8 ${isArabic ? "text-right" : "text-left"}`}
            >
              <h2 className="text-3xl md:text-5xl font-serif leading-tight">
                {t("storyTitle")}
              </h2>
              <div className="space-y-6 text-white/60 font-light text-lg leading-relaxed">
                <p>{t("storyP1")}</p>
                <p>{t("storyP2")}</p>
              </div>

              <div
                className={`pt-10 mt-6 relative flex flex-col ${isArabic ? "items-start" : "items-start"}`}
              >
                <div className="w-16 h-[1px] bg-accent-500 mb-6"></div>
                <div
                  className={`text-4xl md:text-5xl text-white/90 ${signatureClass} tracking-wide`}
                >
                  {founderName}
                </div>
                <div className="mt-4">
                  <p className="text-accent-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {t("founderRole")}
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative h-[500px] md:h-[600px]">
              <div className="absolute inset-0 border border-white/10 rounded-2xl overflow-hidden">
                <Image
                  src="/agency-interior-2.webp"
                  alt="TCN Office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-primary-950/20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUES SECTION */}
      <section className="py-24 bg-primary-900/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              {t("valuesTitle")}
            </h2>
            <p className="text-white/50">{t("valuesDesc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/5 p-8 rounded-2xl hover:bg-white/10 hover:border-accent-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center text-accent-500 mb-6 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                  <val.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-serif text-white mb-3">
                  {val.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">
              {t("ctaTitle")}
            </h2>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link
                href={`/${locale}/search`}
                className="px-10 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all"
              >
                {t("ctaBrowse")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                {t("ctaContact")} <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
