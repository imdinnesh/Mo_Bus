import { axiosInstance } from "@/lib/axios";

export const getBusByRouteId= async (routeId: string) => {
    const token = localStorage.getItem('accessToken') || '';
    const response=await axiosInstance.get(`/bus-route/get-bus?routeId=${routeId}`,{
        headers: {
            Authorization: token
        }
    });
    return response.data;
}
    