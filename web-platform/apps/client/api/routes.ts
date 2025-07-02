import { axiosInstance } from '@/lib/axios';

export const getRoutedetails = async (routeId: string) => {
  const token = localStorage.getItem('accessToken') || '';
  const response = await axiosInstance.get(`/route/get-route/${routeId}`, {
    headers: {
      Authorization: token,
    },
  });
  return response.data.route;
};
