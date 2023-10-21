import FuelHelp from '@assets/services/fuel.png';
import KeyHelp from '@assets/services/key-car.png';
import EletricService from '@assets/services/spark-plug.png';
import TowService from '@assets/services/tow.png';
import WhellService from '@assets/services/wheel.png';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { useProfile } from '@hooks/useProfile';
import axios from 'axios';
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';
import {
  CircleIcon,
  Icon,
  Image,
  Input,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Circle } from 'react-native-svg';

import { ServicesSmallCard } from './ServicesCard';

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
  const [pointIconSize, setPointIconSize] = useState(50);

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
      axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocation?.latitude},${userLocation?.longitude}&destinations=${partnerLocation.latitude},${partnerLocation.longitude}&key=${GOOGLE_MAPS_APIKEY}`
      );
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
            <VStack
              w={pointIconSize}
              h={pointIconSize}
              backgroundColor="blue.400"
              borderRadius={100}
              shadow={1}
            />
          </Marker>
        )}

        {/* {partnerLocation && (
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
        )} */}
      </MapView>

      <VStack px={5} h={150} w={'full'} position={'absolute'} top={3} left={0}>
        <VStack backgroundColor={'white'} p={3} borderRadius={10}>
          <Text px={5} py={1} bold>
            O que procura?
          </Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ml={3}
          >
            <ServicesSmallCard
              image={TowService}
              alt="guincho"
              title="Guincho"
            />
            <ServicesSmallCard
              image={EletricService}
              alt="pane eletrica"
              title="Pane Eletrica"
            />

            <ServicesSmallCard
              image={WhellService}
              alt="borracharia"
              title="Borracharia"
            />

            <ServicesSmallCard
              image={KeyHelp}
              alt="chaveiro"
              title="Chaveiro"
            />

            <ServicesSmallCard
              image={FuelHelp}
              alt="pane seca"
              title="Pane Seca"
            />
          </ScrollView>
        </VStack>
      </VStack>

      <View
        style={{
          width: '100%',
          height: 200,
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      ></View>
    </View>
  );
}
