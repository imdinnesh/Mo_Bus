import { axiosClient } from "@/config/axios";
import { SignupFormData } from "@/schemas/auth.schema";

export interface ApiError {
    message: string; // Orchestration message
    status?: number; // HTTP status code
    statusDesc?: string; // From server response
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
}

export const signupService = async (
    payload: SignupFormData
): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosClient.post("/user/signup", payload);
        return {
            success: true,
            data: response.data,
            message: response.data.message || "Signup successful",
        };
    } catch (error: any) {
        // User is not verified, redirect to verification screen
        if (error.response && error.response.status === 403) {
            throw {
                message: "USER_NOT_VERIFIED",
                status: 403,
                statusDesc: error.response.data?.error,
            } as ApiError;
        }

        throw {
            message: error?.response?.data?.error || "Signup failed",
            status: error?.response?.status,
        } as ApiError;
    }
};

export const sendOtpService = async (email: string): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosClient.post("/user/resend-otp", {
            email: email
        });

        return {
            success: true,
            data: response.data,
            message: response.data.message || "OTP sent successfully"
        };
    } catch (error: any) {
        throw {
            message: "SEND_OTP_FAILED",
            status: error?.response?.status,
            statusDesc: error?.response?.data?.error
        } as ApiError;
    }
};

export const verifyOtpService = async (email: string, otp: string): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosClient.post("/user/verify-email", {
            email: email,
            otp: otp
        });

        return {
            success: true,
            data: response.data,
            message: response.data.message || "OTP verified successfully"
        };
    } catch (error: any) {
        throw {
            message: "VERIFY_OTP_FAILED",
            status: error?.response?.status,
            statusDesc: error?.response?.data?.error
        } as ApiError;
    }
}


