import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditMediaForm from "@/components/admin/listings/EditMediaForm";

export default async function MediaPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select("id, title_en, main_image_url, gallery_urls, technical_plans")
    .eq("id", id)
    .single();

  if (error || !listing) notFound();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1 px-4">
        <h1 className="text-2xl font-bold text-admin-text-primary tracking-tight">
          Media Vault
        </h1>
        <p className="text-xs text-admin-text-muted font-mono uppercase tracking-widest">
          Syncing Assets for: {listing.title_en || "Untitled Property"}
        </p>
      </div>

      <EditMediaForm listing={listing} />
    </div>
  );
}
