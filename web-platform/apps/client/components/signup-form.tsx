"use client"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { signup } from "@/api/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getDeviceId } from "@/lib/device"
import { saveOTPSession } from "@/utils/auth.utils"
import { SignupFormValues, signupSchema } from "@workspace/shared/schemas/auth"

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    })

    const mutation = useMutation({
        mutationFn: signup,
        onSuccess: (data, variables) => {
            toast.success(data.message || "Account created successfully!")
            saveOTPSession({
                otpSentAt: Date.now(),
                resendCooldownStartedAt: Date.now(),
            })
            router.push("/verify?email=" + variables.email)
        },
        onError: (error: any,variables) => {
            if (error.response.status===403){
                toast.info(error.response.data.error || "Please verify your email first.")
                router.push("/verify?email=" + variables.email)
                return
            }
            toast.error(error.response?.data?.error || "Something went wrong, please try again later.")
        },
    })

    const onSubmit = (data: SignupFormValues) => {
        mutation.mutate(data)
    }

    const handleGoogleLogin = () => {
        const device_id = getDeviceId()
        window.location.href = `http://localhost:8080/api/v1/auth/google/login?device_id=${device_id}`
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="johndoe@example.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                    {mutation.isPending ? "Signing up..." : "Signup"}
                                </Button>
                                <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
                                    Signup with Google
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="underline underline-offset-4">
                                Sign in
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
