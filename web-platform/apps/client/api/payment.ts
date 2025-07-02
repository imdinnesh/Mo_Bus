import { axiosInstance } from "@/lib/axios";

interface UpdateBalanceRequest{
    amount:number
}

export const updateBalance = async (payload: UpdateBalanceRequest) => {
    const token = localStorage.getItem('accessToken') || '';
    const response = await axiosInstance.post("/payment/update-balance", payload, {
        headers: {
            Authorization: token
        }
    });
    return response.data;
}