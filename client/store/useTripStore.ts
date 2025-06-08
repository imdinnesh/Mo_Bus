// stores/tripStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TripState {
    destinationId: string;
    destinationLabel: string;
    sourceId: string;
    sourceLabel: string;
    routeId: string;
    routeNumber: string;

    setDestination: (id: string, label: string) => void;
    setSource: (id: string, label: string) => void;
    setRoute: (id: string, number: string) => void;
    reset: () => void;
}

export const useTripStore = create<TripState>()(
    persist(
        (set) => ({
            destinationId: '',
            destinationLabel: '',
            sourceId: '',
            sourceLabel: '',
            routeId: '',
            routeNumber: '',

            setDestination: (id, label) =>
                set({ destinationId: id, destinationLabel: label }),

            setSource: (id, label) =>
                set({ sourceId: id, sourceLabel: label }),

            setRoute: (id, number) =>
                set({ routeId: id, routeNumber: number }),

            reset: () =>
                set({
                    destinationId: '',
                    destinationLabel: '',
                    sourceId: '',
                    sourceLabel: '',
                    routeId: '',
                    routeNumber: '',
                }),
        }),
        {
            name: 'trip-store', // localStorage key
            partialize: (state) => ({
                destinationId: state.destinationId,
                destinationLabel: state.destinationLabel,
                sourceId: state.sourceId,
                sourceLabel: state.sourceLabel,
                routeId: state.routeId,
                routeNumber: state.routeNumber,
            }),
        }
    )
);
