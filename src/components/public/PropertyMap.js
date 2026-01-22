"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon issue
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function PropertyMap({ lat, lng }) {
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={[lat, lng]}
        zoom={16} // 🟢 Slightly closer zoom for better house detail
        scrollWheelZoom={false}
        className="h-full w-full transition-all duration-700"
        style={{ height: "100%", width: "100%", background: "#0a0a0a" }}
      >
        {/* 🟢 High-Quality Satellite Imagery (Esri World Imagery) */}
        <TileLayer
          attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* 🟢 Optional: Road Labels Overlay (Helps users identify streets on top of satellite) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={[lat, lng]} icon={icon}>
          <Popup className="font-sans">
            <span className="font-bold text-primary-950">
              Property Location
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
