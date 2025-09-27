import { create } from "zustand";
import { SignupFormData } from "@/schemas/auth.schema";
import { signupService } from "@/api/auth.service";

interface AuthState {
    loading: boolean;
    error: string | null;
    data: any | null;
    signup: (payload: SignupFormData) => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    loading: false,
    error: null,
    data: null,

    signup: async (payload: SignupFormData) => {
        set({ loading: true, error: null });

        try {
            const result = await signupService(payload);

            if (result.success) {
                set({ data: result.data, loading: false, error: null });
            } else {
                set({ error: result.error || result.message, loading: false });
            }
        }
        // Error in the store will catch this
        catch (err: any) {
            console.log("Error in store", err);
            set({
                error: err || "Unexpected error",
                loading: false,
            });
        }
    },

    reset: () => set({ data: null, error: null, loading: false }),
}));
