import { addRoute, addRoutePayload, deleteRoute, getRouteById, getRoutes, updateRoute, updateRoutePayload } from "@/api/route"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetRoutes = () => {
    return useQuery({
        queryKey: ["routes"],
        queryFn: getRoutes,
    });
};


export const useGetRouteById = (routeId: string) => {
  return useQuery({
    queryKey: ["route", routeId],
    queryFn: () => getRouteById(routeId),
    enabled: !!routeId,
  });
};

export const useAddRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: addRoutePayload) => addRoute(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};

export const useUpdateRoute = (routeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: updateRoutePayload) => updateRoute(routeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["route", routeId] });
    },
  });
};

export const useDeleteRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (routeId: string) => deleteRoute(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};