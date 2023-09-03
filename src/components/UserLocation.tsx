import { Feather } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import { useFocusEffect } from '@react-navigation/native';
import { AppError } from '@utils/AppError';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  LocationObjectCoords,
} from 'expo-location';
import { Text, HStack, Icon } from 'native-base';
import { useCallback, useState } from 'react';

export function UserLocation() {
  const [address, setAddress] = useState<string>('');
  const [coord, setCoord] = useState<LocationObjectCoords>(
    {} as LocationObjectCoords
  );

  const { profile, updateProfile } = useProfile();

  async function requestLocationPermission() {
    try {
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
    } catch (error) {
      throw new AppError('Não foi possível obter a localização do usuário.');
    }
  }

  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [])
  );

  return (
    <HStack>
      <Icon
        as={Feather}
        name="map-pin"
        size={5}
        color={profile.latitude ? 'gray.600' : 'red.500'}
      />
      <Text bold fontSize="sm" pl={1}>
        {address}
      </Text>
    </HStack>
  );
}
