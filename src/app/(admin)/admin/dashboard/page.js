import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import {
  HomeModernIcon,
  BanknotesIcon,
  ClockIcon,
  TagIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

// Helper to format currency (MAD)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Fetch All Data Needed
  const { data: listings } = await supabase
    .from("listings")
    .select(
      "id, title_en, status, price, type, sold_price, created_at, is_off_plan",
    )
    .order("created_at", { ascending: false });

  if (!listings) return <div className="p-8">Loading analytics...</div>;

  // 2. Calculate KPI Metrics
  const stats = {
    total: listings.length,
    // active = Published only
    active: listings.filter((l) => l.status === "available").length,
    sold: listings.filter((l) => l.status === "sold").length,
    offPlan: listings.filter((l) => l.is_off_plan).length,

    // 🟢 Financials: STRICTLY 'Available' (Published) assets only
    activeVolume: listings
      .filter((l) => l.status === "available")
      .reduce((sum, l) => sum + (l.price || 0), 0),

    // Realized Revenue from 'Sold' items using the actual sold_price
    soldVolume: listings
      .filter((l) => l.status === "sold")
      .reduce((sum, l) => sum + (l.sold_price || 0), 0),
  };

  // 3. Get Recent Activity (Top 5)
  const recentListings = listings.slice(0, 5);

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-admin-text-primary tracking-tight">
            Agency Command Center
          </h1>
          <p className="text-sm text-admin-text-muted mt-1">
            Real-time inventory overview and financial performance.
          </p>
        </div>
        <Link
          href="/admin/listings/add"
          className="px-5 py-2.5 bg-admin-accent text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          + New Asset
        </Link>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Inventory */}
        <div className="bg-admin-surface p-6 rounded-2xl border border-admin-muted/10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <HomeModernIcon className="h-16 w-16 text-admin-text-primary" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-text-muted mb-2">
            Total Inventory
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-admin-text-primary">
              {stats.total}
            </h3>
            <span className="text-xs font-medium text-admin-text-muted">
              Assets
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 bg-purple-500/10 text-purple-600 rounded text-[10px] font-bold uppercase">
              {stats.offPlan} Off-Plan
            </span>
          </div>
        </div>

        {/* Card 2: Published Market Value */}
        <div className="bg-admin-surface p-6 rounded-2xl border border-admin-muted/10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TagIcon className="h-16 w-16 text-blue-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">
            Published Market Value
          </p>
          <h3 className="text-2xl font-black text-admin-text-primary truncate">
            {formatCurrency(stats.activeVolume)}
          </h3>
          <p className="text-[10px] text-admin-text-muted mt-1">
            Sum of {stats.active} published assets only
          </p>
        </div>

        {/* Card 3: Realized Revenue (Sold) */}
        <div className="bg-admin-surface p-6 rounded-2xl border border-admin-muted/10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BanknotesIcon className="h-16 w-16 text-green-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-2">
            Realized Volume (Sold)
          </p>
          <h3 className="text-2xl font-black text-admin-text-primary truncate">
            {formatCurrency(stats.soldVolume)}
          </h3>
          <p className="text-[10px] text-admin-text-muted mt-1">
            Generated from {stats.sold} closed deals
          </p>
        </div>

        {/* Card 4: Status Breakdown */}
        <div className="bg-admin-surface p-6 rounded-2xl border border-admin-muted/10 shadow-sm flex flex-col justify-center gap-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-admin-text-muted font-bold uppercase">
              Published
            </span>
            <span className="text-admin-text-primary font-mono">
              {stats.active}
            </span>
          </div>
          <div className="w-full h-1.5 bg-admin-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${stats.total ? (stats.active / stats.total) * 100 : 0}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-admin-text-muted font-bold uppercase">
              Sold
            </span>
            <span className="text-admin-text-primary font-mono">
              {stats.sold}
            </span>
          </div>
          <div className="w-full h-1.5 bg-admin-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${stats.total ? (stats.sold / stats.total) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent List */}
        <div className="lg:col-span-2 bg-admin-surface border border-admin-muted/10 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-admin-text-primary uppercase tracking-widest flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-admin-accent" /> Recent Updates
            </h3>
            <Link
              href="/admin/listings"
              className="text-[10px] font-bold uppercase text-admin-text-muted hover:text-admin-accent flex items-center gap-1"
            >
              View Inventory <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentListings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-4 bg-admin-bg rounded-2xl border border-admin-muted/10 hover:border-admin-accent/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-admin-surface flex items-center justify-center border border-admin-muted/10 text-admin-text-muted group-hover:text-admin-accent group-hover:border-admin-accent transition-colors">
                    <BuildingOfficeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-admin-text-primary group-hover:text-admin-accent transition-colors">
                      {listing.title_en || "Untitled Property"}
                    </h4>
                    <p className="text-[10px] text-admin-text-muted uppercase tracking-wider">
                      {listing.type} • {formatCurrency(listing.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-1 rounded text-[9px] font-bold uppercase border ${
                      listing.status === "sold"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : listing.status === "available"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : "bg-admin-muted/10 text-admin-text-muted border-admin-muted/20"
                    }`}
                  >
                    {listing.status === "available"
                      ? "Published"
                      : listing.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="bg-gradient-to-br from-admin-accent to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 bg-black opacity-20 rounded-full blur-2xl"></div>

          <h3 className="text-xl font-black mb-2 relative z-10">Pro Tip</h3>
          <p className="text-white/80 text-sm mb-6 relative z-10 leading-relaxed">
            Marking a property as <strong>Sold</strong> unlocks the closing
            price & date fields. This dashboard uses that data to track your
            Realized Volume separately from your Published Inventory.
          </p>

          <Link
            href="/admin/listings/add"
            className="inline-block w-full py-3 bg-white text-admin-accent font-bold text-center rounded-xl text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all relative z-10"
          >
            Add New Listing
          </Link>
        </div>
      </div>
    </div>
  );
}
