import axios from "axios";
import { API_BASE } from "@/config/env";

export const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});

api.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);
