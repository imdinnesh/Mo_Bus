 "use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectTripFormValues, SelectTripSchema } from "@/schemas/trip";
import { useRouteDetail } from "@/hooks/useRouteDetail";
import { useEffect, useMemo, useState } from "react";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function SelectTripPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const routeId = searchParams.get("routeId");
    const { data: routeDetails, isLoading } = useRouteDetail(routeId || "");

    const [startIndex, setStartIndex] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SelectTripFormValues>({
        resolver: zodResolver(SelectTripSchema),
    });

    const onSubmit = (data: SelectTripFormValues) => {
        if (!routeId) return;

        router.push(
            `/select-seat?routeId=${routeId}&startStopId=${data.startStop}&endStopId=${data.endStop}`
        );
    };

    const startStopId = watch("startStop");

    useEffect(() => {
        if (!routeDetails) return;
        const index = routeDetails.RouteStops.find(
            (s) => s.Stop.id.toString() === startStopId
        )?.stop_index;
        setStartIndex(index ?? null);
        setValue("endStop", "");
    }, [startStopId, routeDetails, setValue]);

    const stops = useMemo(() => routeDetails?.RouteStops || [], [routeDetails]);

    const filteredEndStops = useMemo(() => {
        if (startIndex === null) return [];
        return stops.filter((s) => s.stop_index > startIndex);
    }, [startIndex, stops]);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Label htmlFor="routeId" className="block">
                    Route ID
                </Label>
                <Input
                    id="routeId"
                    {...register("routeNumber")}
                    defaultValue={routeDetails?.route_number || ""}
                    className="w-full"
                    readOnly
                />
                {errors.routeNumber && (
                    <p className="text-red-500 text-sm">
                        {errors.routeNumber.message || "Route ID is required"}
                    </p>
                )}

                <Label htmlFor="startStop" className="block">
                    Start Stop
                </Label>
                <Controller
                    name="startStop"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a start stop" />
                            </SelectTrigger>
                            <SelectContent>
                                {stops.map((s) => (
                                    <SelectItem key={s.id} value={s.Stop.id.toString()}>
                                        {s.Stop.stop_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.startStop && (
                    <p className="text-red-500 text-sm">
                        {errors.startStop.message || "Start stop is required"}
                    </p>
                )}

                <Label htmlFor="endStop" className="block">
                    End Stop
                </Label>
                <Controller
                    name="endStop"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ""}
                            disabled={startIndex === null}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an end stop" />
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
                    <p className="text-red-500 text-sm">
                        {errors.endStop.message || "End stop is required"}
                    </p>
                )}

                <Button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Next
                </Button>
            </form>
        </div>
    );
}
