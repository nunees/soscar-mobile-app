import { CustomMapStyle } from '@data/CustomMapStyle';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { api } from '@services/api';
import {
  LocationAccuracy,
  LocationObjectCoords,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';
import { ScrollView, VStack, Text } from 'native-base';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

type RouteParams = {
  latitude: string;
  longitude: string;
  orderId: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 100,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.5,
  },
});

export function AssistanceMap() {
  const [position, setPosition] = useState<LocationObjectCoords>({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
  } as LocationObjectCoords);

  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const mapRef = useRef<MapView>(null);

  const { user } = useAuth();

  const route = useRoute();
  const { latitude, longitude } = route.params as RouteParams;

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

  async function changeServerStatus(status: number) {
    const result = await api.get(`/assistance/status/all`, {
      headers: {
        id: user.id,
      },
    });

    const response = await api.put(
      `/assistance/heartbeat/update/${result.data.id}`,
      {
        status,
        latitude: String(position.latitude),
        longitude: String(position.longitude),
      },
      {
        headers: {
          id: user.id,
        },
      }
    );

    if (response.status !== 200) {
      console.log('Erro ao atualizar a localização');
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log('Inside loop');
      requestLocationPermissions();
      if (permissionGranted) {
        const interval = setInterval(async () => {
          await getCurrentPosition();
          await changeServerStatus(2);
        }, 10000);

        return () => clearInterval(interval);
      }
      return () => {};
    }, [])
  );

  useEffect(() => {
    mapRef.current?.fitToSuppliedMarkers(['userLocation'], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [position]);

  // useEffect(() => {
  //   const getTravelTime = async () => {
  //     axios.get(
  //       `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocation?.latitude},${userLocation?.longitude}&destinations=${partnerLocation.latitude},${partnerLocation.longitude}&key=${GOOGLE_MAPS_APIKEY}`
  //     );
  //   };

  //   getTravelTime();
  // }, [partnerLocation, userLocation, GOOGLE_MAPS_APIKEY]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={CustomMapStyle}
        followsUserLocation={true}
        showsUserLocation={true}
        initialRegion={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.28,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: Number(latitude),
            longitude: Number(longitude),
          }}
          title="Sua posicao"
          description="Sua localização atual"
          identifier="userLocation"
        />
      </MapView>

      <VStack px={5} h={150} w={300} position={'absolute'} top={2} left={0}>
        <VStack backgroundColor={'white'} p={3} borderRadius={10}>
          <Text px={5} py={1} textAlign={'center'}>
            Aguardando chamado
          </Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ml={3}
          ></ScrollView>
        </VStack>
      </VStack>
    </View>
  );
}
