import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Josefin_Sans, Almarai } from "next/font/google";

import { routing } from "@/i18n/routing";

import ClientHeaderWrapper from "@/components/public/ClientHeaderWrapper";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import "@/app/globals.css";

// --- FONTS ---
const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-josefin",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

// --- 🟢 DYNAMIC METADATA GENERATOR ---
export async function generateMetadata({ params }) {
  const { locale } = await params;

  // Dictionary for SEO Titles & Descriptions
  const seo = {
    en: {
      title: "TCN Real Estate | Luxury Properties & Investment in Morocco",
      desc: "The leading authority in Moroccan luxury real estate. Exclusive villas, penthouses, and off-plan investment opportunities.",
    },
    fr: {
      title:
        "TCN Real Estate | Immobilier de Prestige & Investissement au Maroc",
      desc: "L'autorité en matière d'immobilier de luxe au Maroc. Villas exclusives, penthouses et opportunités d'investissement sur plan.",
    },
    es: {
      title: "TCN Real Estate | Inmobiliaria de Lujo e Inversión en Marruecos",
      desc: "La autoridad líder en inmobiliaria de lujo en Marruecos. Villas exclusivas, áticos y oportunidades de inversión sobre plano.",
    },
    ar: {
      title: " العقارية | عقارات فاخرة واستثمار في المغرب TCN",
      desc: "المرجع الرائد في العقارات الفاخرة بالمغرب. فيلات حصرية، شقق بنتهاوس، وفرص استثمارية واعدة.",
    },
  };

  const currentSEO = seo[locale] || seo.en;

  return {
    title: currentSEO.title,
    description: currentSEO.desc,
    // 🟢 TELLS GOOGLE: "We handle the translation, don't interfere."
    other: {
      google: "notranslate",
    },
    openGraph: {
      title: currentSEO.title,
      description: currentSEO.desc,
      type: "website",
      locale: locale,
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  // Await params in Next.js 15+
  const { locale } = await params;

  // 1. Security Check: Validate locale
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // 2. Load Translations
  const messages = await getMessages();

  // 3. Determine Direction (RTL for Arabic, LTR for others)
  const direction = locale === "ar" ? "rtl" : "ltr";

  // 4. Select Font based on Language
  const fontClassName = locale === "ar" ? almarai.className : josefin.className;

  return (
    // 🟢 translate="no" stops the browser pop-up
    <html lang={locale} dir={direction} translate="no">
      <body
        className={`${fontClassName} antialiased relative bg-primary-950 text-primary-100 min-h-screen flex flex-col selection:bg-accent-500 selection:text-white`}
      >
        <NextIntlClientProvider messages={messages}>
          {/* Header Wrapper handles scroll transparency */}
          <ClientHeaderWrapper>
            <Header locale={locale} />
          </ClientHeaderWrapper>

          <main className="flex-grow flex flex-col">{children}</main>

          {/* Footer */}
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
