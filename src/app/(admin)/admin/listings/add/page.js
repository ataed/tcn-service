import AddListingForm from "@/components/admin/listings/AddListingForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function AddListingPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/listings"
          className="p-2 rounded-full hover:bg-admin-surface text-admin-text-muted hover:text-admin-text-primary transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-admin-text-primary">
            New Listing
          </h1>
          <p className="text-admin-text-muted text-sm">
            Create a new property in your portfolio.
          </p>
        </div>
      </div>

      {/* The Form */}
      <AddListingForm />
    </div>
  );
}
