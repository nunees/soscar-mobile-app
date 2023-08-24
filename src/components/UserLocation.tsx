import { useCallback, useEffect, useState } from "react";
import { VStack, Text, HStack } from "native-base";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  reverseGeocodeAsync,
} from "expo-location";
import { useFocusEffect } from "@react-navigation/native";

export function UserLocation() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [address, setAddress] = useState<string>("");

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      const address = await reverseGeocodeAsync(currentPosition.coords);
      console.log(address[0].street);
      setLocation(currentPosition);
    }
  }

  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [])
  );

  return (
    <VStack>
      <Text>{address}</Text>
    </VStack>
  );
}
