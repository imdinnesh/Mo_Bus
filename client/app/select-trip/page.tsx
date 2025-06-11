"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { useSearchParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import Fuse from "fuse.js"
import { LogIn, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectTripFormValues, SelectTripSchema } from "@/schemas/trip"
import { useRouteDetail } from "@/hooks/useRouteDetail"
import { useRoutes } from "@/hooks/useRoutes"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Loader2, Search, Route, Info, Hash, X } from "lucide-react"

// --- Helper Components for a Cleaner Structure ---

// Self-contained route search component with integrated Fuse.js logic
function RouteSearch({
    routes,
    onRouteSelect,
    selectedRoute,
    onClear,
    isLoading,
}: {
    routes: { id: string; route_number: string; route_name: string }[]
    onRouteSelect: (route: any) => void
    selectedRoute: { route_number: string } | null
    onClear: () => void
    isLoading: boolean
}) {
    const [query, setQuery] = useState("")
    const [isFocused, setIsFocused] = useState(false)

    const fuse = useMemo(() => {
        return new Fuse(routes, {
            keys: ["route_number", "route_name"],
            threshold: 0.3,
        })
    }, [routes])

    const searchResults = useMemo(() => {
        if (!query) return []
        return fuse.search(query).map((r) => r.item)
    }, [query, fuse])

    if (selectedRoute) {
        return (
            <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
                <Route className="h-5 w-5 text-primary" />
                <p className="flex-1 font-medium">Route {selectedRoute.route_number}</p>
                <Button variant="ghost" size="sm" onClick={onClear}>
                    <X className="mr-1 h-3 w-3" /> Change
                </Button>
            </div>
        )
    }

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                id="routeSearch"
                placeholder="Search by route number or name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                className="pl-10 h-12 text-base"
                autoComplete="off"
            />
            {isFocused && query.length > 0 && (
                <div className="absolute z-10 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
                    <ScrollArea className="h-auto max-h-60">
                        {isLoading && <Loader2 className="mx-auto my-4 h-6 w-6 animate-spin" />}
                        {!isLoading && searchResults.length > 0 && (
                            <ul>
                                {searchResults.map((route) => (
                                    <li
                                        key={route.id}
                                        onMouseDown={() => {
                                            setQuery("")
                                            onRouteSelect(route)
                                        }}
                                        className="px-4 py-3 cursor-pointer hover:bg-accent"
                                    >
                                        <div className="font-medium">Route {route.route_number}</div>
                                        <div className="text-sm text-muted-foreground">{route.route_name}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {!isLoading && searchResults.length === 0 && (
                            <p className="p-4 text-center text-sm text-muted-foreground">No routes found.</p>
                        )}
                    </ScrollArea>
                </div>
            )}
        </div>
    )
}

function RouteInfoPanel({ routeDetails }: { routeDetails: any }) {
    if (!routeDetails) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Info className="h-5 w-5" /> Get Started
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    Select a route to see its details and choose your boarding and destination points.
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardHeader>
                <CardDescription className="flex items-center gap-2">
                    <Route className="h-4 w-4" /> Selected Route
                </CardDescription>
                <CardTitle className="text-3xl">Route {routeDetails.route_number}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <p className="text-muted-foreground">{routeDetails.route_name}</p>
                <div className="flex items-center text-sm pt-2">
                    <Hash className="mr-2 h-4 w-4" />
                    <span>{routeDetails.RouteStops?.length || 0} stops on this route</span>
                </div>
            </CardContent>
        </Card>
    )
}

function SelectTripSkeleton() {
    return (
        <main className="container mx-auto max-w-5xl p-4 py-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        </main>
    )
}

// --- Main Page Component ---

export default function SelectTripPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [startIndex, setStartIndex] = useState<number | null>(null)
    const { data: routesMap, isLoading: isRoutesLoading } = useRoutes()
    const routeIdFromUrl = searchParams.get("routeId") || ""
    const { data: routeDetails, isLoading: isRouteDetailsLoading } = useRouteDetail(routeIdFromUrl)

    const routesArray = useMemo(() => {
        if (!routesMap) return []
        return Object.entries(routesMap).map(([id, label]) => {
            const [route_number, ...nameParts] = label.split(" - ")
            return { id, route_number, route_name: nameParts.join(" - ") }
        })
    }, [routesMap])

    const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<SelectTripFormValues>({
        resolver: zodResolver(SelectTripSchema),
    })

    const startStopId = watch("startStop")

    useEffect(() => {
        if (routeDetails) {
            setValue("routeNumber", routeDetails.route_number)
        }
    }, [routeDetails, setValue])

    useEffect(() => {
        const index = routeDetails?.RouteStops.find((s: any) => s.Stop.id.toString() === startStopId)?.stop_index
        setStartIndex(index ?? null)
        setValue("endStop", "")
    }, [startStopId, routeDetails, setValue])

    const stops = useMemo(() => routeDetails?.RouteStops.slice().sort((a: any, b: any) => a.stop_index - b.stop_index) || [], [routeDetails])
    const filteredEndStops = useMemo(() => {
        if (startIndex === null) return []
        return stops.filter((s: any) => s.stop_index > startIndex)
    }, [startIndex, stops])

    const handleRouteSelect = useCallback((route: { id: string }) => {
        router.push(`/select-trip?routeId=${route.id}`, { scroll: false })
    }, [router])

    const handleClearSelection = () => {
        setValue("routeNumber", "")
        setValue("startStop", "")
        setValue("endStop", "")
        router.push("/select-trip", { scroll: false })
    }

    const onSubmit = (data: SelectTripFormValues) => {
        router.push(`/select-ticket?routeId=${routeIdFromUrl}&startStopId=${data.startStop}&endStopId=${data.endStop}`)
    }

    const isLoading = isRouteDetailsLoading || isRoutesLoading

    if (isRoutesLoading && !routeIdFromUrl) return <SelectTripSkeleton />

    return (
        <main className="container mx-auto max-w-5xl p-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Select Your Trip</h1>
                <p className="text-muted-foreground">Choose a route and your stops to buy a ticket.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                {/* Left Column: Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <Label className="text-lg font-semibold" htmlFor="routeSearch">1. Select Route</Label>
                            <p className="text-sm text-muted-foreground mb-4">Start by finding the route you want to travel on.</p>
                            <RouteSearch
                                routes={routesArray}
                                onRouteSelect={handleRouteSelect}
                                selectedRoute={routeDetails ? { route_number: routeDetails.route_number } : null}
                                onClear={handleClearSelection}
                                isLoading={isRoutesLoading}
                            />
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-lg font-semibold">2. Select Stops</h3>
                            <p className="text-sm text-muted-foreground mb-4">Choose your boarding and destination points.</p>

                            {/* --- Start of Refactored "Select Stops" Card --- */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="relative space-y-8">
                                        {/* --- The visual timeline line --- */}
                                        <div
                                            className={cn(
                                                "absolute left-4.5 top-4.5 h-[calc(100%-36px)] w-0.5",
                                                startStopId ? "bg-primary" : "bg-border"
                                            )}
                                            aria-hidden="true"
                                        />

                                        {/* --- Boarding Point --- */}
                                        <div className="flex items-start gap-4">
                                            <div className="z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                                                <LogIn className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="w-full space-y-1.5">
                                                <Label htmlFor="startStop" className="font-medium">Boarding Point</Label>
                                                <Controller
                                                    name="startStop"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value || ""}
                                                            disabled={!routeIdFromUrl || isLoading}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={!routeIdFromUrl ? "Please select a route first" : "Select boarding stop"}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {isLoading && <Loader2 className="mx-auto my-4 h-5 w-5 animate-spin" />}
                                                                {stops.map((s: any) => (
                                                                    <SelectItem key={s.id} value={s.Stop.id.toString()}>
                                                                        {s.Stop.stop_name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.startStop && <p className="text-sm text-destructive">{errors.startStop.message}</p>}
                                            </div>
                                        </div>

                                        {/* --- Destination Point --- */}
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={cn(
                                                    "z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 bg-background",
                                                    startStopId ? "border-primary" : "border-muted"
                                                )}
                                            >
                                                <MapPin className={cn("h-5 w-5", startStopId ? "text-primary" : "text-muted-foreground")} />
                                            </div>
                                            <div className="w-full space-y-1.5">
                                                <Label
                                                    htmlFor="endStop"
                                                    className={cn("font-medium", !startStopId && "text-muted-foreground")}
                                                >
                                                    Destination Point
                                                </Label>
                                                <Controller
                                                    name="endStop"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value || ""}
                                                            disabled={!startStopId || isLoading}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={!startStopId ? "Select boarding point first" : "Select destination stop"}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {filteredEndStops.map((s: any) => (
                                                                    <SelectItem key={s.id} value={s.Stop.id.toString()}>
                                                                        {s.Stop.stop_name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.endStop && <p className="text-sm text-destructive">{errors.endStop.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* --- End of Refactored "Select Stops" Card --- */}
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || isLoading || !watch("endStop")}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Continue to Tickets"}
                        </Button>
                    </form>
                </div>

                {/* Right Column: Info Panel */}
                <div className="order-first md:order-last">
                    <RouteInfoPanel routeDetails={routeDetails} />
                </div>
            </div>
        </main>
    )
}