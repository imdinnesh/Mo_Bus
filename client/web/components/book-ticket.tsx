"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Bus, MapPin, Search } from "lucide-react"
import axios from "axios"
import { SelectStop } from "./select-stop"
import { useRouter } from "next/navigation"

type Stop = {
    stop_id: number
    stop_name: string
}

type RouteResult = {
    message: string
    route_stops: Stop[]
}

export const BookTicket = ({ route_no }: { route_no: string }) => {
    const [route_number, setRoute_number] = useState(route_no)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<RouteResult | null>(null)
    const [sourceStop, setSourceStop] = useState<Stop | null>(null);
    const [destinationStop, setDestinationStop] = useState<Stop | null>(null);
    const [sourceStopOpen, setSourceStopOpen] = useState(false);
    const [destinationStopOpen, setDestinationStopOpen] = useState(false);

    const router = useRouter();

    const getStops = async (routeNum: string) => {
        if (!routeNum.trim()) return;

        setIsLoading(true)
        try {
            const token = sessionStorage.getItem("token")

            const requestBody = {
                route_number: routeNum,
            }

            const response = await axios.post("http://localhost:8080/search/", requestBody, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            })

            const result: RouteResult = response.data
            setResult(result)
            setSourceStop(null);
            setDestinationStop(null);
        } catch (error) {
            console.error("Error fetching stops:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRouteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoute_number(e.target.value)
    }

    const handleSourceStopSelect = (stop: Stop | null) => {
        setSourceStop(stop);
    };

    const handleDestinationStopSelect = (stop: Stop | null) => {
        setDestinationStop(stop);
    };

    const handleSearch = () => {
        getStops(route_number);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <div className="flex items-center space-x-2">
                    <Bus className="h-5 w-5 text-primary" />
                    <CardTitle>Book Your Ticket</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                    Enter route details and select your stops
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="route" className="text-base">Route Number</Label>
                    <div className="flex space-x-2">
                        <Input
                            value={route_number}
                            onChange={handleRouteChange}
                            type="text"
                            id="route"
                            placeholder="Enter Route Number"
                            disabled={isLoading}
                            className="text-lg font-medium"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="min-w-[100px]"
                        >
                            {isLoading ? (
                                "Searching..."
                            ) : (
                                <>
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </>
                            )}
                        </Button>
                    </div>
                    {isLoading && (
                        <p className="text-sm text-muted-foreground animate-pulse">
                            Loading stops...
                        </p>
                    )}
                </div>

                {result && result.route_stops && (
                    <div className="space-y-6">
                        <Separator />
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-green-600" />
                                    <Label className="text-base">Source Stop</Label>
                                </div>
                                <SelectStop
                                    routestops={result.route_stops}
                                    onSelectStop={handleSourceStopSelect}
                                    selectedStop={sourceStop}
                                    open={sourceStopOpen}
                                    setOpen={setSourceStopOpen}
                                    label="Source Stop"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-red-600" />
                                    <Label className="text-base">Destination Stop</Label>
                                </div>
                                <SelectStop
                                    routestops={result.route_stops}
                                    onSelectStop={handleDestinationStopSelect}
                                    selectedStop={destinationStop}
                                    open={destinationStopOpen}
                                    setOpen={setDestinationStopOpen}
                                    label="Destination Stop"
                                />
                            </div>
                        </div>

                        {sourceStop && destinationStop && (
                            <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
                                <h3 className="font-medium">Selected Journey</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">From</p>
                                        <p className="font-medium">{sourceStop.stop_name}</p>
                                        <p className="text-xs text-muted-foreground">Stop ID: {sourceStop.stop_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">To</p>
                                        <p className="font-medium">{destinationStop.stop_name}</p>
                                        <p className="text-xs text-muted-foreground">Stop ID: {destinationStop.stop_id}</p>
                                    </div>
                                </div>
                                <Button 
                                onClick={()=>{
                                    // add the id as query param
                                    router.push(`/payment?source=${sourceStop.stop_id}&destination=${destinationStop.stop_id}`)
                                }}
                                className="w-32 mt-5 align-middle" 
                                disabled={!sourceStop || !destinationStop}>
                                    Book Ticket
                                </Button>

                            </div>
                        )}
                    </div>
                )}

                {result && !result.route_stops && (
                    <div className="text-center py-6">
                        <p className="text-muted-foreground">No stops found for this route</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}