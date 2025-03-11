"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Wallet, IndianRupee, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const PRESET_AMOUNTS = [10, 20, 50, 100]

export const RechargeCard = () => {
    const [amount, setAmount] = useState<number | string>("")
    const [loading, setLoading] = useState(false)
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handlePresetClick = (value: number) => {
        setAmount(value)
        setSelectedPreset(value)
        setError(null)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        // Allow empty input or valid numbers
        if (value === "" || /^\d+$/.test(value)) {
            setAmount(value)
            setSelectedPreset(null)
            setError(null)
        }
    }

    const validateAmount = (): boolean => {
        const numAmount = Number(amount)

        if (!amount) {
            setError("Please enter an amount")
            return false
        }

        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount")
            return false
        }

        if (numAmount > 1000) {
            setError("Maximum recharge amount is $1000")
            return false
        }

        return true
    }

    const handleRecharge = async () => {
        if (!validateAmount()) return

        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const token = sessionStorage.getItem("token")
            const response = await axios.post(
                "http://localhost:8080/payment/add",
                {
                    amount: Number(amount),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                },
            )

            if (response.statusText === "OK") {
                setSuccess(true)
                toast.success(response.data.message || "Money added successfully")
                // Reset form after successful recharge
                setTimeout(() => {
                    setAmount("")
                    setSelectedPreset(null)
                    setSuccess(false)
                }, 3000)
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.error
                setError(errorMessage)
                toast.error(errorMessage)
            } else {
                setError("An error occurred while adding money")
                toast.error("An error occurred while adding money")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="shadow-md">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                        <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Add Money to Your Account</CardTitle>
                        <CardDescription>Recharge your balance to purchase tickets</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Preset amounts */}
                <div className="space-y-2">
                    <Label>Quick Select Amount</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PRESET_AMOUNTS.map((preset) => (
                            <Button
                                key={preset}
                                type="button"
                                variant={selectedPreset === preset ? "default" : "outline"}
                                className={cn("h-12 text-lg font-medium", selectedPreset === preset && "ring-2 ring-primary/20")}
                                onClick={() => handlePresetClick(preset)}
                            >
                                ₹{preset}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Custom amount */}
                <div className="space-y-2">
                    <Label htmlFor="amount">Custom Amount</Label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            id="amount"
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={handleInputChange}
                            className={cn("pl-10 h-12 text-lg", error ? "border-destructive focus-visible:ring-destructive" : "")}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 text-primary text-sm mt-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Payment successful! Your balance has been updated.
                        </div>
                    )}
                </div>

                {/* Payment method section */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h3 className="font-medium flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Method
                    </h3>
                    <div className="flex items-center gap-3 bg-background rounded-md p-3 border">
                        <div className="h-8 w-12 bg-primary/10 rounded flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-muted-foreground text-xs">Secure payment via our payment processor</div>
                        </div>
                        <div className="ml-auto">
                            <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
                <Button onClick={handleRecharge} disabled={loading || success} className="w-full h-12 text-lg font-medium">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : success ? (
                        <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Payment Successful
                        </>
                    ) : (
                        <>Add ${amount || "0"} to Balance</>
                    )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                    By proceeding, you agree to our terms of service and payment processing policies.
                </p>
            </CardFooter>
        </Card>
    )
}

