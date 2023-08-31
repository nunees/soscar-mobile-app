import { useProfile } from '@hooks/useProfile';
import { useFocusEffect } from '@react-navigation/native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  LocationObjectCoords,
} from 'expo-location';
import { Text, HStack } from 'native-base';
import { useCallback, useState } from 'react';

export function UserLocation() {
  const [address, setAddress] = useState<string>('');
  const [coord, setCoord] = useState<LocationObjectCoords>(
    {} as LocationObjectCoords
  );

  const { profile, updateProfile } = useProfile();

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setCoord(currentPosition.coords);
      profile.latitude = coord.latitude;
      profile.longitude = coord.longitude;
      updateProfile(profile);

      const address = await reverseGeocodeAsync(coord);
      setAddress(`${address[0].street}, ${address[0].district}`);
    }
  }

  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [])
  );

  return (
    <HStack>
      <Text bold fontSize="sm" pl={1}>
        {address}
      </Text>
    </HStack>
  );
}
