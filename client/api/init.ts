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
  return [
    { id: 'r1', number: '101A' },
    { id: 'r2', number: 'Express 9' },
  ];
}


