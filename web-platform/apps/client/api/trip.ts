import { axiosInstance } from "@workspace/shared/lib/axios";


interface TripPayload{
    source_id:number,
    destination_id:number,
}

export const getRoutesByStops=async(payload:TripPayload)=>{
    const response=await axiosInstance.post("/trip/get-routes",payload)
    return response.data;
}