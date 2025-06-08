"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectTripFormValues, SelectTripSchema } from "@/schemas/trip";
import { useRouteDetail } from "@/hooks/useRouteDetail";
import { useRoutes } from "@/hooks/useRoutes";
import { useRouteSearch } from "@/hooks/useRouteSearch";
import { useEffect, useMemo, useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SelectTripPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [startIndex, setStartIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoute, setSelectedRoute] = useState<{
        id: string;
        route_number: string;
        route_name?: string;
    } | null>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const { data: routesMap, isLoading: isRoutesLoading } = useRoutes();
    const { searchRoutes, routesArray } = useRouteSearch(routesMap || {});
    const searchResults = useMemo(() => searchRoutes(searchQuery), [searchQuery, searchRoutes]);

    const routeId = searchParams.get("routeId") ?? selectedRoute?.id ?? "";
    const { data: routeDetails, isLoading: isRouteDetailsLoading } = useRouteDetail(routeId);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SelectTripFormValues>({
        resolver: zodResolver(SelectTripSchema),
        defaultValues: {
            routeNumber: "",
            startStop: "",
            endStop: "",
        },
    });

    const startStopId = watch("startStop");
    const endStopId = watch("endStop");

    // Update form route number when route details are loaded
    useEffect(() => {
        if (routeDetails) {
            setSelectedRoute({
                id: routeDetails.id.toString(),
                route_number: routeDetails.route_number,
                route_name: routeDetails.route_name,
            });
            setValue("routeNumber", routeDetails.route_number);
        }
    }, [routeDetails, setValue]);

    // Update startIndex and clear endStop when startStop changes
    useEffect(() => {
        if (!routeDetails) return;
        const index = routeDetails.RouteStops.find(
            (s) => s.Stop.id.toString() === startStopId
        )?.stop_index;
        setStartIndex(index ?? null);
        if (startStopId !== watch("startStop")) {
            setValue("endStop", "");
        }
    }, [startStopId, routeDetails, setValue, watch]);

    const stops = useMemo(() => routeDetails?.RouteStops || [], [routeDetails]);

    const filteredEndStops = useMemo(() => {
        if (startIndex === null) return [];
        return stops.filter((s) => s.stop_index > startIndex);
    }, [startIndex, stops]);

    const onSubmit = (data: SelectTripFormValues) => {
        if (!routeId) return;
        router.push(
            `/select-ticket?routeId=${routeId}&startStopId=${data.startStop}&endStopId=${data.endStop}`
        );
    };

    const handleRouteSelect = (route: { id: string; route_number: string; route_name?: string }) => {
        setSelectedRoute(route);
        setSearchQuery("");
        router.replace(`?routeId=${route.id}`);
    };

    const handleClearSelection = () => {
        setSelectedRoute(null);
        setValue("routeNumber", "");
        setValue("startStop", "");
        setValue("endStop", "");
        router.replace("/select-trip");
    };

    const isLoading = isRouteDetailsLoading || isRoutesLoading;

    return (
        <div className="max-w-xl mx-auto mt-6 md:mt-10 p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                        Plan Your Journey
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Route Search UI */}
                    {!routeId && (
                        <div className="mb-6 space-y-2">
                            <Label htmlFor="routeSearch">Find Your Route</Label>
                            <div className="relative">
                                <Input
                                    id="routeSearch"
                                    placeholder="Search by route number or name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                    className="mt-1 pl-10"
                                />
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                            {isRoutesLoading && (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </div>
                            )}
                            {(isSearchFocused || searchQuery) && searchResults.length > 0 && (
                                <ul className="mt-2 border rounded-lg shadow-sm max-h-60 overflow-auto divide-y">
                                    {searchResults.map((route) => (
                                        <li
                                            key={route.id}
                                            onClick={() => handleRouteSelect(route)}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="font-medium">Route {route.route_number}</div>
                                            <div className="text-sm text-muted-foreground">{route.route_name}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {searchQuery && searchResults.length === 0 && !isRoutesLoading && (
                                <div className="mt-2 text-center text-sm text-muted-foreground py-4">
                                    No routes found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}

                    {/* Selected Route Info */}
                    {selectedRoute && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">Route {selectedRoute.route_number}</h3>
                                    {selectedRoute.route_name && (
                                        <p className="text-sm text-muted-foreground">{selectedRoute.route_name}</p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearSelection}
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Change Route
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Only show Route Number field when a route is selected */}
                        {selectedRoute && (
                            <div className="space-y-2">
                                <Label htmlFor="routeNumber">Route Number</Label>
                                <Input
                                    id="routeNumber"
                                    {...register("routeNumber")}
                                    value={watch("routeNumber") || ""}
                                    readOnly
                                    className="w-full"
                                />
                                {errors.routeNumber && (
                                    <p className="text-sm text-red-500">{errors.routeNumber.message}</p>
                                )}
                            </div>
                        )}

                        {/* Start Stop */}
                        {selectedRoute && (
                            <div className="space-y-2">
                                <Label htmlFor="startStop">Boarding Point</Label>
                                <Controller
                                    name="startStop"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ""}
                                            disabled={!routeDetails || isRouteDetailsLoading}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select boarding stop" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {isRouteDetailsLoading ? (
                                                    <div className="flex justify-center py-4">
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    </div>
                                                ) : stops.length === 0 ? (
                                                    <div className="text-sm text-muted-foreground py-4 text-center">
                                                        No stops available
                                                    </div>
                                                ) : (
                                                    stops.map((s) => (
                                                        <SelectItem key={s.id} value={s.Stop.id.toString()}>
                                                            {s.Stop.stop_name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.startStop && (
                                    <p className="text-sm text-red-500">{errors.startStop.message}</p>
                                )}
                            </div>
                        )}

                        {/* End Stop */}
                        {selectedRoute && (
                            <div className="space-y-2">
                                <Label htmlFor="endStop">Destination Point</Label>
                                <Controller
                                    name="endStop"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ""}
                                            disabled={startIndex === null || filteredEndStops.length === 0}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        startIndex === null
                                                            ? "Select boarding point first"
                                                            : filteredEndStops.length === 0
                                                                ? "No available destinations"
                                                                : "Select destination stop"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredEndStops.map((s) => (
                                                    <SelectItem key={s.id} value={s.Stop.id.toString()}>
                                                        {s.Stop.stop_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.endStop && (
                                    <p className="text-sm text-red-500">{errors.endStop.message}</p>
                                )}
                            </div>
                        )}

                        {selectedRoute && (
                            <Button
                                type="submit"
                                className="w-full mt-4"
                                disabled={
                                    isLoading ||
                                    isSubmitting ||
                                    !startStopId ||
                                    !endStopId ||
                                    !routeDetails
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Continue to Tickets"
                                )}
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}