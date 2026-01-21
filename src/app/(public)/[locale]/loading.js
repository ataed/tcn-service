export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-primary-950 flex flex-col items-center justify-center">
      {/* 1. Gold Spinner */}
      <div className="relative w-24 h-24 mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
        {/* Spinning Segment */}
        <div className="absolute inset-0 border-t-2 border-accent-500 rounded-full animate-spin shadow-[0_0_30px_rgba(198,153,99,0.5)]"></div>
        {/* Brand Icon Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif font-bold text-white text-xl animate-pulse">
            T
          </span>
        </div>
      </div>

      {/* 2. Loading Text */}
      <span className="text-accent-500 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
        Loading Luxury...
      </span>
    </div>
  );
}
