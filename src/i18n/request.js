import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  const locales = ["en", "fr", "ar", "es"];

  if (!locale || !locales.includes(locale)) {
    locale = "en";
  }

  // 2. The Static Map
  const messageImports = {
    en: () => import("../messages/en.json"),
    fr: () => import("../messages/fr.json"),
    ar: () => import("../messages/ar.json"),

    es: () => import("../messages/es.json"),
  };

  return {
    locale,
    messages: (await messageImports[locale]()).default,
  };
});
