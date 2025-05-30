"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from 'next/navigation'
import type { z } from "zod"
import { otpSchema } from "@/schemas/auth"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormDescription, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form"
import {
  InputOTP, InputOTPGroup, InputOTPSlot
} from "@/components/ui/input-otp"

import { useMutation } from "@tanstack/react-query"
import { otpResend, otpverify } from "@/api/auth"

import {
  getOTPSession, saveOTPSession, clearOTPSession, isOTPValid,
  isResendAllowed, formatTime, getTimeRemaining, getCooldownRemaining,
  createOTPSession, updateCooldownInSession,
  OTP_VALIDITY_DURATION, RESEND_COOLDOWN_DURATION,
} from "@/utils/auth_utils"

export function VerifyForm() {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const router=useRouter()

  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  if (!email) {
    toast.error("Email is required for OTP verification.")
    return null
  }

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  useEffect(() => {
    const session = getOTPSession()
    if (session) {
      setTimeRemaining(Math.floor(getTimeRemaining(session) / 1000))
      setResendCooldown(Math.floor(getCooldownRemaining(session) / 1000))
    }
    setIsLoaded(true)
  }, [])

  // OTP expiry countdown
  useEffect(() => {
    if (!isLoaded || timeRemaining <= 0) return
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const updated = prev - 1
        if (updated <= 0) clearOTPSession()
        return updated
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeRemaining, isLoaded])

  // Resend cooldown countdown
  useEffect(() => {
    if (!isLoaded || resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        const updated = prev - 1
        if (updated <= 0) updateCooldownInSession()
        return updated
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown, isLoaded])

  const verifyMutation = useMutation({
    mutationFn: otpverify,
    onSuccess: (data) => {
      toast.success(data.message || "OTP verified successfully!")
      router.push("/dashboard")
      clearOTPSession()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "OTP verification failed. Please try again.")
    },
  })

  const resendMutation = useMutation({
    mutationFn: otpResend,
    onSuccess: (data) => {
      handleResendOTP()
      toast.success(data.message || "OTP resent successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to resend OTP. Please try again.")
    },
  })

  const handleResendOTP = () => {
    createOTPSession()
    setTimeRemaining(OTP_VALIDITY_DURATION / 1000)
    setResendCooldown(RESEND_COOLDOWN_DURATION / 1000)
    form.reset()
  }

  const startNewOTPSession = () => {
    resendMutation.mutate({ email })
  }

  const onSubmit = (data: z.infer<typeof otpSchema>) => {
    if (timeRemaining <= 0) {
      toast.error("OTP has expired. Please request a new one.")
      return
    }
    verifyMutation.mutate({ email, otp: data.otp })
  }

  if (!isLoaded) return <div className="w-2/3">Loading...</div>

  if (timeRemaining <= 0) {
    return (
      <div className="w-2/3 space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium">No active OTP session</h3>
          <p className="text-sm text-muted-foreground">
            Request a new OTP to continue with verification
          </p>
          <Button onClick={startNewOTPSession} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Send OTP
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <div className="flex justify-between items-center">
          <FormLabel className="text-base">One-Time Password</FormLabel>
          <div className={`text-sm font-medium ${timeRemaining < 30 ? "text-red-500" : ""}`}>
            Valid for: {formatTime(timeRemaining)}
          </div>
        </div>

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => resendMutation.mutate({ email })}
            disabled={resendCooldown > 0}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
