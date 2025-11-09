import { api } from "@/lib/axios";
import { LoginFormData, SignupFormData } from "@/schemas/auth.schema";

export const LoginService = async (payload: LoginFormData) => {
    const response = await api.post("/user/signin", {
        email: payload.email,
        password: payload.password
    })
    return response.data;
}

export const SignupService = async (payload: SignupFormData) => {
    const response = await api.post("/user/signup", payload)
    return response.data;
}