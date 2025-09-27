import { axiosClient } from "@/config/axios";
import { SignupFormData } from "@/schemas/auth.schema";

export const signupService = async (
    payload: SignupFormData
) => {
    try {
        const response = await axiosClient.post("/user/signup", {
            name: payload.name,
            email: payload.email,
            password: payload.password,
        });

        return {
            success: true,
            data: response.data,
            message: "Signup successful",
            error: null,
        };
    } 
    catch (error: any) {
        return {
            success: false,
            data: undefined,
            message: error?.response.data.error || "Signup failed",
            error: error?.response.data.error || "Unknown error",
        };
    }
};
