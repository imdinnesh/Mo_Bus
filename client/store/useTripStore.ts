import { create } from 'zustand';

interface TripState {
    destination: string;
    setDestination: (destination: string) => void;
}

export const useTripStore = create<TripState>((set) => ({
    destination: '',
    setDestination: (destination) => set({ destination }),
}));
