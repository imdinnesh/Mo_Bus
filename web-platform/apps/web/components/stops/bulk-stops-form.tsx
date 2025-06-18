"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { bulkAddStopsPayload, bulkAddStopsSchema } from "@/api/stop";
import { useAddStops } from "@/hooks/stops-hooks";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Loader2 } from "lucide-react";

export function BulkStopsForm() {
    const form = useForm<bulkAddStopsPayload>({
        resolver: zodResolver(bulkAddStopsSchema),
        defaultValues: {
            stops_list: "",
        },
    });

    // We reuse the same mutation hook, but will call it multiple times.
    const mutation = useAddStops();

    const onSubmit = async (data: bulkAddStopsPayload) => {
        // 1. Parse the input string into an array of stop names
        const stopNames = data.stops_list
            .split('\n')          // Split by new line
            .map(name => name.trim()) // Trim whitespace
            .filter(Boolean);      // Remove any empty lines

        if (stopNames.length === 0) {
            toast.error("No valid stop names provided.");
            return;
        }

        const mutationPromises = stopNames.map(name =>
            mutation.mutateAsync({ stop_name: name })
        );

        toast.promise(
            Promise.all(mutationPromises),
            {
                loading: `Adding ${stopNames.length} stops...`,
                success: () => {
                    form.reset(); // Clear the form on success
                    return `${stopNames.length} stops added successfully!`;
                },
                error: (err) => `An error occurred: ${err.message || 'Could not add stops.'}`,
            }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="stops_list"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stop Names</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="KIIT Square
Bhubaneswar Railway Station Jayadev Vihar"
                                    className="min-h-[150px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Enter one stop name per line. Empty lines will be ignored.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        `Add ${form.watch('stops_list').split('\n').filter(Boolean).length || 0} Stops`
                    )}
                </Button>
            </form>
        </Form>
    );
}