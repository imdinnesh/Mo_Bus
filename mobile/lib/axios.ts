import axios from "axios";
import { API_BASE } from "@/config/env";
import { toast } from "sonner-native";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    // you can attach token or headers here later
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1️⃣ Handle network-level errors
    if (error.message === "Network Error" || !error.response) {
      toast.error("Network error — please check your internet connection.");
    }

    // 2️⃣ Handle timeout
    else if (error.code === "ECONNABORTED") {
      toast.error("Request timeout — please try again.");
    }

    // 3️⃣ Handle 5xx server errors
    else if (error.response?.status >= 500) {
      toast.error("Server error — please try again later.");
    }


    return Promise.reject(error);
  }
);
