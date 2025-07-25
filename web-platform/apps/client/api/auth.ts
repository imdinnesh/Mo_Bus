import { axiosInstance } from "@workspace/shared/lib/axios";

interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

interface LoginPayload {
    email: string;
    password: string;
    device_id: string;
}

interface OtpVerifyPayload {
    email: string;
    otp: string;
}

interface OtpResendPayload {
    email: string;
}

export const signup = async (payload: SignupPayload) => {
    const response = await axiosInstance.post("/user/signup", payload);
    return response.data;
}

export const login = async (payload: LoginPayload) => {
    const response = await axiosInstance.post("/user/signin", payload);
    return response.data;
}

export const otpverify=async(payload:OtpVerifyPayload)=>{
    const response = await axiosInstance.post("/user/verify-email", payload);
    return response.data;
}

export const otpResend = async (payload: OtpResendPayload) => {
    const response = await axiosInstance.post("/user/resend-otp", payload);
    return response.data;
}