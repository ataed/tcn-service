"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { AMENITIES, LANGUAGE_CONFIG } from "@/lib/schema/definitions";

export function useListingForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [coords, setCoords] = useState(null);
  const [mapUrl, setMapUrl] = useState("");
  const [galleryItems, setGalleryItems] = useState([]);
  const [pdfItems, setPdfItems] = useState([]);

  // --- HANDLERS ---
  const handleMapPaste = (e) => {
    /* ... (Keep your existing map logic here) ... */
    const input = e.target.value;
    setMapUrl(input);
    let match =
      input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
      input.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
      input.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);

    if (match) {
      setCoords({ lat: parseFloat(match[1]), lng: parseFloat(match[2]) });
      toast.success("Location pinned!");
    }
  };

  // 🟢 1. Handle Gallery Add (Accumulate)
  const handleAddGallery = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newItems = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9), // Unique ID for React keys
    }));

    setGalleryItems((prev) => [...prev, ...newItems]);
    e.target.value = ""; // Reset input so you can add same file again if needed
  };

  // 🟢 2. Handle Gallery Remove
  const handleRemoveGallery = (id) => {
    setGalleryItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      // Optional: Revoke URL to avoid memory leaks
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove) URL.revokeObjectURL(itemToRemove.preview);
      return filtered;
    });
  };

  // 🟢 3. Handle PDF Add
  const handleAddPdf = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newItems = files.map((file) => ({
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      id: Math.random().toString(36).substr(2, 9),
    }));

    setPdfItems((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  // 🟢 4. Handle PDF Remove
  const handleRemovePdf = (id) => {
    setPdfItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFormSubmit = async (e, { selectedType, isOffPlan }) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Publishing asset to inventory...");

    try {
      const formData = new FormData(e.currentTarget);

      // 🟢 Helper for Storage
      const uploadFile = async (file, bucket, folder) => {
        if (!file || !file.name) return null;
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(`${folder}/${fileName}`, file);
        if (error) throw error;
        return data.path;
      };

      // 1. Assets Upload
      const [mainImg, galleryUrls, pdfUrls] = await Promise.all([
        uploadFile(formData.get("main_image"), "property-images", "main"),
        Promise.all(
          galleryItems.map((item) =>
            uploadFile(item.file, "property-images", "gallery"),
          ),
        ),
        Promise.all(
          pdfItems.map((item) =>
            uploadFile(item.file, "technical-plans", "uploads"),
          ),
        ),
      ]);

      // 2. Multilingual Amenities logic
      const amenitiesData = {};
      AMENITIES.forEach((a) => {
        if (formData.get(a.id) === "on") amenitiesData[a.id] = true;
      });

      // 3. 🟢 THE SYNCED PAYLOAD (Matches Edit Form & V2 Schema)
      const insertData = {
        type: selectedType,
        status: "pending",
        is_off_plan: isOffPlan,
        price: parseFloat(formData.get("price")),
        sqft: parseFloat(formData.get("sqft")),
        //FOR PUBLIC FILTER(EASY ACCESS)
        bedrooms: parseInt(formData.get("bedrooms")) || 0,
        bathrooms: parseInt(formData.get("bathrooms")) || 0,
        // Multilingual Copy (Title & Desc)
        title_en: formData.get("title_en"),
        title_fr: formData.get("title_fr"),
        title_es: formData.get("title_es"),
        title_ar: formData.get("title_ar"),
        desc_en: formData.get("desc_en"),
        desc_fr: formData.get("desc_fr"),
        desc_es: formData.get("desc_es"),
        desc_ar: formData.get("desc_ar"),

        // 🟢 Multilingual Location (All 8 Fields from Schema)
        city_en: formData.get("city_en"),
        city_fr: formData.get("city_fr"),
        city_es: formData.get("city_es"),
        city_ar: formData.get("city_ar"),
        district_en: formData.get("district_en"),
        district_fr: formData.get("district_fr"),
        district_es: formData.get("district_es"),
        district_ar: formData.get("district_ar"),

        // Mapping GPS & Shared Address
        address: formData.get("address"),
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
        map_address: mapUrl || null,
        // Media Paths
        main_image_url: mainImg,
        gallery_urls: galleryUrls.filter(Boolean),
        technical_plans: pdfUrls.filter(Boolean),

        // 🟢 Attributes JSONB
        attributes: {
          bedrooms: parseInt(formData.get("bedrooms")) || 0,
          bathrooms: parseInt(formData.get("bathrooms")) || 0,
          delivery_date: isOffPlan ? formData.get("delivery_date") : null,
          zoning_type: formData.get("zoning_type") || null,
          amenities: amenitiesData,
        },
      };

      const { error } = await supabase.from("listings").insert([insertData]);

      if (error) throw error;
      toast.success("Asset registered successfully", { id: toastId });
      router.push("/admin/listings");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message, { id: toastId });
      setLoading(false);
    }
  };

  return {
    loading,
    coords,
    setCoords,
    mapUrl,
    setMapUrl,
    handleMapPaste,
    handleFormSubmit,
    galleryItems,
    handleAddGallery,
    handleRemoveGallery,
    pdfItems,
    handleAddPdf,
    handleRemovePdf,
  };
}
