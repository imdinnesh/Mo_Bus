import { addStop, addStopPayload, deleteStop, getStops, updateStop } from "@/api/stop"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useAddStops=()=>{
    return useMutation({
        mutationKey: ["add-stops"],
        mutationFn:addStop
    })
}

export const useUpdateStop=(stopId:string)=>{
    return useMutation({
        mutationKey: ["update-stop", stopId],
        mutationFn: (payload:addStopPayload) => updateStop(stopId, payload)
    })
}

export const useDeleteStop=(stopId:string)=>{
    return useMutation({
        mutationKey: ["delete-stop", stopId],
        mutationFn: deleteStop
    })
}

export const useGetStops=()=>{
    return useQuery({
        queryKey: ["get-stops"],
        queryFn: getStops
    })
}