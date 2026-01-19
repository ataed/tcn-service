"use client";

import { LANGUAGE_CONFIG } from "@/lib/schema/definitions";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function ContentSection({ listing }) {
  return (
    <section className="bg-admin-surface p-6 rounded-2xl border border-admin-muted/10 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-admin-muted/10 pb-4">
        <h3 className="text-sm font-bold text-admin-text-primary uppercase tracking-widest flex items-center gap-2">
          <GlobeAltIcon className="h-4 w-4 text-admin-accent" /> 2. Multilingual
          Content
        </h3>
        <span className="text-[10px] font-bold text-admin-text-muted uppercase italic">
          Titles and descriptions in 4 languages
        </span>
      </div>

      {/* 4-Block Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(LANGUAGE_CONFIG).map((lang) => (
          <div
            key={lang.id}
            className={`p-5 rounded-2xl border transition-all duration-300 ${lang.border} ${lang.bg} space-y-4 relative overflow-hidden`}
            dir={lang.rtl ? "rtl" : "ltr"}
          >
            {/* Theme-Aware Language Badge */}
            <span
              className={`absolute top-0 ${lang.rtl ? "left-0 rounded-br-xl border-b border-r" : "right-0 rounded-bl-xl border-b border-l"} text-[9px] font-black uppercase px-3 py-1 ${lang.badge} shadow-sm`}
            >
              {lang.label}
            </span>

            <div className="space-y-4 pt-2">
              {/* Title Input */}
              <div className="space-y-1">
                <label
                  className={`text-[10px] font-bold uppercase tracking-tighter ${lang.text} opacity-80`}
                >
                  Property Headline
                </label>
                <input
                  name={`title_${lang.id}`}
                  defaultValue={listing?.[`title_${lang.id}`] || ""}
                  placeholder="e.g. Luxury Villa with Pool"
                  required={lang.id === "en"} // Example: Require English
                  className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-3 text-sm font-bold focus:border-admin-accent outline-none text-admin-text-primary transition-colors"
                />
              </div>

              {/* Description Textarea */}
              <div className="space-y-1">
                <label
                  className={`text-[10px] font-bold uppercase tracking-tighter ${lang.text} opacity-80`}
                >
                  Full Description
                </label>
                <textarea
                  name={`desc_${lang.id}`}
                  defaultValue={listing?.[`desc_${lang.id}`] || ""}
                  rows={4}
                  placeholder="Detailed property description..."
                  className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-3 text-xs focus:border-admin-accent outline-none text-admin-text-primary transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
