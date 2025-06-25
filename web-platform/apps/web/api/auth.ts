import { useAuthStore } from "@/store/auth-store";
import { axiosInstance } from "@workspace/shared/lib/axios";
interface LoginPayload {
    email: string;
    password: string;
    device_id: string;
}

export const login = async (payload: LoginPayload) => {
    const response = await axiosInstance.post("/admin/signin", payload);
    return response.data;
}

export const logout= async () => {
    const response = await axiosInstance.post("/admin/logout",{
    },{
        headers:{
            "Content-Type": "application/json",
            "Authorization":useAuthStore.getState().accessToken
        }
    });
    return response.data;
}