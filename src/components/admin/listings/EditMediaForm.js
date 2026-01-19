"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  TrashIcon,
  DocumentIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function EditMediaForm({ listing }) {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. STATE MANAGEMENT ---
  const [mainImage, setMainImage] = useState({
    path: listing.main_image_url,
    file: null,
    preview: listing.main_image_url
      ? supabase.storage
          .from("property-images")
          .getPublicUrl(listing.main_image_url).data.publicUrl
      : null,
  });

  const [gallery, setGallery] = useState(
    listing.gallery_urls?.map((url) => ({
      path: url,
      file: null,
      preview: supabase.storage.from("property-images").getPublicUrl(url).data
        .publicUrl,
    })) || [],
  );

  const [plans, setPlans] = useState(
    listing.technical_plans?.map((url) => ({
      path: url,
      file: null,
      name: url.split("/").pop(),
    })) || [],
  );

  // --- 2. HANDLERS ---
  const handleMainChange = (e) => {
    const file = e.target.files[0];
    if (file)
      setMainImage({ path: null, file, preview: URL.createObjectURL(file) });
  };

  const handleGalleryAdd = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map((file) => ({
      path: null,
      file,
      preview: URL.createObjectURL(file),
    }));
    setGallery((prev) => [...prev, ...newItems]);
  };

  const handlePlanAdd = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map((file) => ({
      path: null,
      file,
      name: file.name,
    }));
    setPlans((prev) => [...prev, ...newItems]);
  };

  // --- 3. SYNC EXECUTION ---
  const handleSync = async () => {
    setIsModalOpen(false);
    setIsSaving(true);
    const toastId = toast.loading("Synchronizing Media Vault...");

    try {
      // 🟢 STEP A: DELETE REMOVED FILES FROM BUCKETS
      // 1. Main Image Cleanup
      if (listing.main_image_url && mainImage.file) {
        // If a new main file is staged, delete the old one
        const { error: delMainErr } = await supabase.storage
          .from("property-images")
          .remove([listing.main_image_url]);
        if (delMainErr) console.error("Error deleting old cover:", delMainErr);
      }

      // 2. Gallery Cleanup
      const originalGallery = listing.gallery_urls || [];
      const currentGalleryPaths = gallery
        .filter((item) => item.path)
        .map((item) => item.path);
      const galleryToDelete = originalGallery.filter(
        (path) => !currentGalleryPaths.includes(path),
      );

      if (galleryToDelete.length > 0) {
        const { error: delGalErr } = await supabase.storage
          .from("property-images")
          .remove(galleryToDelete);
        if (delGalErr)
          console.error("Error deleting gallery images:", delGalErr);
      }

      // 3. Technical Plans Cleanup
      const originalPlans = listing.technical_plans || [];
      const currentPlanPaths = plans
        .filter((item) => item.path)
        .map((item) => item.path);
      const plansToDelete = originalPlans.filter(
        (path) => !currentPlanPaths.includes(path),
      );

      if (plansToDelete.length > 0) {
        const { error: delPlanErr } = await supabase.storage
          .from("technical-plans")
          .remove(plansToDelete);
        if (delPlanErr) console.error("Error deleting old plans:", delPlanErr);
      }

      // 🟢 STEP B: UPLOAD NEW FILES
      const uploadFile = async (item, bucket, folder) => {
        if (item.path) return item.path;

        // 🟢 FIX: Removed `${listing.id}/` prefix to ensure flat folder structure
        // This prevents creating subfolders like "uploads/UUID/file.pdf"
        const cleanName = (item.file?.name || item.name).replace(
          /[^a-zA-Z0-9.]/g,
          "_",
        );
        const fileName = `${Date.now()}-${cleanName}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(`${folder}/${fileName}`, item.file);

        if (error) throw error;
        return data.path;
      };

      // Concurrent Uploads
      const finalMainPath = mainImage.file
        ? await uploadFile(mainImage, "property-images", "main")
        : mainImage.path;

      const finalGalleryPaths = await Promise.all(
        gallery.map((item) => uploadFile(item, "property-images", "gallery")),
      );

      const finalPlanPaths = await Promise.all(
        plans.map((item) => uploadFile(item, "technical-plans", "uploads")),
      );

      // 🟢 STEP C: UPDATE DATABASE
      const { error } = await supabase
        .from("listings")
        .update({
          main_image_url: finalMainPath,
          gallery_urls: finalGalleryPaths,
          technical_plans: finalPlanPaths,
          updated_at: new Date().toISOString(),
        })
        .eq("id", listing.id);

      if (error) throw error;

      toast.success("Media Assets Synchronized", { id: toastId });
      router.refresh();

      router.push(`/admin/listings/edit/${listing.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Sync failed: " + err.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 pb-20">
      <Toaster />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSync}
        title="Sync Media Vault?"
        message="This will upload new files, delete removed ones from storage, and update property records."
      />

      <div className="lg:col-span-8 space-y-8">
        {/* SECTION 1: MAIN HERO */}
        <section className="bg-admin-surface border border-admin-muted/10 rounded-3xl p-6 shadow-xl overflow-hidden">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-text-muted mb-6 flex items-center gap-2">
            <PhotoIcon className="h-4 w-4" /> Main Cover Asset
          </h3>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-admin-bg border border-admin-muted/20 group">
            <Image
              src={mainImage.preview || "/placeholder.jpg"}
              fill
              className="object-cover"
              alt="Main"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-sm">
              <label className="cursor-pointer bg-white text-black p-4 rounded-full hover:bg-admin-accent hover:text-white transition-all shadow-2xl">
                <CloudArrowUpIcon className="h-6 w-6" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleMainChange}
                />
              </label>
            </div>
          </div>
        </section>

        {/* SECTION 2: GALLERY GRID */}
        <section className="bg-admin-surface border border-admin-muted/10 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-text-muted">
              Gallery Portfolio
            </h3>
            <label className="cursor-pointer text-[10px] font-bold bg-admin-accent/10 text-admin-accent px-4 py-2 rounded-full hover:bg-admin-accent hover:text-white transition-all">
              + Add Photos
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleGalleryAdd}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gallery.map((item, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl overflow-hidden bg-admin-bg group border border-admin-muted/10"
              >
                <Image
                  src={item.preview}
                  fill
                  className="object-cover"
                  alt=""
                  unoptimized
                />
                <div className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                  <button
                    onClick={() =>
                      setGallery((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-white p-3"
                  >
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </div>
                {!item.path && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-admin-accent text-[8px] font-bold text-white rounded">
                    NEW
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:col-span-4 space-y-8">
        {/* SECTION 3: TECHNICAL PLANS */}
        <section className="bg-admin-surface border border-admin-muted/10 rounded-3xl p-6 shadow-xl">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-text-muted mb-6">
            Technical Records (PDF)
          </h3>
          <div className="space-y-3">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-admin-bg/50 border border-admin-muted/10 rounded-2xl group transition-all hover:border-admin-accent/40"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <DocumentIcon
                    className={`h-5 w-5 shrink-0 ${plan.path ? "text-admin-text-muted" : "text-admin-accent"}`}
                  />
                  <span className="text-[10px] font-bold truncate">
                    {plan.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {plan.path && (
                    <a
                      href={
                        supabase.storage
                          .from("technical-plans")
                          .getPublicUrl(plan.path).data.publicUrl
                      }
                      target="_blank"
                      className="p-1.5 text-admin-text-muted hover:text-admin-accent"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() =>
                      setPlans((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="p-1.5 text-admin-text-muted hover:text-red-500"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-admin-muted/20 rounded-2xl hover:border-admin-accent cursor-pointer transition-all">
              <CloudArrowUpIcon className="h-8 w-8 text-admin-text-muted mb-2" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-admin-text-muted">
                Upload Plan
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                accept=".pdf"
                onChange={handlePlanAdd}
              />
            </label>
          </div>
        </section>

        {/* STICKY ACTION CARD */}
        <div className="sticky top-6 bg-admin-surface border border-admin-muted/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isSaving}
            className="w-full py-5 bg-admin-text text-admin-bg rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-admin-accent hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSaving ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <CloudArrowUpIcon className="h-5 w-5" /> Sync Vault
              </>
            )}
          </button>

          <Link
            href={`/admin/listings/edit/${listing.id}`}
            className="w-full py-5 border border-admin-muted/20 text-admin-text-muted rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-admin-bg transition-all"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Discard
          </Link>
        </div>
      </div>
    </div>
  );
}
