import { addRoute, addRoutePayload, deleteRoute, getRouteById, getRoutes, updateRoute, updateRoutePayload } from "@/api/route"
import { DefaultResponse, GetRoutesResponse } from "@/types/route.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useGetRoutes = () => {
  return useQuery<GetRoutesResponse>({
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
  return useMutation<DefaultResponse, Error, addRoutePayload>({
    mutationFn: (payload: addRoutePayload) => addRoute(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      toast.success(data.message || "Route added successfully!");
    },
    onError: (error:any) => {
      toast.error(error.response.data.error || "An error occurred while adding the route.");
    },
  });
};

export const useUpdateRoute = (routeId: string) => {
  const queryClient = useQueryClient();
  return useMutation<DefaultResponse, Error, updateRoutePayload>({
    mutationFn: (payload: updateRoutePayload) => updateRoute(routeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["route", routeId] });
    },
  });
};

export const useDeleteRoute = () => {
  const queryClient = useQueryClient();
  return useMutation<DefaultResponse, Error, string>({
    mutationFn: (routeId: string) => deleteRoute(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};