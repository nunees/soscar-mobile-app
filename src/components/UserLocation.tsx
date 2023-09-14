import { Feather } from '@expo/vector-icons';
import { useGPS } from '@hooks/useGPS';
import { AppError } from '@utils/AppError';
import { reverseGeocodeAsync } from 'expo-location';
import { Text, HStack, Icon } from 'native-base';
import { useEffect, useState } from 'react';

export function UserLocation() {
  const [address, setAddress] = useState<string>('');

  const { coords } = useGPS();

  async function displayAddress() {
    try {
      const address = await reverseGeocodeAsync(coords);

      setAddress(`${address[0].street}, ${address[0].district}`);
    } catch (error) {
      throw new AppError('Não foi possível obter a localização do usuário.');
    }
  }

  useEffect(() => {
    displayAddress();
  }, [coords]);

  return (
    <HStack>
      <Icon as={Feather} name="map-pin" size={5} />
      {address ? (
        <Text bold fontSize="sm" pl={1}>
          {address}
        </Text>
      ) : (
        <Text bold fontSize="sm" pl={1}>
          localização não encontrada
        </Text>
      )}
    </HStack>
  );
}
