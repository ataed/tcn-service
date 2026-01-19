"use client";
import { MapPinIcon, TrashIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/admin/MapPicker"), {
  ssr: false,
});

export default function LocationSection({
  coords,
  setCoords,
  mapUrl,
  onMapPaste,
  onClearMap,
}) {
  return (
    <div className="bg-admin-surface p-6 rounded-xl border border-admin-muted/10 shadow-sm space-y-6">
      {/* Header */}
      <h3 className="text-sm font-bold text-admin-text-primary uppercase tracking-widest border-b border-admin-muted/10 pb-4 flex items-center gap-2">
        <MapPinIcon className="h-4 w-4" /> Geographic Location
      </h3>

      {/* 1. Address Inputs (One Line on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-admin-text-muted uppercase">
            City
          </label>
          <input
            name="city_en"
            placeholder="e.g. Marrakech"
            required
            className="w-full bg-admin-bg border border-admin-muted/20 rounded-lg p-3 text-sm focus:border-admin-accent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-admin-text-muted uppercase">
            District
          </label>
          <input
            name="district_en"
            placeholder="e.g. Hivernage"
            className="w-full bg-admin-bg border border-admin-muted/20 rounded-lg p-3 text-sm focus:border-admin-accent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-admin-text-muted uppercase">
            Internal Address
          </label>
          <input
            name="address"
            placeholder="e.g. 123 Av. Mohammed VI"
            className="w-full bg-admin-bg border border-admin-muted/20 rounded-lg p-3 text-sm focus:border-admin-accent"
          />
        </div>
      </div>

      {/* 2. Map & Link Section (Full Width Below) */}
      <div className="pt-4 border-t border-admin-muted/5 space-y-4">
        {/* Link Input + Clear Button + Status Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Input Group */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-admin-text-muted uppercase">
              Import from Google Maps
            </label>
            <div className="flex gap-2">
              <input
                value={mapUrl}
                onChange={onMapPaste}
                placeholder="Paste Google Maps Link or 'Lat, Lng'..."
                className="flex-1 bg-admin-bg border border-admin-muted/20 rounded-lg p-3 text-xs focus:border-admin-accent text-admin-text-primary"
              />
              {/* 🔴 RESTORED: Clear Button */}
              <button
                type="button"
                onClick={onClearMap}
                title="Clear Location"
                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-lg transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-admin-text-muted">
              Paste a link from your browser address bar to auto-pin the
              location.
            </p>
          </div>

          {/* 🟢 RESTORED: Success Banner */}
          {coords ? (
            <div className="h-full flex items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div>
                <p className="text-xs text-green-600 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Location Pinned Successfully
                </p>
                <p className="text-[10px] text-green-600/80 font-mono mt-1 ml-4">
                  Lat: {coords.lat.toFixed(6)} | Lng: {coords.lng.toFixed(6)}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center p-4 bg-admin-bg border border-admin-muted/10 rounded-lg border-dashed">
              <p className="text-[10px] text-admin-text-muted italic">
                No location selected yet. Click on the map below or paste a
                link.
              </p>
            </div>
          )}
        </div>

        {/* Map Visual (Full Width) */}
        <div className="h-[400px] w-full bg-admin-bg border border-admin-muted/20 rounded-xl overflow-hidden shadow-inner relative z-0">
          <MapPicker selectedLocation={coords} onLocationSelect={setCoords} />
        </div>
      </div>
    </div>
  );
}
