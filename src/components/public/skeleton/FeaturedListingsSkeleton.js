export default function FeaturedListingsSkeleton() {
  return (
    <section className="py-32 bg-primary-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 w-full max-w-lg">
            <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
            <div className="h-12 w-3/4 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-white/5 rounded-full animate-pulse" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden h-[500px] flex flex-col animate-pulse"
            >
              {/* Image Placeholder */}
              <div className="h-[300px] bg-white/10 w-full" />

              {/* Content Placeholders */}
              <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-white/10 rounded-full" />
                  <div className="h-4 w-24 bg-white/10 rounded-full" />
                </div>
                <div className="h-8 w-3/4 bg-white/10 rounded-lg" />
                <div className="h-4 w-1/2 bg-white/10 rounded-lg" />

                <div className="pt-6 mt-auto flex justify-between border-t border-white/5">
                  <div className="h-4 w-16 bg-white/10 rounded-full" />
                  <div className="h-4 w-16 bg-white/10 rounded-full" />
                  <div className="h-4 w-16 bg-white/10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
