"use client";
import { TripFormValues, tripSchema } from "@/schemas/trip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
export function TripForm({ start, end, route }: OptionalTripSearchParams) {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TripFormValues>({
        resolver: zodResolver(tripSchema),
        defaultValues: {
            start: start || "",
            end: end || "",
            route: route || ""
        }
    })

    const onSubmit = (data: TripFormValues) => {
        console.log("Submitted data:", data);
    };


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="routeNumber">Route Number</Label>
                        <Input
                            id="routeNumber"
                            type="text"
                            placeholder="Enter Route Number"
                            {...register("route")}
                        />
                        {errors.route && (
                            <p className="text-sm text-red-500">{errors.route.message}</p>
                        )}
                    </div>
                    <div className="grid gap-3">
                        <div className="flex items-center">
                            <Label htmlFor="startStop">Start Stop</Label>
                        </div>
                        <Input
                            id="startStop"
                            type="text"
                            placeholder="Enter Start Stop"
                            {...register("start")}
                        />
                        {errors.start && (
                            <p className="text-sm text-red-500">{errors.start.message}</p>
                        )}
                    </div>
                    <div className="grid gap-3">
                        <div className="flex items-center">
                            <Label htmlFor="endStop">Start Stop</Label>
                        </div>
                        <Input
                            id="endStop"
                            type="text"
                            placeholder="Enter End Stop"
                            {...register("end")}
                        />
                        {errors.end && (
                            <p className="text-sm text-red-500">{errors.end.message}</p>
                        )}
                    </div>
                </div>
                <Button
                    type="submit"
                >Next</Button>
            </form>

        </div>
    );
}