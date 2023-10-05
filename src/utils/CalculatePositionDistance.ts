import * as Location from 'expo-location';

import { AppError } from './AppError';

function toRad(angle: number) {
  return (angle * Math.PI) / 180;
}

export function CalculatePositionDistance(
  [prevLat, prevLong]: number[],
  [lat, long]: number[]
) {
  const prevLatInRad = toRad(prevLat);
  const prevLongInRad = toRad(prevLong);
  const latInRad = toRad(lat);
  const longInRad = toRad(long);

  return (
    // In kilometers
    6377.830272 *
    Math.acos(
      Math.sin(prevLatInRad) * Math.sin(latInRad) +
        Math.cos(prevLatInRad) *
          Math.cos(latInRad) *
          Math.cos(longInRad - prevLongInRad)
    )
  );
}

export async function ConvertAddressToLatLong(address: string) {
  try {
    // Solicitar permissão de localização, se ainda não estiver concedida
    // const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== 'granted') {
    //   console.error('Permissão de localização não concedida');
    //   return null;
    // }

    // Obter as coordenadas do endereço

    console.log('OK');
    const location = await Location.geocodeAsync(address);

    if (location && location.length > 0) {
      const primeiraCoordenada = location[0];
      return {
        latitude: primeiraCoordenada.latitude,
        longitude: primeiraCoordenada.longitude,
      };
    }
    console.error('Não foi possível obter as coordenadas do endereço');
    return null;
  } catch (error) {
    throw new AppError('Não foi possível obter as coordenadas do endereço');
  }
}
