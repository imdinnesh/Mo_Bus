import { axiosInstance } from "@workspace/shared/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { z } from "zod";
import { DefaultResponse, GetRoutesResponse } from "@/types/route.types";

export const getRoutes = async (): Promise<GetRoutesResponse> => {
  const response = await axiosInstance.get<GetRoutesResponse>("/route/get-routes", {
    headers: {
      "Authorization": useAuthStore.getState().accessToken
    }
  });
  return response.data;
};

export const addRouteSchema = z.object({
    route_number:z.string().min(1, "Route number is required"),
    route_name: z.string().min(1, "Route name is required"),
    direction:z.number().min(1, "Direction is required"),
})

export type addRoutePayload = z.infer<typeof addRouteSchema>;

export const addRoute=async (payload: addRoutePayload):Promise<DefaultResponse> => {
    const response = await axiosInstance.post("/route/add-route", payload, {
        headers: {
            "Authorization": useAuthStore.getState().accessToken
        }
    });
    return response.data;
}

export const getRouteById = async (routeId: string) => {
    const response = await axiosInstance.get(`/route/get-route/${routeId}`, {
        headers: {
            "Authorization": useAuthStore.getState().accessToken
        }
    });
    return response.data;
}

export const updateRouteSchema = z.object({
    route_number: z.string().min(1, "Route number is required"),
    route_name: z.string().min(1, "Route name is required"),
});

export type updateRoutePayload = z.infer<typeof updateRouteSchema>;

export const updateRoute = async (routeId: string, payload: updateRoutePayload):Promise<DefaultResponse> => {
    const response = await axiosInstance.put(`/route/update-route/${routeId}`, payload, {
        headers: {
            "Authorization": useAuthStore.getState().accessToken
        }
    });
    return response.data;
}

export const deleteRoute = async (routeId: string): Promise<DefaultResponse> => {
    const response = await axiosInstance.delete(`/route/delete-route/${routeId}`, {
        headers: {
            "Authorization": useAuthStore.getState().accessToken
        }
    });
    return response.data;
}

