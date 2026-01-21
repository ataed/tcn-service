"use client";
import {
  MapPinIcon,
  TrashIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { LANGUAGE_CONFIG } from "@/lib/schema/definitions";

const MapPicker = dynamic(() => import("@/components/admin/MapPicker"), {
  ssr: false,
});

export default function LocationSection({
  coords,
  setCoords,
  mapUrl,
  onMapPaste,
  onClearMap,
  listing,
}) {
  return (
    <div className="bg-admin-surface p-6 rounded-2xl border border-admin-muted/10 shadow-sm space-y-8">
      <div className="flex items-center justify-between border-b border-admin-muted/10 pb-4">
        <h3 className="text-sm font-bold text-admin-text-primary uppercase tracking-widest flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 text-admin-accent" /> Geographic
          Location
        </h3>
        <div className="flex items-center gap-1 text-[10px] font-bold text-admin-text-muted uppercase">
          <GlobeAltIcon className="h-3 w-3" /> Multilingual Sync
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(LANGUAGE_CONFIG).map((lang) => (
          <div
            key={lang.id}
            className={`p-5 rounded-2xl border transition-all duration-300 ${lang.border} ${lang.bg} space-y-4 relative overflow-hidden`}
            dir={lang.rtl ? "rtl" : "ltr"}
          >
            {/* Theme-Aware Language Badge */}
            <span
              className={`absolute top-0 left-0 rounded-br-xl border-b border-r text-[9px] font-black uppercase px-3 py-1 ${lang.badge} shadow-sm`}
            >
              {lang.label}
            </span>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* City Input */}
              <div className="space-y-1">
                <label
                  className={`text-[10px] font-bold uppercase tracking-tighter ${lang.text} opacity-80`}
                >
                  City
                </label>
                <input
                  name={`city_${lang.id}`}
                  defaultValue={listing?.[`city_${lang.id}`]}
                  placeholder={lang.placeholderCity}
                  className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-2.5 text-sm focus:border-admin-accent outline-none text-admin-text-primary transition-colors"
                />
              </div>

              {/* District Input */}
              <div className="space-y-1">
                <label
                  className={`text-[10px] font-bold uppercase tracking-tighter ${lang.text} opacity-80`}
                >
                  District
                </label>
                <input
                  name={`district_${lang.id}`}
                  defaultValue={listing?.[`district_${lang.id}`]}
                  placeholder={lang.placeholderDistrict}
                  className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-2.5 text-sm focus:border-admin-accent outline-none text-admin-text-primary transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Shared/Map Address */}
      <div className="pt-4 border-t border-admin-muted/5 space-y-2">
        <label className="text-xs font-semibold text-admin-text-muted uppercase">
          Address
        </label>
        <input
          name="address"
          defaultValue={listing?.address}
          placeholder="e.g. 123 Av. Mohammed VI"
          className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-4 text-sm focus:border-admin-accent outline-none"
        />
      </div>

      {/* 3. Map Picker Logic */}
      <div className="space-y-4 pt-4 border-t border-admin-muted/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-admin-text-muted uppercase">
              Import from Google Maps
            </label>
            <div className="flex gap-2">
              <input
                value={mapUrl}
                onChange={onMapPaste}
                placeholder="Paste Link..."
                className="flex-1 bg-admin-bg border border-admin-muted/20 rounded-xl p-3 text-xs outline-none focus:border-admin-accent"
              />
              <button
                type="button"
                onClick={onClearMap}
                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          {coords && (
            <div className="h-full flex items-center p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <div>
                <p className="text-xs text-green-600 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Location Pinned Successfully
                </p>
                <p className="text-[10px] text-green-600/80 font-mono mt-1">
                  {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="h-[400px] w-full bg-admin-bg border border-admin-muted/20 rounded-2xl overflow-hidden relative z-0">
          <MapPicker selectedLocation={coords} onLocationSelect={setCoords} />
        </div>
      </div>
    </div>
  );
}
