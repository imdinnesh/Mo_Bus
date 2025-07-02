// hooks/use-user-location.ts
import { useState, useEffect } from "react";

type Coords = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  coords: Coords | null;
  isLoading: boolean;
  error: GeolocationPositionError | Error | null;
  permissionState: PermissionState | 'unavailable';
};

export function useUserLocation() {
  const [locationState, setLocationState] = useState<LocationState>({
    coords: null,
    isLoading: true,
    error: null,
    permissionState: 'prompt',
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        isLoading: false,
        error: new Error("Geolocation is not supported by your browser."),
        permissionState: 'unavailable',
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocationState({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        isLoading: false,
        error: null,
        permissionState: 'granted',
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setLocationState(prev => ({
        ...prev,
        isLoading: false,
        error,
        permissionState: 'denied',
      }));
    };

    // Check permission status
    navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
      setLocationState(prev => ({...prev, permissionState: permissionStatus.state}));
      
      if (permissionStatus.state === 'granted') {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      } else if (permissionStatus.state === 'prompt') {
        // This will trigger the browser's permission dialog
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      } else if (permissionStatus.state === 'denied') {
        setLocationState(prev => ({
          ...prev,
          isLoading: false,
          error: new Error("Geolocation access was denied. Please enable it in your browser settings."),
        }));
      }

      permissionStatus.onchange = () => {
        setLocationState(prev => ({ ...prev, permissionState: permissionStatus.state }));
         // If permission is granted later, refetch location
        if(permissionStatus.state === 'granted') {
            navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        }
      };
    });
  }, []);

  return locationState;
}