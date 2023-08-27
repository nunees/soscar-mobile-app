import { useFocusEffect } from '@react-navigation/native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
} from 'expo-location';
import { Text, HStack } from 'native-base';
import { useCallback, useState } from 'react';

export function UserLocation() {
  const [address, setAddress] = useState<string>('');

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      const address = await reverseGeocodeAsync(currentPosition.coords);

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
