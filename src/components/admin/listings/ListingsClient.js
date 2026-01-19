"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast, Toaster } from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  StarIcon,
  ArrowPathIcon, // 🟢 Added for loading spinner
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import {
  PROPERTY_TYPES,
  STATUS_STYLES,
  getLabel,
} from "@/lib/schema/definitions";

import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function ListingsClient({ initialListings }) {
  const supabase = createClient();
  const [listings, setListings] = useState(initialListings);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOffPlanOnly, setShowOffPlanOnly] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null); // 🟢 Added for featured loading

  // Unified Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: null, data: null });

  // Enhanced Counter Logic
  const counts = {
    all: listings.length,
    available: listings.filter((l) => l.status === "available").length,
    pending: listings.filter((l) => l.status === "pending").length,
    sold: listings.filter((l) => l.status === "sold").length,
    rented: listings.filter((l) => l.status === "rented").length,
    offPlan: listings.filter((l) => l.is_off_plan).length,
  };

  // --- ACTIONS ---

  const initiateToggleFeatured = (id, currentStatus) => {
    const isAdding = !currentStatus;
    if (isAdding) {
      const currentFeaturedCount = listings.filter((l) => l.is_featured).length;
      if (currentFeaturedCount >= 3) {
        toast.error("Limit Reached: You can only feature up to 3 properties.");
        return;
      }
    }
    setModalConfig({
      type: "feature",
      data: { id, newStatus: !currentStatus },
    });
    setModalOpen(true);
  };

  const initiateDelete = (id) => {
    setModalConfig({ type: "delete", data: { id } });
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    const { type, data } = modalConfig;
    setModalOpen(false);

    if (type === "feature") {
      const { id, newStatus } = data;
      setIsUpdating(id); // 🟢 Start loading for featured toggle

      const updatedListings = listings.map((l) =>
        l.id === id ? { ...l, is_featured: newStatus } : l,
      );
      setListings(updatedListings);

      try {
        const { error } = await supabase
          .from("listings")
          .update({ is_featured: newStatus })
          .eq("id", id);

        if (error) {
          toast.error("Failed to update");
          setListings(listings);
        } else {
          toast.success(
            newStatus ? "Property Featured!" : "Removed from Featured",
          );
        }
      } finally {
        setIsUpdating(null); // 🟢 Stop loading
      }
    }

    if (type === "delete") {
      const { id } = data;
      setIsDeleting(id); // Existing loading state

      try {
        const item = listings.find((l) => l.id === id);

        if (item) {
          const imageFiles = [];
          if (item.main_image_url) imageFiles.push(item.main_image_url);
          if (item.gallery_urls?.length > 0)
            imageFiles.push(...item.gallery_urls);

          if (imageFiles.length > 0) {
            await supabase.storage.from("property-images").remove(imageFiles);
          }

          if (item.technical_plans?.length > 0) {
            await supabase.storage
              .from("technical-plans")
              .remove(item.technical_plans);
          }
        }

        const { error } = await supabase.from("listings").delete().eq("id", id);

        if (!error) {
          setListings((prev) => prev.filter((l) => l.id !== id));
          toast.success("Listing and all files deleted successfully");
        } else {
          throw error;
        }
      } catch (err) {
        console.error("Cleanup Error:", err);
        toast.error(
          "Database deleted, but some files might remain in storage.",
        );
      } finally {
        setIsDeleting(null);
      }
    }
    setModalConfig({ type: null, data: null });
  };

  // --- FILTERING LOGIC ---
  const filteredListings = listings.filter((l) => {
    const title = l.title_en || l.title || "";
    const address = l.address || "";
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || l.type === filterType;
    const matchesStatus = filterStatus === "all" || l.status === filterStatus;
    const matchesOffPlan = !showOffPlanOnly || l.is_off_plan;

    return matchesSearch && matchesType && matchesStatus && matchesOffPlan;
  });

  return (
    <>
      <Toaster />

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        isWarning={modalConfig.type === "delete"}
        title={
          modalConfig.type === "delete"
            ? "Delete Property?"
            : "Feature Property?"
        }
        message={
          modalConfig.type === "delete"
            ? "Are you sure? This will permanently remove the listing from the database."
            : "This action will update the property's visibility in the featured section."
        }
      />

      {/* TOP FILTER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border flex items-center gap-2 ${
              filterStatus === "all"
                ? "bg-admin-surface border-admin-accent text-admin-accent shadow-sm"
                : "bg-transparent border-transparent text-admin-text-muted hover:bg-admin-surface/50"
            }`}
          >
            <span>All Assets</span>
            <span className="px-1.5 py-0.5 rounded-md bg-admin-muted/10 text-[10px] font-bold">
              {counts.all}
            </span>
          </button>

          {Object.entries(STATUS_STYLES)
            .filter(([key]) => key !== "off_plan")
            .map(([key, style]) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border flex items-center gap-2 ${
                  filterStatus === key
                    ? "bg-admin-surface border-admin-accent text-admin-accent shadow-sm"
                    : "bg-transparent border-transparent text-admin-text-muted hover:bg-admin-surface/50"
                }`}
              >
                <span
                  className={
                    filterStatus === key
                      ? "text-admin-accent"
                      : style.color.split(" ")[1]
                  }
                >
                  {style.label.en}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-admin-muted/10 text-[10px] font-bold">
                  {counts[key] || 0}
                </span>
              </button>
            ))}
        </div>

        <button
          onClick={() => setShowOffPlanOnly(!showOffPlanOnly)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border flex items-center gap-2 ${
            showOffPlanOnly
              ? "bg-purple-500/10 border-purple-500/50 text-purple-600 dark:text-purple-400 shadow-sm"
              : "bg-transparent border-admin-muted/10 text-admin-text-muted hover:bg-admin-surface"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${showOffPlanOnly ? "bg-purple-500 animate-pulse" : "bg-admin-text-muted/40"}`}
          ></span>
          Off-Plan Projects
          <span className="px-1.5 py-0.5 rounded-md bg-admin-muted/10 text-[10px] font-bold">
            {counts.offPlan}
          </span>
        </button>
      </div>

      {/* 2. CONTROLS BAR */}
      <div className="bg-admin-surface rounded-xl border border-admin-muted/10 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-96">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-admin-text-muted" />
          <input
            type="text"
            placeholder="Search title or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-admin-bg border border-admin-muted/20 rounded-lg text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent transition-all"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-admin-bg border border-admin-muted/20 rounded-lg text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent"
          >
            <option value="all">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {getLabel(t, "en")}
              </option>
            ))}
          </select>
          <Link
            href="/admin/listings/add"
            className="px-6 py-2 bg-admin-accent text-white font-medium text-sm rounded-lg shadow-lg shadow-admin-accent/20"
          >
            + Add New
          </Link>
        </div>
      </div>

      {/* 3. TABLE */}
      <div className="hidden md:block bg-admin-surface rounded-xl border border-admin-muted/10 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-admin-bg border-b border-admin-muted/10 text-xs uppercase tracking-wider text-admin-text-muted font-semibold">
              <th className="p-4 w-20">Image</th>
              <th className="p-4">Details</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-muted/10">
            {filteredListings.map((listing) => {
              const typeDef = PROPERTY_TYPES.find((t) => t.id === listing.type);
              const statusStyle =
                STATUS_STYLES[listing.status] || STATUS_STYLES.pending;
              const isPublished = listing.status === "available";
              const imageUrl = listing.main_image_url
                ? supabase.storage
                    .from("property-images")
                    .getPublicUrl(listing.main_image_url).data.publicUrl
                : null;

              return (
                <tr
                  key={listing.id}
                  className={`hover:bg-admin-bg/50 transition-colors group ${isDeleting === listing.id || isUpdating === listing.id ? "opacity-50" : ""}`}
                >
                  <td className="p-4">
                    <div className="relative h-12 w-16 rounded-md overflow-hidden bg-admin-muted/10">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt="img"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-admin-text-primary flex items-center gap-2">
                      {listing.title_en || listing.title || "Untitled"}
                      {listing.is_off_plan && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-md font-bold uppercase tracking-tighter">
                          Plan
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-admin-text-muted truncate max-w-[200px]">
                      {listing.address}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-admin-text-primary">
                    {typeDef ? getLabel(typeDef, "en") : listing.type}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.color}`}
                    >
                      {statusStyle.label.en}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {isPublished ? (
                      <button
                        onClick={() =>
                          initiateToggleFeatured(
                            listing.id,
                            listing.is_featured,
                          )
                        }
                        disabled={isUpdating === listing.id}
                      >
                        {isUpdating === listing.id ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin text-admin-accent" />
                        ) : listing.is_featured ? (
                          <StarIconSolid className="h-5 w-5 text-amber-400" />
                        ) : (
                          <StarIcon className="h-5 w-5 text-admin-text-muted/30 hover:text-amber-400" />
                        )}
                      </button>
                    ) : (
                      <span className="text-[10px] text-admin-text-muted italic opacity-40">
                        —
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/listings/edit/${listing.id}`}
                        className="p-2 text-admin-text-muted hover:text-admin-accent hover:bg-admin-accent/5 rounded-lg"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => initiateDelete(listing.id)}
                        disabled={isDeleting === listing.id}
                        className="p-2 text-admin-text-muted hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                      >
                        {isDeleting === listing.id ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin text-red-500" />
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredListings.length === 0 && (
          <div className="p-12 text-center text-admin-text-muted text-sm italic">
            No properties matching these filters.
          </div>
        )}
      </div>

      {/* 4. MOBILE VIEW */}
      <div className="md:hidden space-y-4 pb-10">
        {filteredListings.map((listing) => {
          const statusStyle =
            STATUS_STYLES[listing.status] || STATUS_STYLES.pending;
          const isPublished = listing.status === "available";
          const imageUrl = listing.main_image_url
            ? supabase.storage
                .from("property-images")
                .getPublicUrl(listing.main_image_url).data.publicUrl
            : null;

          return (
            <div
              key={listing.id}
              className={`bg-admin-surface p-4 rounded-xl border border-admin-muted/10 shadow-sm flex gap-4 ${isDeleting === listing.id || isUpdating === listing.id ? "opacity-50" : ""}`}
            >
              <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-admin-muted/10">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt="img"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-semibold text-admin-text-primary truncate">
                    {listing.title_en || "Untitled"}
                  </h3>
                  {isPublished && (
                    <button
                      onClick={() =>
                        initiateToggleFeatured(listing.id, listing.is_featured)
                      }
                      disabled={isUpdating === listing.id}
                    >
                      {isUpdating === listing.id ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin text-admin-accent" />
                      ) : listing.is_featured ? (
                        <StarIconSolid className="h-4 w-4 text-amber-400" />
                      ) : (
                        <StarIcon className="h-4 w-4 text-admin-text-muted/30" />
                      )}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border ${statusStyle.color}`}
                    >
                      {statusStyle.label.en}
                    </span>
                    {listing.is_off_plan && (
                      <span className="text-[8px] font-bold text-purple-500 uppercase">
                        Plan
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/listings/edit/${listing.id}`}
                      className="p-1.5 bg-admin-bg text-admin-text-muted rounded-md border border-admin-muted/10"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => initiateDelete(listing.id)}
                      disabled={isDeleting === listing.id}
                      className="p-1.5 bg-admin-bg text-admin-text-muted rounded-md border border-admin-muted/10"
                    >
                      {isDeleting === listing.id ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin text-red-500" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
