import CarPng from '@assets/car-top.png';
import PinPng from '@assets/pin.png';
import TargetPng from '@assets/target.png';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { Feather } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import axios from 'axios';
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';
import { Icon, Image } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

type LocationObject = {
  latitude: number;
  longitude: number;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

type coords = {
  latitude: number;
  longitude: number;
};

export function Map({ latitude, longitude }: coords) {
  const { profile } = useProfile();
  const [userLocation, setUserLocation] = useState<LocationObject>();
  const [partnerLocation, setPartnerLocation] = useState<LocationObject>();

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setUserLocation({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });
    }
  }

  useEffect(() => {
    requestLocationPermissions();
    setPartnerLocation({
      latitude,
      longitude,
    });
  }, []);

  useEffect(() => {
    mapRef.current?.fitToSuppliedMarkers(['userLocation', 'partnerLocation'], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [userLocation, partnerLocation]);

  useEffect(() => {
    const getTravelTime = async () => {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocation?.latitude},${userLocation?.longitude}&destinations=${partnerLocation.latitude},${partnerLocation.longitude}&key=${GOOGLE_MAPS_APIKEY}`
        )
        .then((response) => {
          console.log(response.data.rows[0].elements[0].duration.text);
        });
    };

    getTravelTime();
  }, [partnerLocation, userLocation, GOOGLE_MAPS_APIKEY]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        mapType="mutedStandard"
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || profile.latitude,
          longitude: userLocation?.longitude || profile.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <MapViewDirections
          origin={userLocation}
          destination={partnerLocation}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="blue"
        />

        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation?.latitude,
              longitude: userLocation?.longitude,
            }}
            title="Sua posicao"
            description="Sua localização atual"
            identifier="userLocation"
          >
            <Image source={PinPng} alt="Pin" size="xs" />
          </Marker>
        )}

        {partnerLocation && (
          <Marker
            coordinate={{
              latitude: partnerLocation.latitude,
              longitude: partnerLocation.longitude,
            }}
            title="Sua posicao"
            description="Sua localização atual"
            identifier="partnerLocation"
          >
            <Image source={CarPng} alt="Carro" size="xs" />
          </Marker>
        )}
      </MapView>
    </View>
  );
}
