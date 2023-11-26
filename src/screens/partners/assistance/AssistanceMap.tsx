import { Button } from '@components/Button';
import { CustomMapStyle } from '@data/CustomMapStyle';
import { IAssistanceOrderDTO } from '@dtos/IAssistanceOrderDTO';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  LocationAccuracy,
  LocationObjectCoords,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';
import { VStack, Text, useToast, HStack } from 'native-base';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

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
  const [showContainer, setShowContainer] = useState<boolean>(false);

  const [order, setOrder] = useState<IAssistanceOrderDTO>(
    {} as IAssistanceOrderDTO
  );
  const [position, setPosition] = useState<LocationObjectCoords>(
    {} as LocationObjectCoords
  );

  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [assistanceId, setAssistanceId] = useState<string>('');

  const mapRef = useRef<MapView>(null);

  const { user } = useAuth();

  const toast = useToast();

  async function requestLocationPermissions() {
    try {
      const { granted } = await requestForegroundPermissionsAsync();
      setPermissionGranted(granted);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'Ocorreu um erro ao tentar obter a sua localização, toque no botão de localização para tentar novamente';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function getCurrentPosition() {
    try {
      if (permissionGranted) {
        const currentPosition = await getCurrentPositionAsync({
          accuracy: LocationAccuracy.BestForNavigation,
        });
        if (!currentPosition) return;

        setPosition(currentPosition.coords);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'Ocorreu um erro ao tentar obter a sua localização, toque no botão de localização para tentar novamente';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function changeServerStatus(status: number) {
    try {
      const result = await api.get(`/assistance/status/all`, {
        headers: {
          id: user.id,
        },
      });

      setAssistanceId(result.data.id);

      await api.put(
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
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'Ocorreu um erro ao atualizar sua posição';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function cancelOrder() {
    try {
      await api.patch(`/assistance/order/cancel/${order.id}`, {
        headers: {
          id: user.id,
        },
      });
      setOrder({} as IAssistanceOrderDTO);
      setShowContainer(false);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'Ocorreu um erro ao cancelar seu pedido, tente novamente!';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function acceptOrder() {
    try {
      await api.patch(`/assistance/order/accept/new/${order.id}`, {
        headers: {
          id: user.id,
        },
      });

      setShowContainer(false);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'A solicitação não existe mais, tente novamente!';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function checkIfThereIsAnOrder() {
    try {
      const orderInformation = await api.get(
        `/assistance/order/pending/${assistanceId}`,
        {
          headers: {
            id: user.id,
          },
        }
      );

      if (
        orderInformation.data.order_status &&
        orderInformation.data.order_status === 1
      ) {
        if (order.id !== orderInformation.data.id) {
          setOrder(orderInformation.data);
          setShowContainer(true);
        }
      } else {
        setOrder({} as IAssistanceOrderDTO);
        setShowContainer(false);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'Ocorreu um erro ao verificar se existe um pedido de assistência, tente novamente!';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      requestLocationPermissions();
      const interval = setInterval(async () => {
        await getCurrentPosition();
        await checkIfThereIsAnOrder();
        await changeServerStatus(2);
      }, 1000);

      return async () => {
        clearInterval(interval);
        await changeServerStatus(1);
        setOrder({} as IAssistanceOrderDTO);
        setShowContainer(false);
      };
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
      ></MapView>

      {showContainer && (
        <View
          style={{
            width: 400,
            height: 200,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 5,
            left: 5,
            borderRadius: 20,
          }}
        >
          <HStack px={5} py={5}>
            <VStack>
              <Text>Valor (por km): R${order.total_miles}</Text>
              <Text>Taxa de servico: R${order.total_price}</Text>
              <Text bold>
                Valor total: R${order.total_price + order.total_miles}
              </Text>
            </VStack>
          </HStack>

          <HStack justifyContent={'space-between'} px={5}>
            <Button
              w={150}
              variant={'dark'}
              bg={'green.500'}
              onPress={acceptOrder}
              title="Aceitar"
            />

            <Button
              w={150}
              variant={'dark'}
              bg={'red.500'}
              onPress={cancelOrder}
              title="Recusar"
            />
          </HStack>
        </View>
      )}
    </View>
  );
}
