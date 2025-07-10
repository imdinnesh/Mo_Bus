"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CirclePlus, Loader2 } from "lucide-react";

import { updateBalance } from "@/api/payment";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";

// 1. Define the Zod schema. It remains our single source of truth for validation rules.
// We no longer need z.coerce because react-hook-form will handle the conversion for us.
const rechargeSchema = z.object({
    amount: z
        .number({
            required_error: "Please enter an amount.",
            invalid_type_error: "Please enter a valid number.",
        })
        .min(10, { message: "Minimum recharge amount is ₹10." })
        .max(10000, { message: "Maximum recharge amount is ₹10,000." }),
});

type RechargeFormValues = z.infer<typeof rechargeSchema>;

// --- Main Page Component ---
export default function RechargeCardPage() {
    // 2. Set up the form using the resolver, but we will use `register` directly.
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RechargeFormValues>({
        resolver: zodResolver(rechargeSchema),
    });

    const mutation = useMutation({
        mutationKey: ["updateBalance"],
        mutationFn: updateBalance,
        onSuccess: (data) => {
            toast.success(data.message || "Balance updated successfully!");
            // Reset the form by setting the value to an empty string to clear the input
            setValue("amount", "" as any);
        },
        onError: (error: any) => {
            toast.error("Failed to update balance.", {
                description: error.response?.data?.error || "An unexpected error occurred.",
            });
        },
    });

    // 3. The `onSubmit` function receives the validated, correctly typed data.
    const onSubmit = (data: RechargeFormValues) => {
        mutation.mutate({ amount: data.amount });
    };

    const quickAddAmounts = [100, 200, 500, 1000];

    return (
        <main className="bg-background text-foreground min-h-screen">
            <div className="container mx-auto flex max-w-lg flex-col items-center justify-center p-4 py-8 md:py-12">
                <div className="flex flex-col items-center space-y-2 text-center mb-8">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CirclePlus className="h-10 w-10" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Add Money</h1>
                    <p className="max-w-md text-muted-foreground">
                        Enter an amount or select a quick option to recharge your wallet.
                    </p>
                </div>

                <Card className="w-full">
                    {/* 4. The form element uses `handleSubmit` which validates before calling `onSubmit` */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle>Recharge Amount</CardTitle>
                            <CardDescription>Select or enter the amount to add.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Quick Add Buttons */}
                            <div className="space-y-3">
                                <Label>Quick Add</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {quickAddAmounts.map((amount) => (
                                        <Button
                                            key={amount}
                                            type="button"
                                            variant="outline"
                                            onClick={() => setValue("amount", amount, { shouldValidate: true })}
                                        >
                                            ₹{amount}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Main amount input field using the direct `register` method */}
                            <div>
                                <Label htmlFor="recharge-amount">Or enter a custom amount</Label>
                                <div className="relative mt-2">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        ₹
                                    </span>
                                    <Input
                                        id="recharge-amount"
                                        type="number"
                                        placeholder="e.g., 150"
                                        className="h-14 pl-8 text-lg"
                                        // THIS IS THE KEY: We use `register` directly and tell it to parse the value as a number.
                                        {...register("amount", { valueAsNumber: true })}
                                    />
                                </div>
                                {/* Manually display the error message from the form state */}
                                {errors.amount && (
                                    <p className="text-sm font-medium text-destructive mt-2">
                                        {errors.amount.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full h-12 text-lg mt-3" size="lg" disabled={mutation.isPending}>
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Add Money to Wallet"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </main>
    );
}