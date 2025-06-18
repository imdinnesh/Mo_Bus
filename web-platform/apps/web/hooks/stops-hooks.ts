import { addStop } from "@/api/stop"
import { useMutation } from "@tanstack/react-query"

export const useAddStops=()=>{
    return useMutation({
        mutationKey: ["add-stops"],
        mutationFn:addStop
    })
}