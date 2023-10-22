import { AppError } from '@utils/AppError';
import * as Location from 'expo-location';

export function useAddressToCoords() {
  async function ConvertAddressToLatLong(address: string) {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permissão de localização negada');
        return null;
      }

      const location = await Location.geocodeAsync(address);

      if (location && location.length > 0) {
        const primeiraCoordenada = location[0];
        return {
          latitude: primeiraCoordenada.latitude,
          longitude: primeiraCoordenada.longitude,
        };
      }
      return null;
    } catch (error) {
      throw new AppError('Não foi possível obter as coordenadas do endereço');
    }
  }

  return { ConvertAddressToLatLong };
}
