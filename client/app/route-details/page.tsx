"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useRouteDetail } from "@/hooks/useRouteDetail"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bus, Ticket, MapPin, AlertCircle, FileX, Hash } from "lucide-react"
import { useBusDetails } from "@/hooks/useBusDetails"
import { useState } from "react"
import { LiveTrackingSection } from "@/components/live-tracking-section"

type Stop = {
  id: number
  stop_index: number
  Stop: {
    stop_name: string
  }
}

type RouteData = {
  id: string
  route_number: string
  route_name: string
  RouteStops: Stop[]
}

// --- Reusable Components for a Cleaner Structure ---

// Right-hand panel for route info and actions
function RouteInfoPanel({ route }: { route: RouteData }) {
  const router = useRouter()
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Hash className="h-4 w-4" /> Route Number
          </CardDescription>
          <CardTitle className="text-4xl">{route.route_number}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{route.route_name}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Book Your Trip</CardTitle>
          <CardDescription>
            {route.RouteStops?.length || 0} stops on this route.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            className="w-full"
            onClick={() => router.push(`/select-trip?routeId=${route.id}`)}
          >
            <Ticket className="mr-2 h-5 w-5" />
            Buy Ticket
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Visually engaging timeline for stops
function StopTimeline({ stops }: { stops: Stop[] }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <MapPin className="h-6 w-6" /> Route Stops
      </h2>
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="p-6">
              {stops.map((stop, index) => (
                <div key={stop.id} className="relative flex items-start gap-6 pb-8">
                  {/* Timeline line - hidden on the last item */}
                  {index < stops.length - 1 && (
                    <div className="absolute left-[5.5px] top-4 h-full w-[1px] bg-border" />
                  )}

                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 flex h-3 w-3 items-center justify-center rounded-full mt-1 
                      ${index === 0 ? "bg-primary" : "border-2 border-primary bg-background"}`}
                  />

                  <p className="font-medium">{stop.Stop.stop_name}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

// Skeleton UI for loading state
function RouteDetailsSkeleton() {
  return (
    <main className="container mx-auto max-w-6xl p-4 py-8">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content skeleton */}
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-8 w-48 mb-4" />
          <Card>
            <CardContent className="p-6 space-y-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-start gap-6">
                  <Skeleton className="h-3 w-3 rounded-full mt-1" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-20 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

// --- Main Page Component ---

export default function RouteDetailsPage() {
  const searchParams = useSearchParams()
  const routeId = searchParams.get('routeId') || ''

  const { data, isLoading, error } = useRouteDetail(routeId)

  if (isLoading) return <RouteDetailsSkeleton />

  if (error) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-semibold">Could not load route</h2>
        <p className="mt-2 text-muted-foreground">Please try again later or select another route.</p>
        <p className="mt-1 text-sm text-destructive">{error.message}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center text-center">
        <FileX className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">Route Not Found</h2>
        <p className="mt-2 text-muted-foreground">The requested route does not exist or is unavailable.</p>
      </div>
    )
  }

  const sortedStops = data.RouteStops?.slice().sort((a, b) => a.stop_index - b.stop_index) || []

  return (
    <main className="container mx-auto max-w-6xl p-4 py-8">
      {/* SECTION 1: Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Bus className="h-9 w-9 text-primary" />
          Route Details
        </h1>
        <p className="text-muted-foreground">View all stops and book your ticket.</p>
      </div>

      {/* SECTION 2: Main Route Information (Two-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content: Stop Timeline (takes 2 of 3 columns) */}
        <div className="md:col-span-2">
          <StopTimeline stops={sortedStops} />
        </div>

        {/* Sidebar: Info & Actions (takes 1 of 3 columns) */}
        <div className="order-first md:order-last">
          <RouteInfoPanel route={{ ...data, id: String(data.id) }} />
        </div>
        {/*
          THE LIVE TRACKING SECTION IS REMOVED FROM HERE
        */}
      </div>

      {/* SECTION 3: Visual Separator & Live Tracking */}
      {/* We place the tracking section *outside* the grid to make it full-width */}
      <div className="mt-12">
        {/* A horizontal rule provides a clean, visual break between sections */}
        <hr className="my-8" />

        {/* The LiveTrackingSection now sits comfortably in its own full-width space */}
        <LiveTrackingSection routeId={routeId} />
      </div>
    </main>
  )
}