// app/nearby-buses/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useUserLocation } from "@/hooks/use-user-location";
import { useNearbyBuses } from "@/hooks/use-nearby-buses";
import { BusInfoCard } from "@/components/bus-info-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapContainer, TileLayer } from "react-leaflet";
import { Loader2, List, MapPin, ShieldOff } from "lucide-react";

// Dynamically import map component for client-side rendering only
const DynamicInteractiveMap = dynamic(
  () => import("@/components/interactive-nearby-map"),
  { ssr: false, loading: () => <Skeleton className="h-full w-full rounded-lg" /> }
);

type Coords = { latitude: number; longitude: number };
const SEARCH_RADIUS_METERS = 5000;

export default function NearbyBusesPage() {
  const { coords: userLocation, isLoading: isLocationLoading, error: locationError, permissionState } = useUserLocation();
  const [queryCoords, setQueryCoords] = useState<Coords | null>(null);
  const [searchCenter, setSearchCenter] = useState<Coords | null>(null);
  
  const [hoveredBusId, setHoveredBusId] = useState<string | null>(null);
  const [clickedBusCoords, setClickedBusCoords] = useState<Coords | null>(null);

  const { data: buses, isLoading: isBusesLoading } = useNearbyBuses(queryCoords?.latitude, queryCoords?.longitude);

  useEffect(() => {
    if (userLocation && !searchCenter) {
      setSearchCenter(userLocation);
      setQueryCoords(userLocation);
    }
  }, [userLocation, searchCenter]);

  const handleSearchConfirm = () => {
    if (searchCenter) {
      setQueryCoords(searchCenter);
      setClickedBusCoords(null);
    }
  };

  if (isLocationLoading || !searchCenter) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Finding your location...</p>
      </div>
    );
  }

  if (permissionState === 'denied' || locationError) {
    return (
      <div className="container mx-auto p-8 max-w-2xl">
         <Alert variant="destructive"><ShieldOff className="h-4 w-4" /><AlertTitle>Location Access Denied</AlertTitle><AlertDescription>Please enable location permissions for this site in your browser settings and refresh the page.</AlertDescription></Alert>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <MapPin className="h-9 w-9 text-primary" />
          Explore Nearby Buses
        </h1>
        <p className="text-muted-foreground">Drag the pin, search an area, and interact with the results.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[65vh]">
        <div className="lg:col-span-1 h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <List className="h-5 w-5" /> 
            {isBusesLoading ? "Searching..." : `Found ${buses?.length || 0} Buses`}
          </h2>
          <div className="flex-grow rounded-lg border">
            <ScrollArea className="h-[550px] rounded-lg">
              <div className="p-2 space-y-2">
                {isBusesLoading && [...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
                {buses && buses.length === 0 && !isBusesLoading && (
                  <div className="p-4 text-center text-muted-foreground">No buses found in this area.</div>
                )}
                {buses?.sort((a, b) => a.distance - b.distance).map(bus => (
                  <BusInfoCard
                    key={bus.busId}
                    bus={bus}
                    isActive={bus.busId === hoveredBusId}
                    onMouseEnter={() => setHoveredBusId(bus.busId)}
                    onMouseLeave={() => setHoveredBusId(null)}
                    onClick={() => setClickedBusCoords({ latitude: bus.latitude, longitude: bus.longitude })}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <div className="lg:col-span-2 h-full rounded-lg overflow-hidden border">
          <MapContainer center={[searchCenter.latitude, searchCenter.longitude]} zoom={13} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='© CARTO' />
            {userLocation && (
              <DynamicInteractiveMap
                userLocation={userLocation}
                searchCenter={searchCenter}
                onSearchCenterChange={setSearchCenter}
                onSearchConfirm={handleSearchConfirm}
                buses={buses || []}
                radiusInMeters={SEARCH_RADIUS_METERS}
                isSearching={isBusesLoading}
                hoveredBusId={hoveredBusId}
                clickedBusCoords={clickedBusCoords}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </main>
  );
}