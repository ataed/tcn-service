"use client";
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

function LocationController({ onLocationSelect, selectedLocation }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });

  useEffect(() => {
    if (selectedLocation?.lat && selectedLocation?.lng) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 16);
    }
  }, [selectedLocation, map]);

  return selectedLocation ? (
    <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
  ) : null;
}

export default function MapPicker({ onLocationSelect, selectedLocation }) {
  const defaultCenter = [35.7595, -5.834];

  return (
    // The "key" prop forces a clean remount if coordinates change drastically,
    // helping avoid Leaflet instance collisions in React 19 Strict Mode.
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={
          selectedLocation
            ? [selectedLocation.lat, selectedLocation.lng]
            : defaultCenter
        }
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationController
          onLocationSelect={onLocationSelect}
          selectedLocation={selectedLocation}
        />
      </MapContainer>
    </div>
  );
}
