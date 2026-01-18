import { createClient } from "@/utils/supabase/server";
import ListingsClient from "@/components/admin/listings/ListingsClient";

export default async function ListingsPage() {
  const supabase = await createClient();

  // Fetch data on the server for instant SEO and speed
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-text-primary">
          Property Inventory
        </h1>
        <p className="text-admin-text-muted text-sm">
          Manage your portfolio, update statuses, and highlight featured assets.
        </p>
      </div>

      {/* Pass data to the interactive client component */}
      <ListingsClient initialListings={listings || []} />
    </div>
  );
}
