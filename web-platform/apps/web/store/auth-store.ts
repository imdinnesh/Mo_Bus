import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    clearAccessToken: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            setAccessToken: (token) => set({ accessToken: token }),
            clearAccessToken: () => set({ accessToken: null }),
        }),
        {
            name: "access-token-storage",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ accessToken: state.accessToken }),
        }
    )
);
