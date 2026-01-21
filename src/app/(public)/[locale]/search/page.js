import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import SearchFilters from "@/components/public/SearchFilters";
import SearchResults from "@/components/public/SearchResults";
import SearchSkeleton from "@/components/public/skeleton/SearchSkeleton";

export default async function SearchPage({ params, searchParams }) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: "Search" });

  const purpose = resolvedSearchParams.purpose;

  // 1. We render the layout immediately (Header & Filters)
  return (
    <div className="relative bg-primary-950 min-h-screen pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col gap-10 mb-12 border-b border-white/10 pb-12">
          <div>
            <span className="text-accent-500 font-bold tracking-[0.2em] text-xs uppercase mb-3 block">
              {/* Note: We can't show exact count here instantly anymore, so we change wording or move it */}
              {t("filters")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-light">
              {!purpose
                ? t("titleAll")
                : purpose === "rent"
                  ? t("titleRent")
                  : t("titleSale")}{" "}
              <span className="font-serif italic text-accent-500">
                {!purpose
                  ? t("highlightAll")
                  : purpose === "rent"
                    ? t("highlightRent")
                    : t("highlightSale")}
              </span>
            </h1>
          </div>

          <SearchFilters
            locale={locale}
            currentFilters={resolvedSearchParams}
          />
        </div>

        {/* 🟢 2. The Results are wrapped in Suspense */}
        {/* When searchParams change, this part will show Skeleton while fetching */}
        <Suspense
          key={JSON.stringify(resolvedSearchParams)}
          fallback={<SearchSkeleton />}
        >
          <SearchResults locale={locale} searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </div>
  );
}
