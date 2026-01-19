import { createClient } from "@/utils/supabase/server";
import {
  UsersIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default async function LeadsPage() {
  const supabase = await createClient();

  // Fetch leads directly from your DB table
  const { data: leads } = await supabase
    .from("leads")
    .select("*, listings(title_en)") // Join with listings to see which property they want
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-admin-text-primary tracking-tight">
            Leads Inbox
          </h1>
          <p className="text-sm text-admin-text-muted mt-1">
            Potential clients from your website forms.
          </p>
        </div>
        <div className="px-4 py-2 bg-admin-surface border border-admin-muted/10 rounded-xl text-xs font-bold text-admin-text-muted">
          Total: {leads?.length || 0}
        </div>
      </div>

      {/* Leads List */}
      <div className="grid gap-4">
        {leads?.map((lead) => (
          <div
            key={lead.id}
            className="bg-admin-surface p-6 rounded-2xl border border-admin-muted/10 shadow-sm hover:border-admin-accent/30 transition-all group"
          >
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              {/* Client Info */}
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-admin-text-primary">
                    {lead.client_name || "Unknown Client"}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-admin-text-muted">
                    {lead.client_email && (
                      <span className="flex items-center gap-1 hover:text-admin-accent">
                        <EnvelopeIcon className="h-3 w-3" /> {lead.client_email}
                      </span>
                    )}
                    {lead.client_phone && (
                      <span className="flex items-center gap-1 hover:text-admin-accent">
                        <PhoneIcon className="h-3 w-3" /> {lead.client_phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Date */}
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    lead.status === "new"
                      ? "bg-green-500/10 text-green-600"
                      : lead.status === "contacted"
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-admin-muted/10 text-admin-text-muted"
                  }`}
                >
                  {lead.status}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-admin-text-muted">
                  <CalendarIcon className="h-3 w-3" />
                  {new Date(lead.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Message Body */}
            <div className="mt-4 pl-[4rem] border-l-2 border-admin-muted/10 ml-6">
              <p className="text-sm text-admin-text-primary/80 italic">
                {lead.message || "No message provided."}
              </p>
              {lead.listings && (
                <div className="mt-2 text-xs font-bold text-admin-accent">
                  Interested in: {lead.listings.title_en}
                </div>
              )}
            </div>
          </div>
        ))}

        {(!leads || leads.length === 0) && (
          <div className="p-12 text-center text-admin-text-muted text-sm italic bg-admin-surface rounded-2xl border border-admin-muted/10">
            No leads received yet.
          </div>
        )}
      </div>
    </div>
  );
}
