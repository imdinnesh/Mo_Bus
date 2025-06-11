"use client"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import React, { useEffect, useState } from "react"

type LocationData = {
  busId: string
  routeId: string
  latitude: number
  longitude: number
  timestamp: string
}

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
})

function FlyToLocation({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

export default function BusMap() {
  const [location, setLocation] = useState<LocationData | null>(null)

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:4000/location-stream?busId=bus-101")

    eventSource.onmessage = (event) => {
      try {
        const data: LocationData = JSON.parse(event.data)
        setLocation(data)
      } catch (err) {
        console.error("Error parsing SSE data", err)
      }
    }

    eventSource.onerror = (error) => {
      console.error("SSE error:", error)
      eventSource.close()
    }

    return () => eventSource.close()
  }, [])

  return (
    <div className="h-[600px] w-full">
      <MapContainer
        center={[20.291942, 85.784257]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg shadow-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {location && (
          <>
            <Marker
              position={[location.latitude, location.longitude]}
              icon={busIcon}
            >
              <Popup>
                <div>
                  <p><strong>Bus:</strong> {location.busId}</p>
                  <p><strong>Route:</strong> {location.routeId}</p>
                  <p><strong>Time:</strong> {new Date(location.timestamp).toLocaleTimeString()}</p>
                </div>
              </Popup>
            </Marker>
            <FlyToLocation lat={location.latitude} lng={location.longitude} />
          </>
        )}
      </MapContainer>
    </div>
  )
}
