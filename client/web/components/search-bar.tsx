"use client"

import { useState } from "react"
import axios from "axios"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SeachProps } from "@/models/searchprops"
import Link from 'next/link'
type Stops = {
    stop_id: number
    stop_name: string
}

type RouteStops = {
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


    const searchRoute = async () => {
        if (!search.trim()) return

        setIsLoading(true)
        setHasSearched(true)
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
                setResult(null)
            } finally {
                setIsLoading(false)
            }
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
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search for route or destination"
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") searchRoute()
                        }}
                    />
                </div>
                <Button onClick={searchRoute} disabled={isLoading} className="sm:w-auto w-full">
                    {isLoading ? "Searching..." : "Search"}
                </Button>
                <Button onClick={clearResults} className="sm:w-auto w-full">
                    Clear
                </Button>
            </div>

            {/* Loading skeletons */}
            {isLoading && (
                <div className="space-y-3">
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
                <Card className="border-dashed">
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
                <div className="space-y-4">
                    {/* Route results */}
                    {result.route_stops && result.route_stops.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Routes</h2>
                            <div className="space-y-2">
                                {result.route_stops.map((route) => (
                                    <Card key={route.route_number} className="hover:bg-accent/50 transition-colors">
                                        <CardContent className="p-4 flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-4">
                                                {route.route_number}
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{route.route_name}</h3>
                                                <p className="text-sm text-muted-foreground">Route #{route.route_number}</p>
                                                <Link href={`/bookings/byroute/${route.route_number}`}>
                                                    View Stops
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stop results */}
                    {result.stops && result.stops.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Stops</h2>
                            <div className="space-y-2">
                                {result.stops.map((stop) => (
                                    <Card key={stop.stop_id} className="hover:bg-accent/50 transition-colors">
                                        <CardContent className="p-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold mr-4">
                                                    S
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{stop.stop_name}</h3>
                                                    <p className="text-sm text-muted-foreground">Stop ID: {stop.stop_id}</p>
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