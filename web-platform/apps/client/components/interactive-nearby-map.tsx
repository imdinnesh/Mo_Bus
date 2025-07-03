// components/interactive-nearby-map.tsx
"use client";

import { Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import React, { useEffect } from "react";
import { Move, LocateFixed, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { NearbyBus } from "@/hooks/use-nearby-buses";

type Coords = { latitude: number; longitude: number };

const busIcon = new L.Icon({ iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxNDE0MWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNiA2VjRhMiAyIDAgMCAxIDItMmg0djZoNGEyIDIgMCAwIDAgMi0yVjZIMTB6Ii8+PHBhdGggZD0iTTIgMTRhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjhhMiAyIDAgMCAwLTItMkg0YTIgMiAwIDAgMC0yIDJ6Ii8+PGxpbmUgeDE9IjYiIHgyPSI2IiB5MT0iMTgiIHkyPSIxOCIvPjxsaW5lIHgxPSIxOCIgeDI9IjE4IiB5MT0iMTgiIHkyPSIxOCIvPjwvc3ZnPg==", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
const searchCenterIcon = new L.Icon({ iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlYTU4MDciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjUiIHkyPSIxOSIvPjxsaW5lIHgxPSI1IiB4Mj0iMTkiIHkxPSIxMiIgeTI9IjEyIi8+PC9zdmc+", iconSize: [35, 35] });
const hoveredBusIcon = new L.Icon({ iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMGI5YjcyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTggNmMwLTEuMS45LTIgMi0ySDh2NGgxMGExIDEgMCAwIDAgMS0xVjZIMTB6Ii8+PHBhdGggZD0iTTIgMTRhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjgtNUExIDIgMCAwIDAgMjAgN0gxN2ExIDIgMCAwIDEgMC00aDR2MTFhMiAyIDAgMCAxLTIgMmgtMWEyIDIgMCAwIDEtMi0yVjZINmEyIDIgMCAwIDAtMiAydjhhMiAyIDAgMCAwIDIgMnoiLz48cGF0aCBkPSJNNiA2VjRhMiAyIDAgMCAwLTIgMiIvPjxjaXJjbGUgY3g9IjciIGN5PSIxOCIgcj0iMiIvPjxjaXJjbGUgY3g9IjE3IiBjeT0iMTgiIHI9IjIiLz48L3N2Zz4=", iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40] });

function FlyToMarker({ coords }: { coords: Coords | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.latitude, coords.longitude], 16, { animate: true, duration: 1 });
    }
  }, [coords, map]);
  return null;
}

export default function InteractiveNearbyMap({
  userLocation, searchCenter, onSearchCenterChange, onSearchConfirm, buses, radiusInMeters, isSearching, hoveredBusId, clickedBusCoords,
}: {
  userLocation: Coords; searchCenter: Coords; onSearchCenterChange: (newCenter: Coords) => void; onSearchConfirm: () => void;
  buses: NearbyBus[]; radiusInMeters: number; isSearching: boolean; hoveredBusId: string | null; clickedBusCoords: Coords | null;
}) {
  const map = useMap();
  const handleResetLocation = () => { onSearchCenterChange(userLocation); map.flyTo([userLocation.latitude, userLocation.longitude], 14); };

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <Button size="lg" onClick={onSearchConfirm} className="shadow-lg" disabled={isSearching}>
          {isSearching ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Move className="mr-2 h-5 w-5" />}
          Search This Area
        </Button>
        <Button size="icon" variant="secondary" onClick={handleResetLocation} className="shadow-lg" title="Reset to my location">
          <LocateFixed className="h-5 w-5" />
        </Button>
      </div>

      <Marker position={[searchCenter.latitude, searchCenter.longitude]} icon={searchCenterIcon} draggable={true}
        eventHandlers={{ dragend: (e) => onSearchCenterChange({ latitude: e.target.getLatLng().lat, longitude: e.target.getLatLng().lng }) }}
      />
      <Circle center={[searchCenter.latitude, searchCenter.longitude]} radius={radiusInMeters} pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.1 }} />

      {buses.map((bus) => (
        <Marker key={bus.busId} position={[bus.latitude, bus.longitude]} icon={bus.busId === hoveredBusId ? hoveredBusIcon : busIcon} zIndexOffset={bus.busId === hoveredBusId ? 1000 : 0}>
          <Popup>Bus: {bus.busId} <br /> Route: {bus.routeId}</Popup>
        </Marker>
      ))}
      <FlyToMarker coords={clickedBusCoords} />
    </div>
  );
}