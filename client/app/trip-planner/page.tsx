"use client"

import type React from "react"
import { useEffect, useMemo, useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin, Search, Loader2, X, ArrowRightLeft, Navigation } from "lucide-react"
import Fuse from "fuse.js"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { useStops } from "@/hooks/useStops"
import { useTripStore } from "@/store/useTripStore"
import { tripPlannerSchema } from "@/schemas/trip"
import { getRoutesByStops } from "@/api/trip"


function TripPlannerSkeleton() {
  return (
    <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-12 p-4 py-8 md:grid-cols-2">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
        <div className="mt-8 space-y-8">
          <div>
            <Skeleton className="mb-2 h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="mb-2 h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div>
        <Skeleton className="h-9 w-40 md:mt-11" />
        <div className="mt-4 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function TripPlannerPage() {

  const router = useRouter()
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripPlannerSchema),
  })

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

  const stopsArray = useMemo(() => {
    if (!stopsMap) return []
    return Object.entries(stopsMap).map(([id, stop_name]) => ({ id, label: stop_name }))
  }, [stopsMap])

  const fuse = useMemo(
    () => new Fuse(stopsArray, { keys: ["label"], threshold: 0.3 }),
    [stopsArray]
  )

  const sourceResults = querySource ? fuse.search(querySource).map((r) => r.item) : []
  const destResults = queryDest ? fuse.search(queryDest).map((r) => r.item) : []

  const sourceId = watch("sourceId")
  const destinationId = watch("destinationId")

  useEffect(() => {
    const destId = searchParams.get("destId")
    const sourceIdParam = searchParams.get("sourceId")

    if (destId && stopsMap?.[destId]) {
      setValue("destinationId", destId)
      setQueryDest(stopsMap[destId])
    }
    if (sourceIdParam && stopsMap?.[sourceIdParam]) {
      setValue("sourceId", sourceIdParam)
      setQuerySource(stopsMap[sourceIdParam])
    }
  }, [searchParams, stopsMap, setValue])

  const handleKeyDown = (
    e: React.KeyboardEvent,
    isOpen: boolean,
    results: typeof sourceResults,
    onSelect: (item: { id: string; label: string }) => void,
    onClose: () => void,
  ) => {
    if (!isOpen || results.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      onSelect(results[activeIndex])
    } else if (e.key === "Escape") {
      onClose()
    }
  }

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
      toast.success(data.message || "Routes fetched successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to fetch routes.")
    },
  })

  const onSubmit = (data: any) => {
    setSource(data.sourceId, stopsMap?.[data.sourceId] || "")
    setDestination(data.destinationId, stopsMap?.[data.destinationId] || "")
    mutation.mutate({
      source_id: parseInt(data.sourceId),
      destination_id: parseInt(data.destinationId),
    })
  }

  if (isLoading) {
    return <TripPlannerSkeleton />
  }

  const foundRoutes = mutation.data?.routes || []

  return (
    <main className="container mx-auto grid max-w-5xl grid-cols-1 gap-x-12 gap-y-8 p-4 py-8 md:grid-cols-2">
      {/* --- FORM SECTION --- */}
      <div className="flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Trip Planner</h1>
          <p className="text-muted-foreground">Find the best route for your journey.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow space-y-6">
          {/* Source Input */}
          <div className="relative">
            <Label htmlFor="sourceSearch" className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              Starting Point
            </Label>
            <Controller
              name="sourceId"
              control={control}
              render={({ field }) => (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="sourceSearch"
                      ref={sourceInputRef}
                      value={querySource}
                      onChange={(e) => {
                        setQuerySource(e.target.value)
                        field.onChange("")
                        setSourceDropdownOpen(e.target.value.length > 0)
                        setActiveIndex(-1)
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, sourceDropdownOpen, sourceResults, (item) => {
                          setValue("sourceId", item.id)
                          setQuerySource(item.label)
                          setSourceDropdownOpen(false)
                        }, () => setSourceDropdownOpen(false))
                      }
                      onFocus={() => querySource && setSourceDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setSourceDropdownOpen(false), 150)}
                      placeholder="Search for a starting point..."
                      className="pl-10"
                    />
                    {querySource && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => {
                          setQuerySource("")
                          setValue("sourceId", "")
                          sourceInputRef.current?.focus()
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {sourceDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
                      <ScrollArea className="h-auto max-h-60">
                        {sourceResults.length > 0 ? (
                          <ul role="listbox">
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
                                className={`px-3 py-2 cursor-pointer text-sm outline-none ${activeIndex === index ? "bg-accent text-accent-foreground" : ""
                                  }`}
                              >
                                {item.label}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="p-4 text-center text-sm text-muted-foreground">No stops found.</p>
                        )}
                      </ScrollArea>
                    </div>
                  )}
                </>
              )}
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleSwap}
              disabled={!sourceId || !destinationId}
              aria-label="Swap source and destination"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Destination Input */}
          <div className="relative">
            <Label htmlFor="destSearch" className="flex items-center gap-2 mb-2">
              <Navigation className="h-5 w-5 text-muted-foreground" />
              Destination
            </Label>
            <Controller
              name="destinationId"
              control={control}
              render={({ field }) => (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="destSearch"
                      ref={destInputRef}
                      value={queryDest}
                      onChange={(e) => {
                        setQueryDest(e.target.value)
                        field.onChange("")
                        setDestDropdownOpen(e.target.value.length > 0)
                        setActiveIndex(-1)
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, destDropdownOpen, destResults, (item) => {
                          setValue("destinationId", item.id)
                          setQueryDest(item.label)
                          setDestDropdownOpen(false)
                        }, () => setDestDropdownOpen(false))
                      }
                      onFocus={() => queryDest && setDestDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setDestDropdownOpen(false), 150)}
                      placeholder="Search for a destination..."
                      className="pl-10"
                    />
                    {queryDest && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => {
                          setQueryDest("")
                          setValue("destinationId", "")
                          destInputRef.current?.focus()
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {destDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
                      <ScrollArea className="h-auto max-h-60">
                        {destResults.length > 0 ? (
                          <ul>
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
                                className={`px-3 py-2 cursor-pointer text-sm outline-none ${activeIndex === index ? "bg-accent text-accent-foreground" : ""
                                  }`}
                              >
                                {item.label}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="p-4 text-center text-sm text-muted-foreground">No stops found.</p>
                        )}
                      </ScrollArea>
                    </div>
                  )}
                </>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending || !sourceId || !destinationId}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Routes...
              </>
            ) : (
              "Find Routes"
            )}
          </Button>
        </form>
      </div>

      {/* --- RESULTS SECTION --- */}
      <div className="md:pt-11">
        <h2 className="text-2xl font-bold tracking-tight">Available Routes</h2>
        <Separator className="my-4" />
        {mutation.isPending && (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}
        {mutation.isError && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Could not fetch routes.</p>
            <p className="text-sm text-muted-foreground">Please try again.</p>
          </div>
        )}
        {mutation.isSuccess && (
          <>
            {foundRoutes.length > 0 ? (
              <ScrollArea className="h-[450px]">
                <div className="space-y-3 pr-4">
                  {foundRoutes.map((route: any) => (
                    <div key={route.id} className="rounded-lg border p-4 transition-colors hover:bg-accent/50">
                      <h3 className="font-semibold">Route #{route.route_number}</h3>
                      <p className="text-sm text-muted-foreground">{route.route_name}</p>
                      <Button
                        onClick={() => {
                          setRoute(route.id, route.route_number)
                          router.push(`select-trip?routeId=${route.id}`)
                        }}
                      >
                        Book Ticket
                      </Button>

                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="font-medium">No Direct Routes Found</p>
                <p className="text-sm text-muted-foreground">
                  There are no direct routes between the selected stops.
                </p>
              </div>
            )}
          </>
        )}
        {!mutation.isPending && !mutation.isError && !mutation.isSuccess && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Your results will appear here.</p>
          </div>
        )}
      </div>
    </main>
  )
}