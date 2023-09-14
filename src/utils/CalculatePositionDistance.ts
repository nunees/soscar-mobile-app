import * as Location from 'expo-location';

function toRad(angle: number) {
  return (angle * Math.PI) / 180;
}

export function CalculatePositionDistance([prevLat, prevLong], [lat, long]) {
  const prevLatInRad = toRad(prevLat);
  const prevLongInRad = toRad(prevLong);
  const latInRad = toRad(lat);
  const longInRad = toRad(long);

  console.log(prevLatInRad, prevLongInRad, latInRad, longInRad);

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
    const location = await Location.geocodeAsync(address);
    console.log(location);

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
    console.log(error);
  }
}
