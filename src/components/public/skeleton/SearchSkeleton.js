export default function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden h-[500px] flex flex-col animate-pulse"
        >
          {/* Image */}
          <div className="h-[300px] bg-white/10 w-full relative">
            <div className="absolute top-4 right-4 h-6 w-20 bg-white/20 rounded-full" />
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 flex-1">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-white/10 rounded-full" />
              <div className="h-5 w-32 bg-white/10 rounded-lg" />
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
  );
}
