import { useProfile } from '@hooks/useProfile';
import {
  LocationObjectCoords,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';
import { useEffect, useState } from 'react';

export function useGPS() {
  const [coords, setCoords] = useState<LocationObjectCoords>(
    {} as LocationObjectCoords
  );

  const { profile, updateProfile } = useProfile();

  useEffect(() => {
    async function handleGPS() {
      const { granted } = await requestForegroundPermissionsAsync();
      if (granted) {
        const currentPosition = await getCurrentPositionAsync();
        setCoords(currentPosition.coords);
        profile.latitude = currentPosition.coords.latitude;
        profile.longitude = currentPosition.coords.longitude;
        await updateProfile(profile);
      }
    }

    handleGPS();
  }, []);

  return { coords };
}
