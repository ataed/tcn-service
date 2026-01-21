"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function ContactForm() {
  const t = useTranslations("Contact.form");
  const [status, setStatus] = useState("idle"); // idle, loading, success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API Call (Replace with actual Supabase logic later)
    setTimeout(() => {
      setStatus("success");
      e.target.reset();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-accent-500 font-bold ml-1">
            {t("name")}
          </label>
          <input
            required
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-accent-500 font-bold ml-1">
            {t("phone")}
          </label>
          <input
            type="tel"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
            placeholder="+212 6..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-accent-500 font-bold ml-1">
          {t("email")}
        </label>
        <input
          required
          type="email"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
          placeholder="john@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-accent-500 font-bold ml-1">
          {t("message")}
        </label>
        <textarea
          required
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all resize-none"
        ></textarea>
      </div>

      <button
        disabled={status === "loading" || status === "success"}
        type="submit"
        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
          status === "success"
            ? "bg-green-500 text-white"
            : "bg-accent-500 hover:bg-accent-600 text-white"
        }`}
      >
        {status === "loading" ? (
          t("sending")
        ) : status === "success" ? (
          t("success")
        ) : (
          <>
            {t("submit")} <PaperAirplaneIcon className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
