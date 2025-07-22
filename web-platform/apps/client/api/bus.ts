import { axiosInstance,locationAxiosInstance } from "@workspace/shared/lib/axios";


export const getBusByRouteId= async (routeId: string) => {
    const token = localStorage.getItem('accessToken') || '';
    const response=await axiosInstance.get(`/bus-route/get-bus?routeId=${routeId}`,{
        headers: {
            Authorization: token
        }
    });
    return response.data;
}

export const getNearByBuses=async(lat: number, lon: number) => {
    const response=await locationAxiosInstance.get(`/buses/nearby?lat=${lat}&lon=${lon}&radius=5`);
    return response.data;
}