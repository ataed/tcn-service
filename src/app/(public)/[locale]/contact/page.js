import { getTranslations } from "next-intl/server";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import ContactForm from "@/components/public/ContactForm";
import PropertyMapLoader from "@/components/public/PropertyMapLoader";

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  // 🟢 Load "Property" namespace to reuse the "Open in Google Maps" label
  const tProp = await getTranslations({ locale, namespace: "Property" });

  // 🟢 OFFICE COORDINATES
  const officeCoords = { lat: 33.5731, lng: -7.5898 };

  return (
    <div className="bg-primary-950 min-h-screen pt-32 pb-20">
      {/* 1. HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <span className="text-accent-500 font-bold tracking-[0.2em] text-xs uppercase mb-4 block animate-fade-in">
          {t("subtitle")}
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 animate-fade-in-up">
          {t("title")}
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto font-light text-lg leading-relaxed animate-fade-in-up delay-100">
          {t("description")}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* 2. LEFT COLUMN: CONTACT INFO & MAP */}
          <div className="space-y-12 animate-fade-in-left">
            {/* Info Cards */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="p-3 bg-accent-500/20 rounded-lg text-accent-500">
                  <MapPinIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-serif text-lg mb-1">
                    {t("info.visit")}
                  </h3>
                  <p className="text-white/50 text-sm font-light">
                    {t("info.address")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href="tel:+212522000000"
                  className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 bg-accent-500/20 rounded-lg text-accent-500 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                    <PhoneIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-serif text-lg mb-1">
                      {t("info.call")}
                    </h3>
                    <p className="text-white/50 text-sm font-light">
                      +212 522 00 00 00
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:contact@tcn.ma"
                  className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 bg-accent-500/20 rounded-lg text-accent-500 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                    <EnvelopeIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-serif text-lg mb-1">
                      {t("info.email")}
                    </h3>
                    <p className="text-white/50 text-sm font-light">
                      contact@tcn.ma
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* 🟢 OFFICE MAP WITH BUTTON OVERLAY */}
            <div className="relative h-[300px] w-full rounded-2xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 group shadow-2xl">
              <PropertyMapLoader
                lat={officeCoords.lat}
                lng={officeCoords.lng}
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${officeCoords.lat},${officeCoords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-[400] bg-white text-primary-950 px-5 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-accent-500 hover:text-white transition-all shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-500"
              >
                {tProp("openMaps")}{" "}
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: THE FORM */}
          <div className="bg-primary-900/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl animate-fade-in-right">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
