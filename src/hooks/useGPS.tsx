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
        console.log('Granted');
        const currentPosition = await getCurrentPositionAsync({
          accuracy: 6,
        });

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
