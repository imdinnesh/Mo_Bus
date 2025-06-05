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

export async function getBookings() {
    const response = await axiosInstance.get('/booking/get-bookings', {
        headers: {
            "Authorization": `${localStorage.getItem("accessToken")}`
        }
    });
    return response.data;
}

export async function getBookingById(bookingId: number) {
    const response = await axiosInstance.get(`/booking/get-booking-query?id=${bookingId}`, {
        headers: {
            "Authorization": `${localStorage.getItem("accessToken")}`
        }
    });
    return response.data;
}

interface TripPayload {
    booking_id: number;
    route_id: number;
    source: number;
    destination: number;
}



export async function createTrip(payload: TripPayload) {
    const response = await axiosInstance.post('/qrcode/start-trip', payload, {
        headers: {
            "Authorization": `${localStorage.getItem("accessToken")}`
        }
    });
    return response.data;
}

