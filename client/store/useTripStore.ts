import { create } from 'zustand';

interface TripState {
    destinationId: string;
    destinationLabel: string;
    setDestination: (id: string, label: string) => void;
}

export const useTripStore = create<TripState>((set) => ({
    destinationId: '',
    destinationLabel: '',
    setDestination: (id, label) => set({ destinationId: id, destinationLabel: label }),
}));
