import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface BookingState {
    bookingId: number,
    routeId: number,
    startStopId: number,
    endStopId: number,
    setBooking: (bookingId: number, routeId: number, startStopId: number, endStopId: number) => void;
    clearBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
    persist(
        (set) => ({
            bookingId: 0,
            routeId: 0,
            startStopId: 0,
            endStopId: 0,
            setBooking: (bookingId, routeId, startStopId, endStopId) => set({ bookingId, routeId, startStopId, endStopId }),
            clearBooking: () => set({ bookingId: 0, routeId: 0, startStopId: 0, endStopId: 0 }),
        }),
        {
            name: 'booking-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
