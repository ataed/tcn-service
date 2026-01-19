"use client";
import { AMENITIES } from "@/lib/schema/definitions";

export default function FeaturesSection({ type }) {
  // Logic: Only show beds/baths for residential living types
  const showBedBath = ["villa", "apartment", "penthouse", "townhouse"].includes(
    type,
  );

  return (
    <div className="bg-admin-surface p-8 rounded-xl border border-admin-muted/10 shadow-sm">
      <h3 className="text-sm font-bold text-admin-text-primary uppercase tracking-widest border-b border-admin-muted/10 pb-4 mb-6">
        2. Features & Amenities
      </h3>

      {/* 1. Dynamic Inputs: Only visible for residential types */}
      {showBedBath && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-admin-text-muted uppercase">
              Bedrooms <span className="text-red-500">*</span>
            </label>
            <input
              name="bedrooms"
              type="number"
              placeholder="0"
              min="0"
              required={showBedBath} // REQUIRED if visible
              className="w-full bg-admin-bg border border-admin-muted/20 rounded-lg p-3 text-sm focus:border-admin-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-admin-text-muted uppercase">
              Bathrooms <span className="text-red-500">*</span>
            </label>
            <input
              name="bathrooms"
              type="number"
              placeholder="0"
              min="0"
              required={showBedBath} // REQUIRED if visible
              className="w-full bg-admin-bg border border-admin-muted/20 rounded-lg p-3 text-sm focus:border-admin-accent"
            />
          </div>
        </div>
      )}

      {/* 2. Checkboxes Grid (Amenities are always optional) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {AMENITIES.map((amenity) => (
          <label
            key={amenity.id}
            className="flex items-center space-x-3 p-3 rounded-lg border border-admin-muted/10 hover:bg-admin-bg cursor-pointer transition-colors group"
          >
            <input
              type="checkbox"
              name={amenity.id}
              className="rounded border-admin-muted/20 text-admin-accent focus:ring-admin-accent group-hover:border-admin-accent"
            />
            <span className="text-xs text-admin-text-primary">
              {amenity.label.en}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
