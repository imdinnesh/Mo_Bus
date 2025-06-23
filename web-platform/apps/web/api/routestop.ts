import { axiosInstance } from "@workspace/shared/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { DefaultResponse } from "@/types/route.types";
import { z } from "zod";

export const addRouteStopSchema = z.object({
    route_id:z.number().min(1, "Route ID is required"),
    stop_id: z.number().min(1, "Stop ID is required"),
    stop_index: z.number().min(0, "Stop index must be a non-negative integer"),
})

export type addRouteStopPayload = z.infer<typeof addRouteStopSchema>;

export const addRouteStop=async(payload:addRouteStopPayload):Promise<DefaultResponse>=>{
    const response=await axiosInstance.post("/route-stop/add-route-stop", payload, {
        headers:{
            "Authorization":useAuthStore.getState().accessToken
        }
    })
    return response.data;
}

export const updateRouteStopSchema = z.object({
    stop_index: z.number().min(0, "Stop index must be a non-negative integer"),
})

export type updateRouteStopPayload = z.infer<typeof updateRouteStopSchema>;

export const updateRouteStop = async (routeStopId: string, payload: updateRouteStopPayload): Promise<DefaultResponse> => {
    const response = await axiosInstance.put(`/route-stop/update-route-stop/${routeStopId}`, payload, {
        headers: {
            "Authorization": useAuthStore.getState().accessToken
        }
    });
    return response.data;
}

export const deleteRouteStop = async (routeStopId: string): Promise<DefaultResponse> => {
    const response = await axiosInstance.delete(`/route-stop/delete-route-stop/${routeStopId}`, {
        headers: {
            "Authorization": useAuthStore.getState().accessToken
        }
    });
    return response.data;
}