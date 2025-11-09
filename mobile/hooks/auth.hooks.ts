import { useMutation } from "@tanstack/react-query";
import { LoginService, SignupService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export const useLogin = () => {
    const setEmail = useAuthStore((state) => state.setEmail);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setRefreshToken = useAuthStore((state) => state.setRefreshToken);

    return useMutation({
        mutationKey: ["login"],
        mutationFn: LoginService,

        onSuccess: (data, variables) => {
            // variables = payload sent to LoginService
            if (variables?.email) setEmail(variables.email);
            if (data?.access_token) setAccessToken(data.access_token);
            if (data?.refresh_token) setRefreshToken(data.refresh_token);
        },

        onError: (error: any) => {
            console.error("Login failed:", error);
        },
    });
};

export const useSignup=()=>{
    const setEmail = useAuthStore((state) => state.setEmail);

    return useMutation({
        mutationKey: ["signup"],
        mutationFn:SignupService,
        
        onSuccess: (data, variables) => {
            // variables = payload sent to SignupService
            if (variables?.email) setEmail(variables.email);
        },
        onError: (error: any) => {
            console.error("Signup failed:", error);
        }
    })
}
