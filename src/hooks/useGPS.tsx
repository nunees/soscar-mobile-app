import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export function useGPS() {
  const [position, setPosition] = useState({
    coords: {} as Location.LocationObjectCoords,
    isLoading: true,
    isError: false,
    isSucess: false,
    error: '',
  });

  async function requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPosition({
          coords: {} as Location.LocationObjectCoords,
          isLoading: false,
          isError: true,
          isSucess: false,
          error: 'Permissão de acesso negada',
        });
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setPosition({
        coords: location.coords,
        isLoading: false,
        isError: false,
        isSucess: true,
        error: '',
      });
    } catch (error) {
      setPosition({
        coords: {} as Location.LocationObjectCoords,
        isLoading: false,
        isError: true,
        isSucess: false,
        error: 'Ocorrerram erros ao buscar sua localização',
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setPosition({
              coords: {} as Location.LocationObjectCoords,
              isLoading: false,
              isError: true,
              isSucess: false,
              error: 'Permissão de acesso negada',
            });
          }

          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setPosition({
            coords: location.coords,
            isLoading: false,
            isError: false,
            isSucess: true,
            error: '',
          });
        } catch (error) {
          setPosition({
            coords: {} as Location.LocationObjectCoords,
            isLoading: false,
            isError: true,
            isSucess: false,
            error: 'Ocorrerram erros ao buscar sua localização',
          });
        }
      })();
    }, [])
  );

  return { position, requestPermissions };
}
