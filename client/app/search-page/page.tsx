"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Fuse from "fuse.js"
import debounce from "lodash.debounce"

import { useStops } from "@/hooks/useStops"
import { useRoutes } from "@/hooks/useRoutes"
import { useTripStore } from "@/store/useTripStore"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Bus, MapPin, Clock, X, Info, Route, FileSearch } from "lucide-react"

type SearchResult = {
  id: string
  label: string
  type: "stop" | "route"
  route_number?: string
  subLabel?: string
}

// --- Reusable Components ---

function SearchResultItem({ item, onClick }: { item: SearchResult; onClick: (item: SearchResult) => void }) {
  const Icon = item.type === "route" ? Bus : MapPin
  return (
    <div
      onClick={() => onClick(item)}
      className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent"
    >
      <div className="p-2 rounded-md border bg-background">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{item.label}</p>
        <p className="text-sm text-muted-foreground">{item.subLabel || item.type}</p>
      </div>
    </div>
  )
}

function SearchInfoPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
        <Info className="h-6 w-6" />
        Find Your Way
      </h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Route className="h-5 w-5 text-primary" />
            Search by Route
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Enter a route number (e.g., "11") to see its full path, all stops, and live bus locations.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5 text-primary" />
            Search by Stop
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Type the name of a bus stop to quickly set it as a destination in the Trip Planner.
        </CardContent>
      </Card>
    </div>
  )
}

function SearchPageSkeleton() {
  return (
    <main className="container mx-auto max-w-6xl p-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-full" />
          <div className="mt-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </main>
  )
}

// --- Main Page Component ---

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [history, setHistory] = useState<SearchResult[]>([])

  const { data: stopsMap, isLoading: isLoadingStops } = useStops()
  const { data: routesMap, isLoading: isLoadingRoutes } = useRoutes()
  const setDestination = useTripStore((state) => state.setDestination)
  const setRouteStore = useTripStore((state) => state.setRoute)
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem("searchHistory")
    if (raw) {
      // Basic validation in case of malformed data
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setHistory(parsed)
        }
      } catch (e) {
        localStorage.removeItem("searchHistory")
      }
    }
  }, [])

  const saveToHistory = (item: SearchResult) => {
    const newHistory = [item, ...history.filter((h) => h.id !== item.id)].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))
  }

  const stopsArray = useMemo(() => {
    if (!stopsMap) return []
    return Object.entries(stopsMap).map(([id, stop_name]) => ({ id, stop_name }))
  }, [stopsMap])

  const routesArray = useMemo(() => {
    if (!routesMap) return []
    return Object.entries(routesMap).map(([id, label]) => {
      const [route_number, ...nameParts] = label.split(" - ")
      return { id, route_number, route_name: nameParts.join(" - ") }
    })
  }, [routesMap])

  const performSearch = useCallback(
    (input: string) => {
      if (!input.trim() || !stopsArray.length || !routesArray.length) {
        setResults([])
        return
      }

      const stopFuse = new Fuse(stopsArray, { keys: ["stop_name"], threshold: 0.3 })
      const routeFuse = new Fuse(routesArray, { keys: ["route_number", "route_name"], threshold: 0.3 })

      const stopResults: SearchResult[] = stopFuse.search(input).map((res) => ({
        id: res.item.id,
        label: res.item.stop_name,
        type: "stop",
      }))

      const routeResults: SearchResult[] = routeFuse.search(input).map((res) => ({
        id: res.item.id,
        label: `Route ${res.item.route_number}`,
        subLabel: res.item.route_name,
        type: "route",
        route_number: res.item.route_number,
      }))

      setResults([...routeResults, ...stopResults])
    },
    [stopsArray, routesArray]
  )

  const debouncedSearch = useMemo(() => debounce(performSearch, 300), [performSearch])

  useEffect(() => {
    debouncedSearch(query)
    return () => debouncedSearch.cancel()
  }, [query, debouncedSearch])

  const handleClick = (item: SearchResult) => {
    saveToHistory(item)
    if (item.type === "route") {
      setRouteStore(item.id, item.route_number || "")
      router.push(`/route-details?routeId=${item.id}`)
    } else {
      setDestination(item.id, item.label)
      router.push(`/trip-planner?destId=${item.id}`)
    }
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("searchHistory")
  }

  if (isLoadingStops || isLoadingRoutes) {
    return <SearchPageSkeleton />
  }

  const displayResults = query.length > 0
  const routesResults = results.filter((r) => r.type === "route")
  const stopsResults = results.filter((r) => r.type === "stop")

  return (
    <main className="container mx-auto max-w-6xl p-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
        {/* Left Column: Search & Results */}
        <div className="md:col-span-2">
          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-tight">Search</h1>
            <p className="text-muted-foreground">Find routes and stops across the network.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by route number or stop name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="mt-6 min-h-[400px]">
            {displayResults ? (
              // --- SEARCH RESULTS ---
              results.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <div className="pr-4 space-y-6">
                    {routesResults.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Routes</h3>
                        {routesResults.map((item) => (
                          <SearchResultItem key={item.id} item={item} onClick={handleClick} />
                        ))}
                      </div>
                    )}
                    {stopsResults.length > 0 && routesResults.length > 0 && <Separator />}
                    {stopsResults.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Stops</h3>
                        {stopsResults.map((item) => (
                          <SearchResultItem key={item.id} item={item} onClick={handleClick} />
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center pt-20">
                  <FileSearch className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Results Found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different search term or check for typos.
                  </p>
                </div>
              )
            ) : (
              // --- RECENT SEARCH HISTORY ---
              history.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" /> Recent Searches
                    </h3>
                    <Button variant="ghost" size="sm" onClick={clearHistory}>
                      <X className="h-3 w-3 mr-1" /> Clear
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {history.map((item) => (
                      <SearchResultItem key={`${item.type}-${item.id}`} item={item} onClick={handleClick} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center pt-20">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Search for a Route or Stop</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Your recent searches will appear here.</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Column: Info Panel */}
        <div className="order-first md:order-last">
          <SearchInfoPanel />
        </div>
      </div>
    </main>
  )
}