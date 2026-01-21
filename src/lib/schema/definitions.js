import {
  HomeIcon,
  BuildingOfficeIcon,
  MapIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  KeyIcon,
  TruckIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

// Full list of property types for all filters and dropdowns
export const PROPERTY_TYPES = [
  // --- RESIDENTIAL ---
  {
    id: "villa",
    slug: "villas",
    label: { en: "Villa", ar: "فيلا", fr: "Villa", es: "Villa" },
    icon: HomeIcon,
  },
  {
    id: "apartment",
    slug: "apartments",
    label: { en: "Apartment", ar: "شقة", fr: "Appartement", es: "Apartamento" },
    icon: BuildingOfficeIcon,
  },
  {
    id: "riad",
    slug: "riads",
    label: { en: "Riad", ar: "رياض", fr: "Riad", es: "Riad" }, // Essential for local market
    icon: BuildingStorefrontIcon,
  },
  {
    id: "penthouse",
    slug: "penthouses",
    label: { en: "Penthouse", ar: "بنتهاوس", fr: "Penthouse", es: "Ático" },
    icon: KeyIcon,
  },
  {
    id: "duplex",
    slug: "duplexes",
    label: { en: "Duplex", ar: "دوبلكس", fr: "Duplex", es: "Dúplex" },
    icon: HomeIcon,
  },
  {
    id: "chalet",
    slug: "chalets",
    label: { en: "Chalet", ar: "شاليه", fr: "Chalet", es: "Chalet" },
    icon: SunIcon,
  },
  {
    id: "studio",
    slug: "studios",
    label: { en: "Studio", ar: "ستوديو", fr: "Studio", es: "Estudio" },
    icon: BuildingOfficeIcon,
  },

  // --- LAND ---
  {
    id: "land_residential",
    slug: "residential-land",
    label: {
      en: "Residential Land",
      ar: "أرض سكنية",
      fr: "Terrain Résidentiel",
      es: "Terreno Residencial",
    },
    icon: MapIcon,
  },
  {
    id: "land_agricultural",
    slug: "farms",
    label: {
      en: "Farm / Agricultural",
      ar: "ضيعة فلاحية",
      fr: "Ferme / Agricole",
      es: "Finca Rústica",
    },
    icon: SunIcon,
  },
  {
    id: "land_industrial",
    slug: "industrial-land",
    label: {
      en: "Industrial Land",
      ar: "أرض صناعية",
      fr: "Terrain Industriel",
      es: "Terreno Industrial",
    },
    icon: MapIcon,
  },

  // --- COMMERCIAL ---
  {
    id: "office",
    slug: "offices",
    label: { en: "Office", ar: "مكتب", fr: "Bureau", es: "Oficina" },
    icon: BriefcaseIcon,
  },
  {
    id: "retail",
    slug: "retail",
    label: {
      en: "Shop / Retail",
      ar: "محل تجاري",
      fr: "Magasin",
      es: "Local Comercial",
    },
    icon: BuildingStorefrontIcon,
  },
  {
    id: "industrial",
    slug: "warehouses",
    label: {
      en: "Warehouse / Factory",
      ar: "مستودع / مصنع",
      fr: "Entrepôt / Usine",
      es: "Nave Industrial",
    },
    icon: TruckIcon,
  },
];

// Expanded amenities list to cover land, office, and residential
export const AMENITIES = [
  {
    id: "has_pool",
    label: { en: "Swimming Pool", ar: "مسبح", fr: "Piscine", es: "Piscina" },
  },
  {
    id: "has_garden",
    label: { en: "Garden", ar: "حديقة", fr: "Jardin", es: "Jardín" },
  },
  {
    id: "has_parking",
    label: {
      en: "Parking",
      ar: "موقف سيارات",
      fr: "Parking",
      es: "Aparcamiento",
    },
  },
  {
    id: "has_elevator",
    label: { en: "Elevator", ar: "مصعد", fr: "Ascenseur", es: "Ascensor" },
  },
  {
    id: "is_furnished",
    label: { en: "Furnished", ar: "مفروش", fr: "Meublé", es: "Amueblado" },
  },
  {
    id: "has_security",
    label: {
      en: "24/7 Security",
      ar: "أمن 24/7",
      fr: "Sécurité 24/7",
      es: "Seguridad 24/7",
    },
  },
  {
    id: "has_aircon",
    label: {
      en: "Air Conditioning",
      ar: "تكييف",
      fr: "Climatisation",
      es: "Aire Acondicionado",
    },
  },
  {
    id: "has_heating",
    label: {
      en: "Central Heating",
      ar: "تدفئة مركزية",
      fr: "Chauffage Central",
      es: "Calefacción",
    },
  },
  {
    id: "has_balcony",
    label: {
      en: "Balcony/Terrace",
      ar: "شرفة",
      fr: "Balcon/Terrasse",
      es: "Balcón/Terraza",
    },
  },
  {
    id: "has_sea_view",
    label: {
      en: "Sea View",
      ar: "إطلالة على البحر",
      fr: "Vue sur Mer",
      es: "Vistas al Mar",
    },
  },
];

// Status badge styling and labels
export const STATUS_STYLES = {
  available: {
    color:
      "bg-green-500/10 text-green-600 border border-green-200 dark:text-green-400 dark:border-green-500/20",
    label: { en: "Published", ar: "منشور", fr: "Publié", es: "Publicado" },
  },
  pending: {
    color:
      "bg-yellow-500/10 text-yellow-700 border border-yellow-200 dark:text-yellow-500 dark:border-yellow-500/20",
    label: {
      en: "Pending",
      ar: "قيد الانتظار",
      fr: "En attente",
      es: "Pendiente",
    },
  },
  sold: {
    color:
      "bg-red-500/10 text-red-600 border border-red-200 dark:text-red-400 dark:border-red-500/20",
    label: { en: "Sold", ar: "تم البيع", fr: "Vendu", es: "Vendido" },
  },
  rented: {
    color:
      "bg-blue-500/10 text-blue-600 border border-blue-200 dark:text-blue-400 dark:border-blue-500/20",
    label: { en: "Rented", ar: "مؤجر", fr: "Loué", es: "Alquilado" },
  },
  off_plan: {
    color:
      "bg-purple-100 text-purple-900 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    label: {
      en: "Off-Plan / VEFA",
      ar: "بيع على التصميم",
      fr: "Sur Plan / VEFA",
      es: "Sobre Plano",
    },
  },
};

// Safe getter for translated labels
export function getLabel(item, lang = "en") {
  return item?.label?.[lang] || item?.label?.["en"] || "Unknown";
}

export const LANGUAGE_CONFIG = {
  en: {
    id: "en",
    label: "English",

    bg: "bg-blue-500/5 dark:bg-blue-500/10",
    border: "border-blue-500/20 dark:border-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
    badge:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    rtl: false,
    placeholderTitle: "e.g. Modern Luxury Villa with Sea View",
    placeholderDesc:
      "Enter a detailed description of the property features, location, and amenities...",
    placeholderCity: "e.g. Tangier",
    placeholderDistrict: "e.g. Malabata",
  },
  fr: {
    id: "fr",
    label: "French",
    bg: "bg-indigo-500/5 dark:bg-indigo-500/10",
    border: "border-indigo-500/20 dark:border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400",
    badge:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800",
    rtl: false,
    placeholderTitle: "ex. Villa de Luxe Moderne avec Vue Mer",
    placeholderDesc:
      "Entrez une description détaillée des caractéristiques, de l'emplacement et des équipements...",
    placeholderCity: "ex. Tanger",
    placeholderDistrict: "ex. Malabata",
  },
  es: {
    id: "es",
    label: "Spanish",
    bg: "bg-yellow-500/5 dark:bg-yellow-500/10",
    border: "border-yellow-500/20 dark:border-yellow-500/30",
    text: "text-yellow-700 dark:text-yellow-400",
    badge:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800",
    rtl: false,
    placeholderTitle: "ej. Villa de Lujo Moderna con Vistas al Mar",
    placeholderDesc:
      "Introduzca una descripción detallada de las características, ubicación y servicios...",
    placeholderCity: "ej. Tánger",
    placeholderDistrict: "ej. Malabata",
  },
  ar: {
    id: "ar",
    label: "Arabic",
    bg: "bg-green-500/5 dark:bg-green-500/10",
    border: "border-green-500/20 dark:border-green-500/30",
    text: "text-green-600 dark:text-green-400",
    badge:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800",
    rtl: true,
    placeholderTitle: "مثال: فيلا فاخرة حديثة مع إطلالة على البحر",
    placeholderDesc:
      "أدخل وصفاً مفصلاً لمميزات العقار والموقع ووسائل الراحة...",
    placeholderCity: "مثال: طنجة",
    placeholderDistrict: "مثال: حي ملابطا",
  },
};
