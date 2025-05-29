"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from 'next/navigation'
import type { z } from "zod"

import { otpSchema } from "@/schemas/auth"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp"
import { useMutation } from "@tanstack/react-query"
import { otpResend, otpverify } from "@/api/auth"

interface OTPSession {
  otpSentAt: number
  resendCooldownStartedAt?: number
}

const OTP_VALIDITY_DURATION = 5 * 60 * 1000 // 5 minutes in ms
const RESEND_COOLDOWN_DURATION = 30 * 1000 // 30 seconds in ms

export function VerifyForm() {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  if (!email) {
    toast.error("Email is required for OTP verification.")
    return null
  }

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  useEffect(() => {
    const savedSession = localStorage.getItem("otp-session")

    if (savedSession) {
      try {
        const session: OTPSession = JSON.parse(savedSession)
        const now = Date.now()

        const otpElapsed = now - session.otpSentAt
        const otpRemaining = Math.max(0, OTP_VALIDITY_DURATION - otpElapsed)
        setTimeRemaining(Math.floor(otpRemaining / 1000))

        if (session.resendCooldownStartedAt) {
          const cooldownElapsed = now - session.resendCooldownStartedAt
          const cooldownRemaining = Math.max(0, RESEND_COOLDOWN_DURATION - cooldownElapsed)
          setResendCooldown(Math.floor(cooldownRemaining / 1000))
        }
      } catch (error) {
        console.error("Error parsing OTP session:", error)
        localStorage.removeItem("otp-session")
      }
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const updated = prev - 1
        if (updated <= 0) localStorage.removeItem("otp-session")
        return updated
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, isLoaded])

  useEffect(() => {
    if (!isLoaded || resendCooldown <= 0) return

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        const updated = prev - 1
        if (updated <= 0) {
          const savedSession = localStorage.getItem("otp-session")
          if (savedSession) {
            try {
              const session: OTPSession = JSON.parse(savedSession)
              delete session.resendCooldownStartedAt
              localStorage.setItem("otp-session", JSON.stringify(session))
            } catch (error) {
              console.error("Error updating session:", error)
            }
          }
        }
        return updated
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown, isLoaded])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const mutation=useMutation({
    mutationFn:otpverify,
    onSuccess:(data)=>{
      toast.success(data.message || "OTP verified successfully!")
      localStorage.removeItem("otp-session")
    },
    onError:(error:any)=>{
      toast.error(error.response.data.error || "OTP verification failed. Please try again.")
    },

  })

  const resendMutation=useMutation({
    mutationFn:otpResend,
    onSuccess:(data)=>{
      handleResendOTP()
      toast.success(data.message || "OTP resent successfully!")
    },
    onError:(error:any)=>{
      toast.error(error.response.data.error || "Failed to resend OTP. Please try again.")
    }
  })


  const handleResendOTP = () => {
    const now = Date.now()

    const session: OTPSession = {
      otpSentAt: now,
      resendCooldownStartedAt: now,
    }

    localStorage.setItem("otp-session", JSON.stringify(session))
    setTimeRemaining(OTP_VALIDITY_DURATION / 1000)
    setResendCooldown(RESEND_COOLDOWN_DURATION / 1000)
    form.reset()
    resendMutation.mutate({
      email:email
    })
  }

  const startNewOTPSession = () => {
    const now = Date.now()

    const session: OTPSession = {
      otpSentAt: now,
    }

    localStorage.setItem("otp-session", JSON.stringify(session))
    setTimeRemaining(OTP_VALIDITY_DURATION / 1000)

    toast.success("OTP sent to your email")
  }

  const onSubmit = (data: z.infer<typeof otpSchema>) => {
    if (timeRemaining <= 0) {
      toast.error("OTP has expired. Please request a new one.")
      return
    }

    if (!email) {
      toast.error("Email is required for OTP verification.")
      return
    }
    mutation.mutate({
      email:email,
      otp:data.otp
    })

  }



  if (!isLoaded) {
    return <div className="w-2/3">Loading...</div>
  }

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
            onClick={handleResendOTP}
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
