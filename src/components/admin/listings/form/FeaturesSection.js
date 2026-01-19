"use client";
import { AMENITIES } from "@/lib/schema/definitions";
import { SparklesIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline";

export default function FeaturesSection({ listing, type }) {
  // Extract attributes from JSONB or top-level columns
  const currentAttrs = listing?.attributes || {};
  const currentAmenities = currentAttrs.amenities || {};

  // 🟢 Logic aligned with PROPERTY_TYPES definitions
  const showRoomSpecs = [
    "villa",
    "apartment",
    "riad",
    "penthouse",
    "duplex",
    "chalet",
    "studio",
    "townhouse",
  ].includes(type);

  // 🟢 Targets land_residential, land_agricultural, land_industrial
  const isLandType = type?.startsWith("land_");

  return (
    <div className="bg-admin-surface p-6 rounded-2xl border border-admin-muted/10 shadow-sm space-y-8">
      <h3 className="text-sm font-bold text-admin-text-primary uppercase tracking-widest border-b border-admin-muted/10 pb-4 flex items-center gap-2">
        <SparklesIcon className="h-4 w-4 text-admin-accent" /> 2. Features &
        Amenities
      </h3>

      {/* 1. Attributes (Bedrooms/Bathrooms) - Shown for Residential */}
      {showRoomSpecs && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-admin-bg/40 border border-admin-muted/10 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest">
              Bedrooms *
            </label>
            <input
              name="bedrooms"
              type="number"
              defaultValue={currentAttrs.bedrooms || listing?.bedrooms || 0}
              className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-3 text-sm outline-none focus:border-admin-accent font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest">
              Bathrooms *
            </label>
            <input
              name="bathrooms"
              type="number"
              defaultValue={currentAttrs.bathrooms || listing?.bathrooms || 0}
              className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-3 text-sm outline-none focus:border-admin-accent font-mono"
            />
          </div>
        </div>
      )}

      {/* 2. Zoning Classification - Shown exclusively for Land Types */}
      {isLandType && (
        <div className="p-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Square3Stack3DIcon className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Land Development Information
            </span>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest">
              Zoning Classification
            </label>
            <input
              name="zoning_type"
              defaultValue={
                currentAttrs.zoning_type || listing?.zoning_type || ""
              }
              placeholder="e.g. R-2 Residential, Agricultural Zone A"
              className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors"
            />
            <p className="text-[9px] text-admin-text-muted italic px-1">
              Specifies the permitted legal use for this specific plot.
            </p>
          </div>
        </div>
      )}

      {/* 3. Amenities Grid - Hidden for Land  */}
      {!isLandType && (
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-[0.2em]">
            Available Amenities
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {AMENITIES.map((amenity) => (
              <label
                key={amenity.id}
                className="flex items-center gap-3 p-3.5 bg-admin-bg border border-admin-muted/10 rounded-xl cursor-pointer hover:border-admin-accent/30 transition-all group"
              >
                <input
                  type="checkbox"
                  name={amenity.id}
                  defaultChecked={currentAmenities[amenity.id] || false}
                  className="w-4 h-4 rounded border-admin-muted/30 text-admin-accent focus:ring-admin-accent bg-transparent"
                />
                <span className="text-[10px] font-bold text-admin-text-muted uppercase tracking-tighter group-hover:text-admin-text-primary transition-colors">
                  {amenity.label.en}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
