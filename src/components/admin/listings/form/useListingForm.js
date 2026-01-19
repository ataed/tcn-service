"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { AMENITIES } from "@/lib/schema/definitions";

export function useListingForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // --- MAP STATE ---
  const [coords, setCoords] = useState(null);
  const [mapUrl, setMapUrl] = useState("");

  // --- 🟢 NEW: FILE STATE (Accumulators) ---
  const [galleryItems, setGalleryItems] = useState([]); // [{ file, preview, id }]
  const [pdfItems, setPdfItems] = useState([]); // [{ file, name, id }]

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

  // --- SUBMIT LOGIC ---
  const handleFormSubmit = async (e, { selectedType, isOffPlan }) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Uploading assets...");

    try {
      const formData = new FormData(e.currentTarget);

      const uploadFile = async (file, bucket, folder) => {
        if (!file || !file.name) return null;
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const fileName = `${Date.now()}-${cleanName}`;
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(`${folder}/${fileName}`, file);
        if (error) throw error;
        return data.path;
      };

      // 1. Upload Main Image (Still from Form directly)
      const mainImg = await uploadFile(
        formData.get("main_image"),
        "property-images",
        "main",
      );

      // 🟢 2. Upload Gallery (From STATE, not FormData)
      const galleryUrls = await Promise.all(
        galleryItems.map((item) =>
          uploadFile(item.file, "property-images", "gallery"),
        ),
      );

      // 🟢 3. Upload PDFs (From STATE, not FormData)
      const pdfUrls = await Promise.all(
        pdfItems.map((item) =>
          uploadFile(item.file, "technical-plans", "uploads"),
        ),
      );

      // 4. Amenities
      const amenitiesData = {};
      AMENITIES.forEach((a) => {
        if (formData.get(a.id) === "on") amenitiesData[a.id] = true;
      });

      // 5. Insert
      const { error } = await supabase.from("listings").insert({
        type: selectedType,
        price: formData.get("price"),
        sqft: formData.get("sqft"),
        status: "pending",

        // Content
        title_en: formData.get("title_en"),
        title_fr: formData.get("title_fr"),
        title_es: formData.get("title_es"),
        title_ar: formData.get("title_ar"),
        desc_en: formData.get("desc_en"),
        desc_fr: formData.get("desc_fr"),
        desc_es: formData.get("desc_es"),
        desc_ar: formData.get("desc_ar"),

        // Location
        city_en: formData.get("city_en"),
        district_en: formData.get("district_en"),
        address: formData.get("address"),
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,

        // Media
        main_image_url: mainImg,
        gallery_urls: galleryUrls.filter((u) => u),
        technical_plans: pdfUrls.filter((u) => u),

        attributes: {
          bedrooms: ["villa", "apartment", "penthouse"].includes(selectedType)
            ? formData.get("bedrooms")
            : null,
          bathrooms: ["villa", "apartment", "penthouse"].includes(selectedType)
            ? formData.get("bathrooms")
            : null,
          delivery_date: isOffPlan ? formData.get("delivery_date") : null,
          amenities: amenitiesData,
        },
        is_featured: false,
        is_off_plan: isOffPlan,
      });

      if (error) throw error;
      toast.success("Created!", { id: toastId });
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
