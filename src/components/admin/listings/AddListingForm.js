"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROPERTY_TYPES } from "@/lib/schema/definitions";
import Image from "next/image";
import {
  XMarkIcon,
  PlusIcon,
  PhotoIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline"; // Import icons

// Components
import { useListingForm } from "./form/useListingForm";
import LocationSection from "./form/LocationSection";
import FeaturesSection from "./form/FeaturesSection";

export default function AddListingForm() {
  const router = useRouter();

  // 🟢 Destructure the new handlers
  const {
    loading,
    coords,
    setCoords,
    mapUrl,
    setMapUrl,
    handleMapPaste,
    handleFormSubmit,
    galleryItems,
    handleAddGallery,
    handleRemoveGallery,
    pdfItems,
    handleAddPdf,
    handleRemovePdf,
  } = useListingForm();

  const [selectedType, setSelectedType] = useState("villa");
  const [isOffPlan, setIsOffPlan] = useState(false);
  const [previewMain, setPreviewMain] = useState(null);

  return (
    <form
      onSubmit={(e) => handleFormSubmit(e, { selectedType, isOffPlan })}
      className="space-y-8 pb-20 max-w-5xl mx-auto"
    >
      {/* ... SECTION 1 (Core Info) stays the same ... */}
      <div className="bg-admin-surface p-8 rounded-xl border border-admin-muted/10 shadow-sm">
        <h3 className="text-sm font-bold text-admin-text-primary uppercase tracking-widest border-b border-admin-muted/10 pb-4 mb-6">
          1. Core Information
        </h3>
        <div className="space-y-6">
          {/* ... (Keep your existing inputs for Type, Status, Price, Sqft here) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-admin-text-muted uppercase">
                Asset Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-admin-bg border border-admin-muted/20 rounded-lg p-3 text-sm"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label.en}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-admin-text-muted uppercase">
                Project Status
              </label>
              <label
                className={`flex items-center justify-between w-full p-3 border rounded-lg cursor-pointer ${isOffPlan ? "border-admin-accent bg-admin-accent/5" : "border-admin-muted/20"}`}
              >
                <span className="text-sm font-medium">Off-Plan / V.E.F.A</span>
                <input
                  type="checkbox"
                  checked={isOffPlan}
                  onChange={(e) => setIsOffPlan(e.target.checked)}
                  className="h-5 w-5 accent-admin-accent"
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              name="price"
              type="number"
              placeholder="Price (MAD)"
              required
              className="bg-admin-bg border border-admin-muted/20 rounded-lg p-3 text-sm"
            />
            <input
              name="sqft"
              type="number"
              placeholder="Surface (m²)"
              required
              className="bg-admin-bg border border-admin-muted/20 rounded-lg p-3 text-sm"
            />
          </div>
          {isOffPlan && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 rounded-lg">
              <input
                name="delivery_date"
                placeholder="Delivery Date (e.g. Q4 2026)"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* ... SECTION 2 (Amenities) stays the same ... */}
      <FeaturesSection type={selectedType} />

      {/* --- 🟢 SECTION 3: MEDIA ASSETS (UPDATED) --- */}
      <div className="bg-admin-surface p-8 rounded-xl border border-admin-muted/10 shadow-sm">
        <h3 className="text-sm font-bold text-admin-text-primary uppercase tracking-widest border-b border-admin-muted/10 pb-4 mb-6">
          3. Media Assets
        </h3>

        <div className="space-y-8">
          {/* A. Main Cover (Single File) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label className="text-xs font-semibold text-admin-text-muted uppercase block mb-2">
                Main Cover *
              </label>
              <div className="relative aspect-square bg-admin-bg border-2 border-dashed border-admin-muted/20 rounded-xl overflow-hidden group hover:border-admin-accent transition-colors">
                {previewMain ? (
                  <Image
                    src={previewMain}
                    fill
                    className="object-cover"
                    alt="Main"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-admin-text-muted">
                    <PhotoIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-[10px] uppercase font-bold">
                      Upload
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  name="main_image"
                  onChange={(e) =>
                    setPreviewMain(URL.createObjectURL(e.target.files[0]))
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* B. Gallery (Multiple Accumulative) */}
            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-admin-text-muted uppercase block mb-2">
                Gallery Images ({galleryItems.length})
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {/* 1. Add Button */}
                <div className="relative aspect-square bg-admin-bg border border-admin-muted/20 rounded-xl flex flex-col items-center justify-center text-admin-text-muted hover:bg-admin-bg/80 cursor-pointer hover:border-admin-accent transition-all group">
                  <PlusIcon className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] uppercase font-bold">
                    Add New
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAddGallery}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {/* 2. Render Items */}
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-square bg-black/5 rounded-xl overflow-hidden group border border-admin-muted/10"
                  >
                    <Image
                      src={item.preview}
                      fill
                      className="object-cover"
                      alt="Gallery"
                    />
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveGallery(item.id)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-admin-muted/10 my-6"></div>

          {/* C. PDF Documents (Multiple Accumulative) */}
          <div>
            <label className="text-xs font-semibold text-admin-text-muted uppercase block mb-2">
              Technical Documents ({pdfItems.length})
            </label>

            <div className="flex flex-col gap-3">
              {/* PDF List */}
              {pdfItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-admin-bg border border-admin-muted/20 rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                      <DocumentIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-admin-text-primary truncate max-w-[200px]">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-admin-text-muted">
                        {item.size}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePdf(item.id)}
                    className="p-2 text-admin-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add PDF Button */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-3 bg-admin-bg border border-dashed border-admin-muted/30 rounded-lg text-xs font-bold uppercase text-admin-text-muted w-full justify-center hover:border-admin-accent hover:text-admin-accent transition-all"
                >
                  <PlusIcon className="w-4 h-4" />
                  Upload PDF Files
                </button>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleAddPdf}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ... SECTION 4 & 5 (Content & Location) stay the same ... */}
      <div className="bg-admin-surface p-8 rounded-xl border border-admin-muted/10 shadow-sm">
        {/* ... Content Inputs ... */}
        <h3 className="text-sm font-bold text-admin-text-primary uppercase tracking-widest border-b border-admin-muted/10 pb-4 mb-6">
          4. Content
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              ENGLISH
            </span>
            <input
              name="title_en"
              placeholder="Title"
              className="w-full bg-admin-bg border-b border-admin-muted/20 p-2 text-sm"
            />
            <textarea
              name="desc_en"
              placeholder="Desc..."
              className="w-full bg-admin-bg border border-admin-muted/20 rounded p-2 text-sm"
              rows={3}
            />
          </div>
          {/* ... other languages ... */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
              FRENCH
            </span>
            <input
              name="title_fr"
              placeholder="Titre"
              className="w-full bg-admin-bg border-b border-admin-muted/20 p-2 text-sm"
            />
            <textarea
              name="desc_fr"
              placeholder="Desc..."
              className="w-full bg-admin-bg border border-admin-muted/20 rounded p-2 text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-3">
            <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
              SPANISH
            </span>
            <input
              name="title_es"
              placeholder="Título"
              className="w-full bg-admin-bg border-b border-admin-muted/20 p-2 text-sm"
            />
            <textarea
              name="desc_es"
              placeholder="Desc..."
              className="w-full bg-admin-bg border border-admin-muted/20 rounded p-2 text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-3" dir="rtl">
            <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">
              ARABIC
            </span>
            <input
              name="title_ar"
              placeholder="العنوان"
              className="w-full bg-admin-bg border-b border-admin-muted/20 p-2 text-sm"
            />
            <textarea
              name="desc_ar"
              placeholder="الوصف"
              className="w-full bg-admin-bg border border-admin-muted/20 rounded p-2 text-sm"
              rows={3}
            />
          </div>
        </div>
      </div>

      <LocationSection
        coords={coords}
        setCoords={setCoords}
        mapUrl={mapUrl}
        onMapPaste={handleMapPaste}
        onClearMap={() => {
          setCoords(null);
          setMapUrl("");
        }}
      />

      <div className="flex justify-end gap-4 pt-4 border-t border-admin-muted/10">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 rounded-xl border border-admin-muted/20 text-admin-text-muted text-xs font-bold uppercase"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-admin-accent text-white hover:bg-opacity-90 text-xs font-bold uppercase shadow-lg"
        >
          {loading ? "Publishing..." : "Publish Listing"}
        </button>
      </div>
    </form>
  );
}
