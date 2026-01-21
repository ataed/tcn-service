"use client"; // 🟢 Added client directive

import Link from "next/link";
import { useTranslations } from "next-intl"; // 🟢 1. Import Hook
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function Footer({ locale }) {
  const currentYear = new Date().getFullYear();

  // 🟢 2. Initialize Hooks
  const t = useTranslations("Footer"); // For Footer specific text
  const tNav = useTranslations("Navigation"); // For Links (Buy, Sell, etc.)
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      path: "M16 8.049c0-4.478-2.158-5.885-6.327-7.008C8.845 1.018 7.568 1.018 6.673 1.041 2.504 2.164 0.346 3.57 0.346 8.049c0 4.479 2.158 5.886 6.327 7.008 1.155 0.311 2.502 0.311 3.346 0 4.169-1.122 6.327-2.529 6.327-7.008zM8.346 12.564c-2.493 0-4.515-2.022-4.515-4.515 0-2.493 2.022-4.515 4.515-4.515 2.493 0 4.515 2.022 4.515 4.515 0 2.493-2.022 4.515-4.515 4.515zM8.346 4.887c-1.748 0-3.162 1.414-3.162 3.162 0 1.748 1.414 3.162 3.162 3.162 1.748 0 3.162-1.414 3.162-3.162 0-1.748-1.414-3.162-3.162-3.162zM12.548 4.706c-0.548 0-0.992-0.444-0.992-0.992 0-0.548 0.444-0.992 0.992-0.992 0.548 0 0.992 0.444 0.992 0.992 0 0.548-0.444 0.992-0.992 0.992z",
      viewBox: "0 0 17 17", // Instagram icon is slightly different ratio usually
    },
    {
      name: "WhatsApp",
      href: "https://whatsapp.com",
      path: "M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z",
      viewBox: "0 0 16 16",
    },
  ];
  return (
    <footer className="bg-primary-950 text-white border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* COL 1: BRAND */}
          <div>
            <h3 className="text-2xl font-serif text-white mb-6 tracking-wide">
              TCN <span className="text-accent-500 italic">Real Estate</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t("brandDescription")}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Added flex/items-center/justify-center to center the icon
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent-500 hover:text-white text-white/70 transition-all duration-300 cursor-pointer"
                  aria-label={social.name}
                >
                  <svg
                    fill="currentColor"
                    viewBox={social.viewBox || "0 0 24 24"} // Defaults to 24x24 if not specified
                    className="w-4 h-4" // Icon size
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* COL 2: QUICK LINKS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent-500 mb-6">
              {/* 🟢 TRANSLATED: "Discover" */}
              {t("colDiscover")}
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link
                  href={`/${locale}/search?status=available`}
                  className="hover:text-white transition-colors"
                >
                  {/* 🟢 TRANSLATED: "Buy" */}
                  {tNav("buy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/search?type=off-plan`}
                  className="hover:text-white transition-colors"
                >
                  {/* 🟢 TRANSLATED: "Off-Plan" */}
                  {tNav("offPlan")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/sell`}
                  className="hover:text-white transition-colors"
                >
                  {/* 🟢 TRANSLATED: "Sell" */}
                  {tNav("sell")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="hover:text-white transition-colors"
                >
                  {/* 🟢 TRANSLATED: "Our Story" */}
                  {tNav("about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 3: CONTACT */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent-500 mb-6">
              {/* 🟢 TRANSLATED: "Contact" */}
              {t("colContact")}
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-accent-500 shrink-0" />
                <span>
                  123 Boulevard d&apos;Anfa,
                  <br />
                  Tangier, Morocco
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-accent-500 shrink-0" />
                <span>+212 6 00 00 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="h-5 w-5 text-accent-500 shrink-0" />
                <span>private@tcn-realestate.ma</span>
              </li>
            </ul>
          </div>

          {/* COL 4: NEWSLETTER */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent-500 mb-6">
              {t("colNewsletter")}
            </h4>
            <p className="text-gray-400 text-xs mb-4">{t("newsletterText")}</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-500 transition-colors"
              />
              <button className="bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-colors">
                {t("subscribe")}
              </button>
            </form>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-white/10 mb-8"></div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          {/* LEFT SIDE: Copyright + Legal Links */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p>
              © {currentYear} TCN Real Estate. {t("copyright")}
            </p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">
                {t("privacy")}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {t("terms")}
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Developer Signature */}
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="opacity-40">{t("developedBy")}</span>
            <a
              href="https://ataed.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gray-400 hover:text-accent-500 transition-colors uppercase tracking-widest"
            >
              ATAED
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
