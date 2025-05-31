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

