import { addRouteStop, addRouteStopPayload, deleteRouteStop, updateRouteStop, updateRouteStopPayload } from "@/api/routestop"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useAddRouteStop = (routeId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: addRouteStopPayload) => addRouteStop(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["route", routeId] })
        }
    })
}

export const useUpdateRouteStop = (routeId: string, routeStopId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: updateRouteStopPayload) => updateRouteStop(routeStopId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["route", routeId] })
        }
    })
}

export const useDeleteRouteStop = (routeId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (routeStopId: string) => deleteRouteStop(routeStopId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["route", routeId] })
        }
    })
}