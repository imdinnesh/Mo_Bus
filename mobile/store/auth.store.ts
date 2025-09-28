import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginFormData, SignupFormData } from "@/schemas/auth.schema";
import {
    signupService,
    sendOtpService,
    verifyOtpService,
    ApiError,
    loginService,
} from "@/api/auth.service";

interface AuthState {
    loading: boolean;
    error: string | null;
    email: string | null;

    signup: (
        payload: SignupFormData,
        opts?: {
            onSuccess?: (msg: string) => void;
            onOtpSent?: (msg: string) => void;
            onError?: (err: ApiError) => void;
        }
    ) => Promise<void>;

    resendOtp: (
        email?: string,
        opts?: {
            onSuccess?: (msg: string) => void;
            onError?: (err: ApiError) => void;
        }
    ) => Promise<void>;

    verifyOtp: (
        otp: string,
        email?: string,
        opts?: {
            onSuccess?: (msg: string) => void;
            onError?: (err: ApiError) => void;
        }
    ) => Promise<void>;

    login:(
        payload:LoginFormData,
        opts?:{
            onSuccess?:(msg:string)=>void;
            onError?:(err:ApiError)=>void;
        }
    ) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            loading: false,
            error: null,
            email: null,

            signup: async (payload, opts) => {
                set({ loading: true, error: null, email: payload.email });

                try {
                    const result = await signupService(payload);
                    set({ loading: false });
                    opts?.onSuccess?.(result.message);
                } catch (err: any) {
                    const error: ApiError = err;

                    if (error.message === "USER_NOT_VERIFIED") {
                        try {
                            const otpResult = await sendOtpService(payload.email);
                            set({ loading: false });
                            opts?.onOtpSent?.(otpResult.message);
                            return;
                        } catch (otpErr: any) {
                            set({ loading: false, error: otpErr.message });
                            opts?.onError?.(otpErr);
                            return;
                        }
                    }

                    set({ loading: false, error: error.message });
                    opts?.onError?.(error);
                }
            },

            resendOtp: async (email, opts) => {
                const targetEmail = email || get().email;
                if (!targetEmail) {
                    opts?.onError?.({ message: "Email not found in store" });
                    return;
                }

                set({ loading: true, error: null });
                try {
                    const result = await sendOtpService(targetEmail);
                    set({ loading: false });
                    opts?.onSuccess?.(result.message);
                } catch (err: any) {
                    const error: ApiError = err;
                    set({ loading: false, error: error.message });
                    opts?.onError?.(error);
                }
            },

            verifyOtp: async (otp, email, opts) => {
                const targetEmail = email || get().email;
                if (!targetEmail) {
                    opts?.onError?.({ message: "Email not found in store" });
                    return;
                }

                set({ loading: true, error: null });
                try {
                    const result = await verifyOtpService(targetEmail, otp);
                    set({ loading: false });
                    opts?.onSuccess?.(result.message);
                } catch (err: any) {
                    const error: ApiError = err;
                    set({ loading: false, error: error.message });
                    opts?.onError?.(error);
                }
            },

            login:async(payload,opts)=>{
                set({ loading: true, error: null, email: payload.email });
                try{
                    const result=await loginService(payload);
                    set({loading:false});
                    opts?.onSuccess?.(result.message);
                }catch(err:any){
                    const error:ApiError=err;
                    set({loading:false,error:error.message});
                    opts?.onError?.(error);
                }
            },
        }),
        {
            name: "auth-storage", // storage key
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                email: state.email, // persist only email for now
            }),
        }
    )
);
