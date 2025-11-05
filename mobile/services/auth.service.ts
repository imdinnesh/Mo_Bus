import { api } from "@/lib/axios";
import { LoginFormData } from "@/schemas/auth.schema";

export const LoginService = async (payload: LoginFormData) => {
    const response = await api.post("/user/signin", {
        email: payload.email,
        password: payload.password
    })
    return response.data;
}