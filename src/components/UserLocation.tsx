import { Feather } from '@expo/vector-icons';
import { useGPS } from '@hooks/useGPS';
import { AppError } from '@utils/AppError';
import { reverseGeocodeAsync } from 'expo-location';
import { Text, HStack, Icon } from 'native-base';
import { useEffect, useState } from 'react';

export function UserLocation() {
  const { coords } = useGPS();
  const [address, setAddress] = useState<string>('');

  async function displayAddress() {
    try {
      console.log(coords);
      const address = await reverseGeocodeAsync(coords);

      setAddress(`${address[0].street}, ${address[0].district}`);
    } catch (error) {
      throw new AppError('Erro ao buscar endereço');
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
