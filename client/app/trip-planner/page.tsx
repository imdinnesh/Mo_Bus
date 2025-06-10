"use client"

import type React from "react"

import { useEffect, useMemo, useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin, Search, Loader2, X, ArrowRightLeft, Navigation } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useStops } from "@/hooks/useStops"
import { useTripStore } from "@/store/useTripStore"
import { tripPlannerSchema } from "@/schemas/trip"

import Fuse from "fuse.js"
import { useMutation } from "@tanstack/react-query"
import { getRoutesByStops } from "@/api/trip"
import { toast } from "sonner"

export default function TripPlannerPage() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tripPlannerSchema),
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  const { setSource, setDestination, setRoute } = useTripStore()

  const { data: stopsMap, isLoading } = useStops()

  const [querySource, setQuerySource] = useState("")
  const [queryDest, setQueryDest] = useState("")
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false)
  const [destDropdownOpen, setDestDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const sourceInputRef = useRef<HTMLInputElement>(null)
  const destInputRef = useRef<HTMLInputElement>(null)
  const [fetchedRoutes, setFetchedRoutes] = useState<any[]>([])

  const stopsArray = useMemo(() => {
    if (!stopsMap) return []
    return Object.entries(stopsMap).map(([id, stop_name]) => ({
      id,
      label: stop_name,
    }))
  }, [stopsMap])

  const fuse = useMemo(
    () =>
      new Fuse(stopsArray, {
        keys: ["label"],
        threshold: 0.3,
      }),
    [stopsArray],
  )

  const sourceResults = querySource ? fuse.search(querySource).map((r) => r.item) : []
  const destResults = queryDest ? fuse.search(queryDest).map((r) => r.item) : []

  const sourceId = watch("sourceId")
  const destinationId = watch("destinationId")

  // Set default values from query param
  useEffect(() => {
    const destId = searchParams.get("destId")
    const sourceId = searchParams.get("sourceId")

    if (destId && stopsMap?.[destId]) {
      setValue("destinationId", destId)
      setQueryDest(stopsMap[destId])
    }

    if (sourceId && stopsMap?.[sourceId]) {
      setValue("sourceId", sourceId)
      setQuerySource(stopsMap[sourceId])
    }
  }, [searchParams, stopsMap, setValue])

  // Handle keyboard navigation for source dropdown
  const handleSourceKeyDown = (e: React.KeyboardEvent) => {
    if (!sourceDropdownOpen || sourceResults.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev < sourceResults.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : sourceResults.length - 1))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      const selected = sourceResults[activeIndex]
      setValue("sourceId", selected.id)
      setQuerySource(selected.label)
      setSourceDropdownOpen(false)
      setActiveIndex(-1)
    } else if (e.key === "Escape") {
      setSourceDropdownOpen(false)
      setActiveIndex(-1)
    }
  }

  // Handle keyboard navigation for destination dropdown
  const handleDestKeyDown = (e: React.KeyboardEvent) => {
    if (!destDropdownOpen || destResults.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev < destResults.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : destResults.length - 1))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      const selected = destResults[activeIndex]
      setValue("destinationId", selected.id)
      setQueryDest(selected.label)
      setDestDropdownOpen(false)
      setActiveIndex(-1)
    } else if (e.key === "Escape") {
      setDestDropdownOpen(false)
      setActiveIndex(-1)
    }
  }

  // Swap source and destination
  const handleSwap = () => {
    const currentSource = { id: sourceId, label: querySource }
    const currentDest = { id: destinationId, label: queryDest }

    setValue("sourceId", currentDest.id)
    setValue("destinationId", currentSource.id)
    setQuerySource(currentDest.label)
    setQueryDest(currentSource.label)
  }

  const mutation = useMutation({
    mutationKey: ["getRoutesByStops"],
    mutationFn: getRoutesByStops,
    onSuccess: (data) => {
      console.log(data)
      setFetchedRoutes(data.routes || [])
      toast.success(data.message || "Routes fetched successfully!")
    },
    onError: (error: any) => {
      console.error("Error fetching routes:", error)
      toast.error(error.response?.data?.message || "Failed to fetch routes. Please try again.")
    }
  })

  const onSubmit = async (data: any) => {
    const sourceName = stopsMap?.[data.sourceId] || ""
    const destinationName = stopsMap?.[data.destinationId] || ""

    setSource(data.sourceId, sourceName)
    setDestination(data.destinationId, destinationName)
    mutation.mutate({
      source_id: parseInt(data.sourceId),
      destination_id: parseInt(data.destinationId),
    })

  }

  if (isLoading) {
    return (
      <Card className="max-w-xl mx-auto mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-xl mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Trip Planner</CardTitle>
        <CardDescription>Find the best route for your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            {/* Source Stop Search */}
            <div className="relative">
              <Label htmlFor="sourceSearch" className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span>Starting Point</span>
              </Label>
              <div className="relative">
                <Controller
                  name="sourceId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="relative">
                        <Input
                          id="sourceSearch"
                          ref={sourceInputRef}
                          value={querySource}
                          onChange={(e) => {
                            const value = e.target.value
                            setQuerySource(value)
                            field.onChange("") // clear selection
                            setSourceDropdownOpen(value.length > 0)
                            setActiveIndex(-1)
                          }}
                          onKeyDown={handleSourceKeyDown}
                          placeholder="Search for starting point..."
                          className="pl-10"
                          aria-autocomplete="list"
                          aria-controls="source-results"
                          aria-expanded={sourceDropdownOpen}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        {querySource && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => {
                              setQuerySource("")
                              setValue("sourceId", "")
                              sourceInputRef.current?.focus()
                            }}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear source</span>
                          </Button>
                        )}
                      </div>
                      {sourceDropdownOpen && sourceResults.length > 0 && (
                        <div
                          id="source-results"
                          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
                        >
                          <ScrollArea className="h-auto max-h-[200px]">
                            <ul className="py-1" role="listbox">
                              {sourceResults.map((item, index) => (
                                <li
                                  key={item.id}
                                  role="option"
                                  aria-selected={activeIndex === index}
                                  onClick={() => {
                                    setValue("sourceId", item.id)
                                    setQuerySource(item.label)
                                    setSourceDropdownOpen(false)
                                  }}
                                  className={`px-3 py-2 cursor-pointer text-sm ${activeIndex === index ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                    }`}
                                >
                                  {item.label}
                                </li>
                              ))}
                            </ul>
                          </ScrollArea>
                        </div>
                      )}
                      {sourceDropdownOpen && querySource && sourceResults.length === 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                          <p className="px-3 py-2 text-sm text-muted-foreground">No stops found</p>
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
              {errors.sourceId && (
                <p className="text-destructive text-sm mt-1">
                  {typeof errors.sourceId.message === "string" ? errors.sourceId.message : "Starting point is required"}
                </p>
              )}
            </div>

            {/* Swap Button */}
            <div className="relative flex justify-center my-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-background shadow-md"
                onClick={handleSwap}
                disabled={!sourceId || !destinationId}
                aria-label="Swap source and destination"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Destination Stop Search */}
            <div className="relative">
              <Label htmlFor="destSearch" className="flex items-center gap-2 mb-2">
                <Navigation className="h-4 w-4 text-red-600" />
                <span>Destination</span>
              </Label>
              <div className="relative">
                <Controller
                  name="destinationId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="relative">
                        <Input
                          id="destSearch"
                          ref={destInputRef}
                          value={queryDest}
                          onChange={(e) => {
                            const value = e.target.value
                            setQueryDest(value)
                            field.onChange("")
                            setDestDropdownOpen(value.length > 0)
                            setActiveIndex(-1)
                          }}
                          onKeyDown={handleDestKeyDown}
                          placeholder="Search for destination..."
                          className="pl-10"
                          aria-autocomplete="list"
                          aria-controls="dest-results"
                          aria-expanded={destDropdownOpen}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        {queryDest && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => {
                              setQueryDest("")
                              setValue("destinationId", "")
                              destInputRef.current?.focus()
                            }}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear destination</span>
                          </Button>
                        )}
                      </div>
                      {destDropdownOpen && destResults.length > 0 && (
                        <div
                          id="dest-results"
                          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
                        >
                          <ScrollArea className="h-auto max-h-[200px]">
                            <ul className="py-1" role="listbox">
                              {destResults.map((item, index) => (
                                <li
                                  key={item.id}
                                  role="option"
                                  aria-selected={activeIndex === index}
                                  onClick={() => {
                                    setValue("destinationId", item.id)
                                    setQueryDest(item.label)
                                    setDestDropdownOpen(false)
                                  }}
                                  className={`px-3 py-2 cursor-pointer text-sm ${activeIndex === index ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                    }`}
                                >
                                  {item.label}
                                </li>
                              ))}
                            </ul>
                          </ScrollArea>
                        </div>
                      )}
                      {destDropdownOpen && queryDest && destResults.length === 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                          <p className="px-3 py-2 text-sm text-muted-foreground">No stops found</p>
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
              {errors.destinationId && (
                <p className="text-destructive text-sm mt-1">
                  {typeof errors.destinationId.message === "string"
                    ? errors.destinationId.message
                    : "Destination is required"}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting || !sourceId || !destinationId}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Routes...
              </>
            ) : (
              "Find Routes"
            )}
          </Button>
        </form>
        {fetchedRoutes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Available Routes</h3>
            <div className="space-y-4">
              {fetchedRoutes.map((route) => (
                <Card key={route.id} className="bg-muted/50 border border-muted p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium">Route #{route.route_number}</h4>
                      <p className="text-muted-foreground text-sm">{route.route_name}</p>
                    </div>
                    <div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
