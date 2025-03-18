"use client"

import { useState } from "react"
import axios from "axios"
import { Search, MapPin, Bus, AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SeachProps } from "@/models/searchprops"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

type Stops = {
    stop_id: number
    stop_name: string
}

type RouteStops = {
    route_id: number
    route_number: number
    route_name: string
}

type Result = {
    message: string
    stops: Stops[] | null
    route_stops: RouteStops[] | null
}

export function SearchBar() {
    const [search, setSearch] = useState<string>("")
    const [result, setResult] = useState<Result | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const searchRoute = async () => {
        if (!search.trim()) {
            setError("Please enter a search term")
            return
        }

        setIsLoading(true)
        setHasSearched(true)
        setError(null)
        const token = sessionStorage.getItem("token")

        const requestBody = SeachProps.safeParse({
            query: search,
        })

        if (requestBody.success) {
            try {
                const response = await axios.post("http://localhost:8080/search/stops", requestBody.data, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                })
                if (response.status === 200) {
                    setResult(response.data)
                }
            } catch (e) {
                console.log("Error searching for routes/stops:", e)
                setError("Failed to search. Please try again.")
                setResult(null)
            } finally {
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
            setError("Invalid search query")
        }
    }

    const hasNoResults = () => {
        return (
            hasSearched &&
            result &&
            (!result.route_stops || result.route_stops.length === 0) &&
            (!result.stops || result.stops.length === 0)
        )
    }

    const clearResults = () => {
        setSearch("")
        setResult(null)
        setHasSearched(false)
        setError(null)
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search for route number, name or stop"
                        className="pl-10 h-11"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") searchRoute()
                        }}
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={searchRoute} disabled={isLoading} className="sm:w-auto w-full h-11">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching
                            </>
                        ) : (
                            "Search"
                        )}
                    </Button>
                    {(result || hasSearched) && (
                        <Button onClick={clearResults} variant="outline" className="sm:w-auto w-full h-11">
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-destructive/10 text-destructive rounded-md p-3 flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* Loading skeletons */}
            {isLoading && (
                <div className="space-y-3 mt-2">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* No results message */}
            {hasNoResults() && (
                <Card className="border-dashed mt-4">
                    <CardContent className="p-6 text-center">
                        <div className="text-muted-foreground">
                            <Search className="mx-auto h-12 w-12 mb-3 opacity-50" />
                            <h3 className="text-lg font-medium mb-1">No routes or stops found</h3>
                            <p>Try searching with different keywords</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search results */}
            {!isLoading && result && (
                <div className="space-y-6 mt-4">
                    {/* Route results */}
                    {result.route_stops && result.route_stops.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Bus className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">Routes</h2>
                                <Badge variant="outline" className="ml-auto">
                                    {result.route_stops.length} found
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {result.route_stops.map((route) => (
                                    <Link href={`/bookings/byroute/${route.route_id}`} key={route.route_id}>
                                        <Card className="hover:bg-accent/50 transition-colors hover:shadow-sm cursor-pointer h-full">
                                            <CardContent className="p-4 flex items-center">
                                                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-4 text-lg">
                                                    {route.route_number}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{route.route_name}</h3>
                                                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                                                        <Bus className="h-3.5 w-3.5 mr-1" />
                                                        Route #{route.route_number}
                                                    </p>
                                                    <div className="mt-2">
                                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-flex items-center">
                                                            View Stops
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="12"
                                                                height="12"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="ml-1"
                                                            >
                                                                <path d="M5 12h14"></path>
                                                                <path d="m12 5 7 7-7 7"></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stop results */}
                    {result.stops && result.stops.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">Stops</h2>
                                <Badge variant="outline" className="ml-auto">
                                    {result.stops.length} found
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {result.stops.map((stop) => (
                                    <Card key={stop.stop_id} className="hover:bg-accent/50 transition-colors hover:shadow-sm">
                                        <CardContent className="p-4">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold mr-4 text-lg">
                                                    S
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{stop.stop_name}</h3>
                                                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                                        Stop ID: {stop.stop_id}
                                                    </p>
                                                    <div className="mt-2">
                                                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                                                            Bus Stop
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

