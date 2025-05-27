import { axiosInstance } from "@/lib/axios";

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

export const signup = async (payload: SignupPayload) => {
    const response = await axiosInstance.post("/user/signup", payload);
    return response.data;
}

export const login = async (payload: LoginPayload) => {
    const response = await axiosInstance.post("/user/signin", payload);
    return response.data;
}