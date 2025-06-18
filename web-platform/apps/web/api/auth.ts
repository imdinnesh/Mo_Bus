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