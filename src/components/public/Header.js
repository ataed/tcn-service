"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header({ locale }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Navigation");

  // 🔒 LOCK SCROLL WHEN MENU IS OPEN
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    {
      name: t("home"),
      href: "",
      isActive: pathname === `/${locale}` || pathname === `/${locale}/`,
    },
    {
      name: t("buy"),
      href: "/search?purpose=sale",
      isActive:
        pathname.includes("/search") && searchParams.get("purpose") === "sale",
    },
    {
      name: t("rent"),
      href: "/search?purpose=rent",
      isActive:
        pathname.includes("/search") && searchParams.get("purpose") === "rent",
    },
    {
      name: t("offPlan"),
      href: "/search?type=off-plan",
      isActive:
        pathname.includes("/search") && searchParams.get("type") === "off-plan",
    },
    {
      name: t("sell"),
      href: "/sell",
      isActive: pathname.includes("/sell"),
    },
  ];

  const handleLangSwitch = (newLocale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        {/* 1. LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 group relative z-[5000]"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-primary-950 font-serif font-bold text-xl rounded-sm shadow-lg">
            T
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold text-white tracking-tight leading-none">
              TCN
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-accent-500 font-medium">
              Real Estate
            </span>
          </div>
        </Link>

        {/* 2. DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={`/${locale}${link.href}`}
              className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 border-b-2 py-1 ${
                link.isActive
                  ? "text-accent-500 border-accent-500"
                  : "text-white/80 border-transparent hover:text-accent-500 hover:border-accent-500/50"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            href={`/${locale}/contact`}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-lg ${
              pathname.includes("/contact")
                ? "bg-white text-primary-950"
                : "bg-accent-500 hover:bg-accent-600 text-white shadow-accent-500/20"
            }`}
          >
            {t("contact")}
          </Link>

          {/* 🟢 RTL FIX: Use rtl: modifiers to flip border/padding/margin */}
          <div className="flex items-center gap-3 border-l rtl:border-l-0 rtl:border-r border-white/20 pl-6 rtl:pl-0 rtl:pr-6 ml-2 rtl:ml-0 rtl:mr-2">
            {["en", "fr", "ar", "es"].map((l) => (
              <button
                key={l}
                onClick={() => handleLangSwitch(l)}
                className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  locale === l
                    ? "text-accent-500 scale-110"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </nav>

        {/* 3. MOBILE MENU TOGGLE BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 relative z-[5000] text-white hover:text-accent-500 transition-colors"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-8 w-8" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* 4. MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 w-screen h-screen z-[4000] flex flex-col items-center justify-center space-y-8 animate-fade-in"
          style={{ backgroundColor: "#141C24" }}
        >
          {/* Navigation Links */}
          <div className="flex flex-col items-center gap-8 w-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={`/${locale}${link.href}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-3xl font-light tracking-widest transition-colors ${
                  link.isActive
                    ? "text-accent-500 font-medium"
                    : "text-white hover:text-accent-500"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href={`/${locale}/contact`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-bold text-accent-500 uppercase tracking-widest mt-6 border border-accent-500 px-8 py-3 rounded-full"
            >
              {t("contact")}
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-6 pt-8 border-t border-white/10 w-3/4 mx-auto">
            {["en", "fr", "ar", "es"].map((l) => (
              <button
                key={l}
                onClick={() => {
                  handleLangSwitch(l);
                  setMobileMenuOpen(false);
                }}
                className={`text-lg font-bold uppercase ${
                  locale === l ? "text-accent-500" : "text-white/30"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
