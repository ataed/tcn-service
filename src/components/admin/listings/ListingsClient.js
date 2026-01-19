"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast, Toaster } from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  StarIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

// Import your new Brain
import {
  PROPERTY_TYPES,
  STATUS_STYLES,
  getLabel,
} from "@/lib/schema/definitions";

export default function ListingsClient({ initialListings }) {
  const supabase = createClient();
  const [listings, setListings] = useState(initialListings);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);

  // --- ACTIONS ---

  const toggleFeatured = async (id, currentStatus) => {
    // Optimistic Update (Update UI immediately)
    const updatedListings = listings.map((l) =>
      l.id === id ? { ...l, is_featured: !currentStatus } : l,
    );
    setListings(updatedListings);

    const { error } = await supabase
      .from("listings")
      .update({ is_featured: !currentStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update");
      setListings(listings); // Revert on error
    } else {
      toast.success(
        currentStatus ? "Removed from Featured" : "Added to Featured",
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this property? This cannot be undone.",
      )
    )
      return;

    setIsDeleting(id);
    const { error } = await supabase.from("listings").delete().eq("id", id);

    if (!error) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      toast.success("Property deleted successfully");
    } else {
      toast.error("Error deleting property");
    }
    setIsDeleting(null);
  };

  // --- FILTERING LOGIC ---
  const filteredListings = listings.filter((l) => {
    const title = l.title_en || l.title || "";
    const address = l.address || "";

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || l.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <Toaster />

      {/* 1. CONTROLS BAR */}
      <div className="bg-admin-surface rounded-xl border border-admin-muted/10 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-admin-text-muted" />
          <input
            type="text"
            placeholder="Search by title or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-admin-bg border border-admin-muted/20 rounded-lg text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent transition-all"
          />
        </div>

        {/* Filters & Add Button */}
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
            className="px-6 py-2 bg-admin-accent text-white font-medium text-sm rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-admin-accent/20"
          >
            + Add New
          </Link>
        </div>
      </div>

      {/* 2. DESKTOP TABLE VIEW (Hidden on Mobile) */}
      <div className="hidden md:block bg-admin-surface rounded-xl border border-admin-muted/10 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-admin-bg border-b border-admin-muted/10 text-xs uppercase tracking-wider text-admin-text-muted font-semibold">
              <th className="p-4 w-20">Image</th>
              <th className="p-4">Property Details</th>
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

              // Safe Image URL (Handle missing images)
              const imageUrl = listing.main_image_url
                ? supabase.storage
                    .from("property-images")
                    .getPublicUrl(listing.main_image_url).data.publicUrl
                : null;

              return (
                <tr
                  key={listing.id}
                  className="hover:bg-admin-bg/50 transition-colors group"
                >
                  <td className="p-4">
                    <div className="relative h-12 w-16 rounded-md overflow-hidden bg-admin-muted/10">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-admin-text-primary">
                      {listing.title}
                    </div>
                    <div className="text-xs text-admin-text-muted truncate max-w-[200px]">
                      {listing.address || "No address provided"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-admin-text-primary">
                      {typeDef && (
                        <typeDef.icon className="h-4 w-4 text-admin-accent" />
                      )}
                      {getLabel(typeDef, "en")}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle.color}`}
                    >
                      {statusStyle.label.en}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        toggleFeatured(listing.id, listing.is_featured)
                      }
                      className="p-1 rounded-full hover:bg-admin-bg transition-colors"
                    >
                      {listing.is_featured ? (
                        <StarIconSolid className="h-5 w-5 text-amber-400" />
                      ) : (
                        <StarIcon className="h-5 w-5 text-admin-text-muted/30 hover:text-amber-400" />
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/listings/${listing.id}`}
                        className="p-2 text-admin-text-muted hover:text-admin-accent hover:bg-admin-accent/5 rounded-lg transition-colors"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        disabled={isDeleting === listing.id}
                        className="p-2 text-admin-text-muted hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredListings.length === 0 && (
          <div className="p-12 text-center text-admin-text-muted">
            No properties found matching your search.
          </div>
        )}
      </div>

      {/* 3. MOBILE CARD VIEW (Visible only on Mobile) */}
      <div className="md:hidden space-y-4">
        {filteredListings.map((listing) => {
          const typeDef = PROPERTY_TYPES.find((t) => t.id === listing.type);
          const statusStyle =
            STATUS_STYLES[listing.status] || STATUS_STYLES.pending;
          const imageUrl = listing.main_image_url
            ? supabase.storage
                .from("property-images")
                .getPublicUrl(listing.main_image_url).data.publicUrl
            : null;

          return (
            <div
              key={listing.id}
              className="bg-admin-surface p-4 rounded-xl border border-admin-muted/10 shadow-sm flex gap-4"
            >
              {/* Image Thumbnail */}
              <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-admin-muted/10">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-admin-text-primary truncate pr-2">
                      {listing.title_en || "Untitled Property"}
                    </h3>
                    <button
                      onClick={() =>
                        toggleFeatured(listing.id, listing.is_featured)
                      }
                    >
                      {listing.is_featured ? (
                        <StarIconSolid className="h-4 w-4 text-amber-400" />
                      ) : (
                        <StarIcon className="h-4 w-4 text-admin-text-muted/30" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-admin-text-muted truncate mt-1">
                    {listing.address || "No address provided"}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${statusStyle.color}`}
                  >
                    {statusStyle.label.en}
                  </span>

                  <div className="flex gap-1">
                    <Link
                      href={`/admin/listings/${listing.id}`}
                      className="p-1.5 bg-admin-bg text-admin-text-muted rounded-md border border-admin-muted/10"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </Link>
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
