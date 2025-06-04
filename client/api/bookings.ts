import { axiosInstance } from '@/lib/axios';

interface BookingPayload {
    route_id: number;
    source_stop_id: number;
    destination_stop_id: number;
}

export async function createBookings(payload: BookingPayload) {
    const response = await axiosInstance.post('/booking/create-booking', payload, {
        headers: {
            "Authorization": `${localStorage.getItem("accessToken")}`
        }
    });
    return response.data;
}