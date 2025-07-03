"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import type { z } from "zod"
import { otpSchema } from "@/schemas/auth"
import { toast } from "sonner"
import { RefreshCw, Clock, Mail, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useMutation } from "@tanstack/react-query"
import { otpResend, otpverify } from "@/api/auth"

import {
  getOTPSession,
  clearOTPSession,
  formatTime,
  getTimeRemaining,
  getCooldownRemaining,
  createOTPSession,
  updateCooldownInSession,
  OTP_VALIDITY_DURATION,
  RESEND_COOLDOWN_DURATION,
} from "@/utils/auth.utils"

export function VerifyForm() {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const router = useRouter()

  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  if (!email) {
    toast.error("Email is required for OTP verification.")
    return null
  }

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
      setTimeRemaining((prev) => {
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
      setResendCooldown((prev) => {
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
      form.reset()
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

  if (!isLoaded) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading verification form...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (timeRemaining <= 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl">OTP Session Expired</CardTitle>
          <CardDescription>Your verification session has expired. Request a new OTP to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              A new OTP will be sent to <strong>{email}</strong>
            </AlertDescription>
          </Alert>
          <Button onClick={startNewOTPSession} className="w-full" disabled={resendMutation.isPending}>
            {resendMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Send New OTP
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Verify Your Email</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Time remaining</span>
                </div>
                <Badge variant={timeRemaining < 30 ? "destructive" : "secondary"} className="font-mono">
                  {formatTime(timeRemaining)}
                </Badge>
              </div>

              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            {[...Array(6)].map((_, i) => (
                              <InputOTPSlot key={i} index={i} className="w-12 h-12 text-lg" />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormDescription className="text-center">
                      Enter the verification code from your email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={verifyMutation.isPending || !form.watch("otp") || form.watch("otp").length !== 6}
              >
                {verifyMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Verify Code
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => resendMutation.mutate({ email })}
                disabled={resendCooldown > 0 || resendMutation.isPending}
                className="w-full"
              >
                {resendMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Resend in {resendCooldown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            {timeRemaining < 60 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Your code will expire soon. Request a new one if needed.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
