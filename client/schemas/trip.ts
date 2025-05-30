import { z } from 'zod';

export const tripSchema=z.object({
    start: z.string().min(1, "Start location is required"),
    end: z.string().min(1, "End location is required"),
    route: z.string().min(1, "Route number is required"),
})

export type TripFormValues = z.infer<typeof tripSchema>;