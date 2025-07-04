"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import React, { useEffect, useState } from "react"
import { WifiOff, LoaderCircle } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

// --- Type Definition ---
type LocationData = {
  busId: string
  routeId: string
  latitude: number
  longitude: number
  timestamp: string
}

// --- Constants (defined outside the component to prevent re-creation) ---

// A modern, clean SVG icon for the bus.
const busIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJ1cyI+PHBhdGggZD0iTTggNmMwLTEuMS45LTIgMi0ySDh2NGgxMGExIDEgMCAwIDAgMS0xVjZIMTB6Ii8+PHBhdGggZD0iTTIgMTRhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjgtNUExIDIgMCAwIDAgMjAgN0gxN2ExIDIgMCAwIDEgMC00aDR2MTFhMiAyIDAgMCAxLTIgMmgtMWEyIDIgMCAwIDEtMi0yVjZINmEyIDIgMCAwIDAtMiAydjhhMiAyIDAgMCAwIDIgMnoiLz48cGF0aCBkPSJNNiA2VjRhMiAyIDAgMCAwLTIgMiIvPjxjaXJjbGUgY3g9IjciIGN5PSIxOCIgcj0iMiIvPjxjaXJjbGUgY3g9IjE3IiBjeT0iMTgiIHI9IjIiLz48L3N2Zz4=",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
})

// --- Helper Component for Map Interaction ---
function FlyToLocation({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    // Fly to the new location with a smooth animation.
    // The zoom level is preserved from the user's current zoom.
    map.flyTo([lat, lng], map.getZoom(), {
      animate: true,
      duration: 1.5, // Animation duration in seconds
    })
  }, [lat, lng, map])
  return null
}

// --- Main BusMap Component ---
export default function BusMap({ busNumber }: { busNumber: string }) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ensure this effect runs only for the given busNumber
    const eventSource = new EventSource(
      `http://localhost:4000/location-stream?busId=${busNumber}`
    )

    eventSource.onopen = () => {
      console.log("SSE connection established.")
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const data: LocationData = JSON.parse(event.data)
        setLocation(data)
        if (isLoading) setIsLoading(false) // Set loading to false on first successful message
      } catch (err) {
        console.error("Error parsing SSE data", err)
        setError("Failed to parse location data.")
      }
    }

    eventSource.onerror = (err) => {
      console.error("SSE error:", err)
      setError("Connection to location service failed. Please try again later.")
      setIsLoading(false)
      eventSource.close()
    }

    // Cleanup function to close the connection when the component unmounts
    return () => {
      eventSource.close()
    }
  }, [busNumber]) // Rerun effect if busNumber prop changes

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <LoaderCircle className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Connecting to location stream...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <WifiOff className="h-10 w-10 text-destructive" />
          <p className="text-destructive-foreground text-center">{error}</p>
        </div>
      )
    }

    // Initial state before first location is received but after connection is open
    if (!location) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <LoaderCircle className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Waiting for first location update...</p>
        </div>
      )
    }

    return (
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={16} // Start with a closer zoom level
        scrollWheelZoom={true}
        className="h-full w-full rounded-b-lg" // Match card border-radius
      >
        <TileLayer
          // Using a free, beautiful, and minimalist tile layer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Marker
          position={[location.latitude, location.longitude]}
          icon={busIcon}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p>
                <strong className="font-semibold">Bus:</strong> {location.busId}
              </p>
              <p>
                <strong className="font-semibold">Route:</strong> {location.routeId}
              </p>
              <p>
                <strong className="font-semibold">Time:</strong>{" "}
                {new Date(location.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </Popup>
        </Marker>
        <FlyToLocation lat={location.latitude} lng={location.longitude} />
      </MapContainer>
    )
  }

  return (
    <Card className="h-[600px] w-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle>Live Location for Bus {busNumber}</CardTitle>
        <CardDescription>
          Real-time tracking updated via live feed.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        {renderContent()}
      </CardContent>
    </Card>
  )
}