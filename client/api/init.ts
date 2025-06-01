import { Stop,Route } from '../db/busDB';
import { axiosInstance } from '@/lib/axios';

export async function fetchStopsFromAPI(): Promise<Stop[]> {
  const response=await axiosInstance.get("/stop/get-stops",{
    headers:{
      "Authorization":`${localStorage.getItem("accessToken")}`
    }
  })
  return response.data.stops;
}

export async function fetchRoutesFromAPI(): Promise<Route[]> {
  const response= await axiosInstance.get("/route/get-routes",{
    headers:{
      "Authorization":`${localStorage.getItem("accessToken")}`
    }
  })
  return response.data.routes;
}


