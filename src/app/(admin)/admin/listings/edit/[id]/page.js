import { createClient } from "@/utils/supabase/server";

import { notFound } from "next/navigation";

import EditListingForm from "@/components/admin/listings/EditListingForm";
export default async function EditPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !listing) notFound();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-admin-text-primary tracking-tight">
          Edit Asset
        </h1>
        {/* 🟢 Display the actual Ref ID from the database column */}
        <p className="text-xs text-admin-text-muted font-mono uppercase tracking-widest flex items-center gap-2">
          Property Ref:
          <span className="text-admin-accent font-bold">
            {listing.ref_id || "PENDING_REF"}
          </span>
        </p>
      </div>

      <EditListingForm listing={listing} />
    </div>
  );
}
