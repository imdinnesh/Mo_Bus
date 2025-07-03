// components/nearby-buses-map.tsx
"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import React, { useEffect } from "react"
import { NearbyBus } from "@/hooks/use-nearby-buses"

// --- Icons ---
const busIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxNDE0MWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNiA2VjRhMiAyIDAgMCAxIDItMmg0djZoNGEyIDIgMCAwIDAgMi0yVjZIMTB6Ii8+PHBhdGggZD0iTTIgMTRhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjhhMiAyIDAgMCAwLTItMkg0YTIgMiAwIDAgMC0yIDJ6Ii8+PGxpbmUgeDE9IjYiIHgyPSI2IiB5MT0iMTgiIHkyPSIxOCIvPjxsaW5lIHgxPSIxOCIgeDI9IjE4IiB5MT0iMTgiIHkyPSIxOCIvPjwvc3ZnPg==",
  iconSize: [30, 30],
});

const activeBusIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRkE1RjE5IiBzdHJva2U9IiMxNDE0MWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNiA2VjRhMiAyIDAgMCAxIDItMmg0djZoNGEyIDIgMCAwIDAgMi0yVjZIMTB6Ii8+PHBhdGggZD0iTTIgMTRhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjhhMiAyIDAgMCAwLTItMkg0YTIgMiAwIDAgMC0yIDJ6Ii8+PGxpbmUgeDE9IjYiIHgyPSI2IiB5MT0iMTgiIHkyPSIxOCIvPjxsaW5lIHgxPSIxOCIgeDI9IjE4IiB5MT0iMTgiIHkyPSIxOCIvPjwvc3ZnPg==",
  iconSize: [40, 40], // Make it larger to stand out
});

const userIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMDU5NkU2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0Ii8+PC9zdmc+",
  iconSize: [25, 25],
});

// Helper component to auto-fit the map bounds
function AutoFitBounds({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function NearbyBusesMap({
  buses,
  userLocation,
  activeBusId,
}: {
  buses: NearbyBus[];
  userLocation: { latitude: number; longitude: number };
  activeBusId: string | null;
}) {
  const allPoints = [
    new L.LatLng(userLocation.latitude, userLocation.longitude),
    ...buses.map(bus => new L.LatLng(bus.latitude, bus.longitude)),
  ];
  const bounds = new L.LatLngBounds(allPoints);

  return (
    <MapContainer
      center={[userLocation.latitude, userLocation.longitude]}
      zoom={14}
      scrollWheelZoom={true}
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      {/* User's Location Marker */}
      <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Nearby Buses Markers */}
      {buses.map(bus => (
        <Marker
          key={bus.busId}
          position={[bus.latitude, bus.longitude]}
          icon={bus.busId === activeBusId ? activeBusIcon : busIcon}
        >
          <Popup>
            Bus: {bus.busId} <br />
            Route: {bus.routeId} <br />
            Distance: {bus.distance.toFixed(2)} km
          </Popup>
        </Marker>
      ))}
      
      <AutoFitBounds bounds={bounds} />
    </MapContainer>
  );
}