import { useMutation } from "@tanstack/react-query";
import { LoginService, SendVerificationCodeService, SignupService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner-native";

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

        onError: async (error: any, variables) => {
            const status = error?.status;

            // CASE: User not verified → send OTP automatically
            if (status === 403 && variables?.email) {
                try {
                    const result = await SendVerificationCodeService(variables.email);
                    setEmail(variables.email);
                    toast.success("We sent you a verification code.");
                    // Return a special flag to UI
                    // throw { message: "USER_NOT_VERIFIED", redirectToVerify: true };
                } catch (err:any) {
                    toast.error(err.response.data.error||"Failed to send OTP. Try again.");
                }
            }

            // Normal error fallback
            throw error;
        },
    });
};

export const useSignup = () => {
    const setEmail = useAuthStore((state) => state.setEmail);

    return useMutation({
        mutationKey: ["signup"],
        mutationFn: SignupService,

        onSuccess: (data, variables) => {
            // variables = payload sent to SignupService
            if (variables?.email) setEmail(variables.email);
        },
        onError: (error: any) => {
            const status = error?.response?.status;
            console.log("HTTP Status:", status);
        }
    })
}
