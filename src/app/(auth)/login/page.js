"use client";

import { useTransition, useState } from "react";
import { login } from "./actions";
import { toast, Toaster } from "react-hot-toast";
import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-bg p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-admin-surface border border-admin-muted/10 p-8 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-wider text-admin-text-primary uppercase">
            TCN <span className="text-admin-accent">Admin</span>
          </h1>
          <p className="text-xs text-admin-text-muted mt-2 tracking-widest uppercase">
            Secure Gateway Access
          </p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-admin-text-muted uppercase ml-1">
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-admin-text-muted" />
              <input
                name="email"
                type="email"
                required
                placeholder="admin@tcn-services.com"
                className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl py-3 pl-12 pr-4 text-sm text-admin-text-primary focus:border-admin-accent focus:ring-1 focus:ring-admin-accent transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-admin-text-muted uppercase ml-1">
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-admin-text-muted" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full bg-admin-bg border border-admin-muted/20 rounded-xl py-3 pl-12 pr-4 text-sm text-admin-text-primary focus:border-admin-accent focus:ring-1 focus:ring-admin-accent transition-all outline-none"
              />
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-admin-accent hover:bg-opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-admin-accent/20 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-admin-text-muted uppercase tracking-widest">
            Protected by Supabase Auth
          </p>
        </div>
      </div>
    </div>
  );
}
