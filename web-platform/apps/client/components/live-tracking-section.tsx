// components/live-tracking-section.tsx

"use client"

import { useState } from "react"
import { useBusDetails } from "@/hooks/useBusDetails"
import DynamicBusMap from "./dynamic-bus-map"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Map, Bus, AlertTriangle, WifiOff, LoaderCircle } from "lucide-react"

// Define the Bus type again for this component's props
interface Bus {
  id: number,
  bus_number: string;
  license_plate: string;
}

// --- Skeleton Component for Loading State ---
function TrackingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

// --- Main Live Tracking Component ---
export function LiveTrackingSection({ routeId }: { routeId: string }) {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const { data: busData, isLoading, error } = useBusDetails(routeId)

  if (isLoading) {
    return <TrackingSkeleton />
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <WifiOff className="h-5 w-5" />
            Tracking Unavailable
          </CardTitle>
          <CardDescription className="text-destructive">
            Could not fetch live bus data. Please check your connection or try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!busData || busData.buses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            No Active Buses
          </CardTitle>
          <CardDescription>
            There are currently no active buses being tracked on this route.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Map className="h-6 w-6 text-primary" />
          Live Bus Tracking
        </CardTitle>
        <CardDescription>
          Select a bus from the list below to see its real-time location on the map.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6">
          {busData.buses.map((bus) => (
            <Button
              key={bus.id}
              variant={selectedBus?.id === bus.id ? "default" : "outline"}
              onClick={() => setSelectedBus(bus)}
              className="flex items-center gap-2"
            >
              <Bus className="h-4 w-4" />
              {bus.bus_number}
            </Button>
          ))}
        </div>
        
        {/* The map is only rendered when a bus is selected */}
        {selectedBus && (
          <div className="mt-4 rounded-lg overflow-hidden border">
            {/* The key ensures the map component re-initializes if the bus changes */}
            <DynamicBusMap key={selectedBus.id} busNumber={selectedBus.bus_number} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}