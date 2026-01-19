import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export default function ProfilePage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <div className="h-20 w-20 bg-admin-surface rounded-full flex items-center justify-center mb-6 border border-admin-muted/10 shadow-xl">
        <WrenchScrewdriverIcon className="h-10 w-10 text-admin-text-muted" />
      </div>
      <h1 className="text-2xl font-black text-admin-text-primary mb-2">
        Feature Coming Soon
      </h1>
      <p className="text-sm text-admin-text-muted max-w-md">
        We are putting the finishing touches on the Agent Profile manager. Check
        back in a future update.
      </p>
    </div>
  );
}
