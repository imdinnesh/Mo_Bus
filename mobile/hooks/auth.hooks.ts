import { LoginService } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {

    return useMutation({
        mutationKey: ['login'],
        mutationFn: LoginService,
        onSuccess: (data) => {
            console.log("Login successful", data)
        },
        onError: (error: any) => {
            console.log("Login failed", error)
        }
    })
}