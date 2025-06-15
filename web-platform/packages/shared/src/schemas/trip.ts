import { z } from 'zod';
export const tripSchema = z.object({
    start: z.string().min(1, "Start location is required"),
    end: z.string().min(1, "End location is required"),
    route: z.string().min(1, "Route number is required"),
})

export type TripFormValues = z.infer<typeof tripSchema>;

export const SearchSchema = z.object({
    query: z.string().min(1, 'Please enter a route number or stop name')
})

export type SearchFormValues = z.infer<typeof SearchSchema>;

export const SelectTripSchema = z.object({
    routeNumber: z.string(),
    startStop: z.string().min(1, "Start stop is required"),
    endStop: z.string().min(1, "End stop is required"),
})

export type SelectTripFormValues = z.infer<typeof SelectTripSchema>;


export const tripPlannerSchema = z.object({
    sourceId: z.string().min(1, "Source stop is required"),
    destinationId: z.string().min(1, "Destination stop is required"),
})
export type TripPlannerFormValues = z.infer<typeof tripPlannerSchema>;