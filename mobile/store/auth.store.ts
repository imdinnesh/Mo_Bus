import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
    email: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    setEmail: (email: string) => void;
    setAccessToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            email: null,
            accessToken: null,
            refreshToken: null,
            setEmail: (email) => set({ email }),
            setAccessToken: (token) => set({ accessToken: token }),
            setRefreshToken: (token) => set({ refreshToken: token }),
            logout: () => set({ email: null, accessToken: null, refreshToken: null }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);
