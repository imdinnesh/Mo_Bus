// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, otpResend, otpverify, signup } from "@/api/auth";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;

    signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
    login: (payload: { email: string; password: string; device_id: string }) => Promise<void>;
    verifyOtp: (payload: { email: string; otp: string }) => Promise<void>;
    resendOtp: (payload: { email: string }) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: false,
            error: null,

            signup: async (payload) => {
                set({ loading: true, error: null });
                try {
                    const data = await signup(payload);
                    set({ user: data.user, token: data.token, loading: false });
                } catch (err: any) {
                    set({
                        error: err.response?.data?.message || "Signup failed",
                        loading: false,
                    });
                }
            },

            login: async (payload) => {
                set({ loading: true, error: null });
                try {
                    const data = await login(payload);
                    set({ user: data.user, token: data.token, loading: false });
                } catch (err: any) {
                    set({
                        error: err.response?.data?.message || "Login failed",
                        loading: false,
                    });
                }
            },

            verifyOtp: async (payload) => {
                set({ loading: true, error: null });
                try {
                    const data = await otpverify(payload);
                    set({ user: data.user, token: data.token, loading: false });
                } catch (err: any) {
                    set({
                        error: err.response?.data?.message || "OTP verification failed",
                        loading: false,
                    });
                }
            },

            resendOtp: async (payload) => {
                set({ loading: true, error: null });
                try {
                    await otpResend(payload);
                    set({ loading: false });
                } catch (err: any) {
                    set({
                        error: err.response?.data?.message || "Failed to resend OTP",
                        loading: false,
                    });
                }
            },

            logout: () => {
                set({ user: null, token: null });
            },
        }),
        {
            name: "auth-storage", // storage key
            storage: {
                getItem: async (name) => {
                    const item = await AsyncStorage.getItem(name);
                    return item ? JSON.parse(item) : null;
                },
                setItem: async (name, value) => {
                    await AsyncStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: async (name) => {
                    await AsyncStorage.removeItem(name);
                },
            },
        }
    )
);
