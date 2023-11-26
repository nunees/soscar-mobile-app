import { useGPS } from '@hooks/useGPS';
import { LocationObjectCoords, reverseGeocodeAsync } from 'expo-location';
import { Text, HStack } from 'native-base';
import { useEffect, useState } from 'react';

async function displayAddress(coords: LocationObjectCoords) {
  const address = await reverseGeocodeAsync(coords);
  return address;
}

export function UserLocation() {
  const { position } = useGPS();
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    displayAddress(position.coords).then((response) =>
      setAddress(`${response[0].street}, ${response[0].district}`)
    );
  }, [position]);

  return (
    <HStack>
      {address ? (
        <Text fontSize="xs" numberOfLines={1} width={180}>
          {address}
        </Text>
      ) : (
        <Text fontSize="xs">localização não encontrada</Text>
      )}
    </HStack>
  );
}
