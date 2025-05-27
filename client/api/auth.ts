import { axiosInstance } from "@/lib/axios";

interface SignupPayload{
    name: string;
    email: string;
    password: string;
}

export const signup = async (payload: SignupPayload) => {
    const response =await axiosInstance.post("/user/signup",payload);
    return response.data;
}