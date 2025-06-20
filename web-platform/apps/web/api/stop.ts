import { axiosInstance } from "@workspace/shared/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { z } from "zod";

export const addStopSchema = z.object({
    stop_name: z.string().min(1, "Stop name is required"),
})
export type addStopPayload = z.infer<typeof addStopSchema>;

export const bulkAddStopsSchema = z.object({
    stops_list: z.string().min(1, "Please enter at least one stop name."),
});
export type bulkAddStopsPayload = z.infer<typeof bulkAddStopsSchema>;

export const addStop = async (payload: addStopPayload) => {
    const response = await axiosInstance.post("/stop/add-stop", payload, {
        headers: {
            "Authorization": useAuthStore.getState().accessToken
        }
    })

    return response.data;
}

export const updateStop=async(stopId:string,payload:addStopPayload)=>{
    const response=await axiosInstance.put(`/stop/update-stop/${stopId}`, payload, {
        headers: {
            "Authorization": useAuthStore.getState().accessToken
        }
    })
    return response.data;
}

export const deleteStop = async (stopId: string) => {
    const response = await axiosInstance.delete(`/stop/delete-stop/${stopId}`, {
        headers: {
            "Authorization": useAuthStore.getState().accessToken
        }
    });
    return response.data;
}

export const getStops=async()=>{
    const response = await axiosInstance.get("/stop/get-stops", {
        headers: {
            "Authorization": useAuthStore.getState().accessToken
        }
    });
    return response.data.stops;
}