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
  published: {
    color: "bg-green-100 text-green-700 border-green-200",
    label: { en: "Published", ar: "منشور", fr: "Publié", es: "Publicado" },
  },
  pending: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    label: {
      en: "Pending",
      ar: "قيد الانتظار",
      fr: "En attente",
      es: "Pendiente",
    },
  },
  sold: {
    color: "bg-red-100 text-red-700 border-red-200",
    label: { en: "Sold", ar: "تم البيع", fr: "Vendu", es: "Vendido" },
  },
  rented: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    label: { en: "Rented", ar: "مؤجر", fr: "Loué", es: "Alquilado" },
  },
  off_plan: {
    color: "bg-purple-100 text-purple-700 border-purple-200",
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
