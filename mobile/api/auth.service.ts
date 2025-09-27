import { axiosClient } from "@/config/axios";
import { OtpFormData, SignupFormData } from "@/schemas/auth.schema";
import { email } from "zod";

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

export const resendOtpService = async (email: string) =>{
    try{
        const response=await axiosClient.post("/user/resend-otp",{
            email
        })

        return {
            success: true,
            data:response.data
        }
    }
    catch(error:any){
        return {
            success: false,
            data: undefined,
            message: error?.response.data.error || "Resend OTP failed",
            error: error?.response.data.error || "Unknown error",
        }
    }
}
