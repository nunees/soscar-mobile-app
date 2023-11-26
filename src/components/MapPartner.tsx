import {
  LocationAccuracy,
  LocationObjectCoords,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export function MapPartner() {
  const [position, setPosition] = useState<LocationObjectCoords>(
    {} as LocationObjectCoords
  );

  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    setPermissionGranted(granted);
  }

  async function getCurrentPosition() {
    if (permissionGranted) {
      const currentPosition = await getCurrentPositionAsync({
        accuracy: LocationAccuracy.BestForNavigation,
      });
      if (!currentPosition) return;

      setPosition(currentPosition.coords);
    }
  }

  useEffect(() => {
    if (permissionGranted) {
      const interval = setInterval(async () => {
        getCurrentPosition();
      }, 10000);

      return () => clearInterval(interval);
    }
    return () => {};
  }, []);

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.28,
          longitudeDelta: 0.005,
        }}
      ></MapView>
    </View>
  );
}
