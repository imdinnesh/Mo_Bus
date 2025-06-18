"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { addStopPayload, addStopSchema } from "@/api/stop";
import { useAddStops } from "@/hooks/stops-hooks";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Loader2 } from "lucide-react";

export function SingleStopForm() {
    const form = useForm<addStopPayload>({
        resolver: zodResolver(addStopSchema),
        defaultValues: {
            stop_name: "",
        },
    });

    const mutation = useAddStops();

    const onSubmit = (data: addStopPayload) => {
            mutation.mutate(data, {
                onSuccess: () => {
                    form.reset();
                    toast.success("Stop added successfully!");
                },
                onError: (error) => {
                    toast.error(`An error occurred: ${error.message || 'Could not add stop.'}`)
                },
            });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="stop_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stop Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., KIIT Square" {...field} />
                            </FormControl>
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
                        "Add Stop"
                    )}
                </Button>
            </form>
        </Form>
    );
}