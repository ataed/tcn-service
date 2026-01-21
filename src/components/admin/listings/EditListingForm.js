"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  TagIcon, // 🟢 NEW ICON
} from "@heroicons/react/24/outline";

import {
  STATUS_STYLES,
  AMENITIES,
  PROPERTY_TYPES,
} from "@/lib/schema/definitions";

import ConfirmationModal from "@/components/ui/ConfirmationModal";
import LocationSection from "./form/LocationSection";
import FeaturesSection from "./form/FeaturesSection";
import ContentSection from "./form/ContentSection";

export default function EditListingForm({ listing }) {
  const router = useRouter();
  const supabase = createClient();
  const formRef = useRef(null);

  // --- 1. STATE INITIALIZATION ---
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState("en");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [status, setStatus] = useState(listing.status || "pending");
  const [isOffPlan, setIsOffPlan] = useState(listing.is_off_plan || false);

  // 🟢 NEW STATE: Initialize Purpose (Default to 'sale' if missing)
  const [purpose, setPurpose] = useState(listing.attributes?.purpose || "sale");

  const selectedType = listing.type || "villa";
  const typeDef = PROPERTY_TYPES.find((t) => t.id === selectedType);

  const [coords, setCoords] = useState(
    listing.latitude ? { lat: listing.latitude, lng: listing.longitude } : null,
  );

  const [mapUrl, setMapUrl] = useState(listing.map_address || "");

  const getAttr = (key) => listing?.attributes?.[key] || "";

  // --- 2. MASTER SYNC LOGIC ---
  const handleUpdate = async () => {
    const formData = new FormData(formRef.current);

    const required = ["title_en", "price", "sqft"];
    for (const field of required) {
      if (!formData.get(field)) {
        toast.error(`${field.replace("_", " ")} is required`);
        return;
      }
    }

    setIsModalOpen(false);
    setIsSaving(true);
    const toastId = toast.loading("Synchronizing records...");

    try {
      const payload = {
        status,
        is_off_plan: isOffPlan,
        price: parseFloat(formData.get("price")) || listing.price,
        sqft: parseFloat(formData.get("sqft")) || listing.sqft,
        //FOR PUBLIC FILTER(EASY ACCESS)
        bedrooms: parseInt(formData.get("bedrooms")) || 0,
        bathrooms: parseInt(formData.get("bathrooms")) || 0,

        // TRANSACTION SYNC
        sold_price:
          status === "sold" ? parseFloat(formData.get("sold_price")) : null,
        sold_date: status === "sold" ? formData.get("sold_date") : null,

        title_en: formData.get("title_en") || listing.title_en,
        title_ar: formData.get("title_ar") || listing.title_ar,
        title_fr: formData.get("title_fr") || listing.title_fr,
        title_es: formData.get("title_es") || listing.title_es,
        desc_en: formData.get("desc_en") || listing.desc_en,
        desc_ar: formData.get("desc_ar") || listing.desc_ar,
        desc_fr: formData.get("desc_fr") || listing.desc_fr,
        desc_es: formData.get("desc_es") || listing.desc_es,

        city_en: formData.get("city_en") || listing.city_en,
        city_fr: formData.get("city_fr") || listing.city_fr,
        city_es: formData.get("city_es") || listing.city_es,
        city_ar: formData.get("city_ar") || listing.city_ar,

        district_en: formData.get("district_en") || listing.district_en,
        district_fr: formData.get("district_fr") || listing.district_fr,
        district_es: formData.get("district_es") || listing.district_es,
        district_ar: formData.get("district_ar") || listing.district_ar,

        address: formData.get("address") || listing.address,
        map_address: mapUrl,
        latitude: coords?.lat || listing.latitude,
        longitude: coords?.lng || listing.longitude,

        attributes: {
          ...listing.attributes,

          purpose: purpose,
          bedrooms: parseInt(formData.get("bedrooms")) || 0,
          bathrooms: parseInt(formData.get("bathrooms")) || 0,
          delivery_date: isOffPlan ? formData.get("delivery_date") : null,
          zoning_type: formData.get("zoning_type") || null,
          amenities: AMENITIES.reduce(
            (acc, am) => ({
              ...acc,
              [am.id]: formData.get(am.id) === "on",
            }),
            {},
          ),
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("listings")
        .update(payload)
        .eq("id", listing.id);

      if (error) throw error;

      toast.success("Inventory synchronized!", { id: toastId });
      router.refresh();
      router.push("/admin/listings/");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24"
    >
      <Toaster />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleUpdate}
        title="Sync Changes?"
        message="Register all specifications and transaction data to the database."
      />

      <div className="lg:col-span-8 space-y-6">
        {/* Specifications Card */}
        <section className="bg-admin-surface p-6 rounded-2xl border border-admin-muted/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-admin-muted/10 pb-4">
            <h3 className="text-xs font-bold text-admin-text-primary uppercase tracking-widest flex items-center gap-2">
              <ExclamationCircleIcon className="h-4 w-4 text-admin-accent" /> 1.
              Core Information
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-admin-bg rounded-lg border border-admin-muted/10">
              <LockClosedIcon className="h-3 w-3 text-admin-text-muted" />
              <span className="text-[10px] font-bold text-admin-text-muted uppercase tracking-tighter text-nowrap">
                Type: {typeDef?.label.en}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-admin-text-muted uppercase">
                Project Status
              </label>
              <label
                className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${isOffPlan ? "border-admin-accent bg-admin-accent/5" : "border-admin-muted/20"}`}
              >
                <span className="text-sm font-medium">Off-Plan / VEFA</span>
                <input
                  type="checkbox"
                  checked={isOffPlan}
                  onChange={(e) => setIsOffPlan(e.target.checked)}
                  className="h-5 w-5 accent-admin-accent"
                />
              </label>
            </div>
            {isOffPlan && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">
                  Delivery Forecast
                </label>
                <input
                  name="delivery_date"
                  defaultValue={getAttr("delivery_date")}
                  placeholder="e.g. Q4 2026"
                  className="w-full bg-admin-bg border border-purple-500/20 rounded-xl p-3 text-sm outline-none focus:border-purple-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest">
                Price (MAD) *
              </label>
              <input
                name="price"
                type="number"
                defaultValue={listing.price}
                required
                className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-3 text-sm outline-none font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest">
                Surface (m²) *
              </label>
              <input
                name="sqft"
                type="number"
                defaultValue={listing.sqft}
                required
                className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-3 text-sm outline-none font-mono"
              />
            </div>
          </div>
        </section>

        <ContentSection listing={listing} />
        <FeaturesSection listing={listing} type={selectedType} />
        <LocationSection
          listing={listing}
          coords={coords}
          setCoords={setCoords}
          mapUrl={mapUrl}
          onMapPaste={(e) => {
            const val = e.target.value;
            setMapUrl(val);
            const match = val.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match)
              setCoords({
                lat: parseFloat(match[1]),
                lng: parseFloat(match[2]),
              });
          }}
          onClearMap={() => {
            setCoords(null);
            setMapUrl("");
          }}
        />
      </div>

      {/* --- SIDEBAR --- */}
      <div className="lg:col-span-4 space-y-6">
        {/* TRANSACTION HUB */}
        <div className="bg-admin-surface border border-admin-muted/10 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-admin-text-muted tracking-widest">
              Market Visibility
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl p-3 text-sm font-bold outline-none focus:border-admin-accent cursor-pointer transition-colors"
            >
              {Object.entries(STATUS_STYLES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label.en}
                </option>
              ))}
            </select>
          </div>

          {/* 🟢 DYNAMIC PURPOSE SELECTOR (Only shows when Available) */}
          {status === "available" && (
            <div className="space-y-4 pt-4 border-t border-admin-muted/10 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest flex items-center gap-2">
                  <TagIcon className="h-3 w-3" /> Listing Purpose
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPurpose("sale")}
                    className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      purpose === "sale"
                        ? "bg-admin-accent text-white border-admin-accent shadow-lg"
                        : "bg-admin-bg text-admin-text-muted border-admin-muted/20 hover:bg-admin-bg/80"
                    }`}
                  >
                    For Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose("rent")}
                    className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      purpose === "rent"
                        ? "bg-purple-600 text-white border-purple-600 shadow-lg"
                        : "bg-admin-bg text-admin-text-muted border-admin-muted/20 hover:bg-admin-bg/80"
                    }`}
                  >
                    For Rent
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC SOLD INPUTS */}
          {status === "sold" && (
            <div className="space-y-4 pt-4 border-t border-admin-muted/10 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <CurrencyDollarIcon className="h-3 w-3" /> Closing Price (MAD)
                </label>
                <input
                  name="sold_price"
                  type="number"
                  defaultValue={listing.sold_price}
                  className="w-full bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-sm font-mono focus:border-red-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <CalendarDaysIcon className="h-3 w-3" /> Sold Date
                </label>
                <input
                  name="sold_date"
                  type="date"
                  defaultValue={listing.sold_date}
                  className="w-full bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-sm focus:border-red-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Assets Hub Link */}
        <div className="bg-admin-surface border border-admin-muted/10 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[10px] font-black uppercase text-admin-text-muted mb-4 tracking-widest">
            Visual Assets
          </h3>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-admin-bg border border-admin-muted/20 group">
            <Image
              src={
                listing.main_image_url
                  ? supabase.storage
                      .from("property-images")
                      .getPublicUrl(listing.main_image_url).data.publicUrl
                  : "/placeholder.jpg"
              }
              fill
              className="object-cover opacity-60 group-hover:opacity-30 transition-all"
              alt="Cover"
              unoptimized
            />
            <Link
              href={`/admin/listings/edit/${listing.id}/media`}
              className="absolute inset-0 flex flex-col items-center justify-center p-4"
            >
              <DocumentDuplicateIcon className="h-8 w-8 text-admin-text-primary mb-2 shadow-2xl" />
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                Manage Vault <ChevronRightIcon className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="sticky top-6 flex flex-col gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isSaving}
            className="w-full py-4 bg-admin-accent text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              "Register Updates"
            )}
          </button>
          <Link
            href="/admin/listings"
            className="w-full py-4 bg-admin-surface border border-admin-muted/20 text-admin-text-muted rounded-xl font-bold uppercase tracking-widest text-[10px] text-center flex items-center justify-center gap-2 hover:bg-admin-bg transition-colors shadow-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to Inventory
          </Link>
        </div>
      </div>
    </form>
  );
}
