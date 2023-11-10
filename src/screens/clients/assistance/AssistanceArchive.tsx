/* eslint-disable import/no-extraneous-dependencies */
import { AppHeader } from '@components/AppHeader';
import { ASSISTANCE_SERVICES } from '@data/AssistanceServices';
import { ISearchAssistanceDTO } from '@dtos/ISearchAssistanceDTO';
import { useGPS } from '@hooks/useGPS';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';
import { CalculatePositionDistance } from '@utils/CalculatePositionDistance';
import axios from 'axios';
import {
  FlatList,
  HStack,
  VStack,
  useToast,
  Text,
  Avatar,
  Badge,
} from 'native-base';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RouteProps = {
  serviceId: number;
};

// Search within a 4km radius
const radius = 4 * 1000;

export function AssistanceArchieve() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locations, setLocations] = useState<ISearchAssistanceDTO[]>([]);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { serviceId } = route.params as RouteProps;

  const toast = useToast();
  const useGPSHook = useGPS();

  const fetchUserLocation = async () => {
    try {
      await useGPSHook.requestPermissions();
      setLatitude(useGPSHook.position.coords.latitude);
      setLongitude(useGPSHook.position.coords.longitude);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : 'Erro ao buscar locais';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  };

  const fetchLocations = async () => {
    try {
      const queryString = ASSISTANCE_SERVICES.find(
        (item) => item.id === serviceId
      )?.searchQuery;

      if (!queryString) throw new AppError('Localização não encontrada');

      const search_url =
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=` +
        `${latitude}%2C${longitude}&radius=${radius}&keyword=${queryString}&key=${process.env.GOOGLE_MAPS_APIKEY}`;

      const result = await axios.get(search_url);

      setLocations(result.data.results);
      console.log(locations[0].photos[0].html_attributions[0].split('"')[1]);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : 'Erro ao buscar locais';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, [latitude, longitude]);

  useEffect(() => {
    if (latitude && longitude) fetchLocations();
  }, [serviceId]);

  const renderItem = (item: ISearchAssistanceDTO) => {
    return (
      <TouchableOpacity>
        <VStack px={5} py={3}>
          <VStack background={'white'} p={5} borderRadius={10}>
            <HStack justifyContent={'space-between'}>
              <VStack>
                <Avatar
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${item.photos[0].photo_reference}&sensor=false&key=${process.env.GOOGLE_MAPS_APIKEY}`,
                  }}
                  size={'lg'}
                />
              </VStack>
              <VStack px={5}>
                <Text bold>
                  {item.name.length > 20
                    ? item.name.slice(0, 20).concat('...').toLocaleLowerCase()
                    : item.name.toLocaleLowerCase().charAt(0).toUpperCase() +
                      item.name.slice(1)}
                </Text>
                <Text fontSize={'xs'} color="gray.600">
                  Distancia:{' '}
                  {CalculatePositionDistance(
                    [latitude, longitude],
                    [item.geometry.location.lat, item.geometry.location.lng]
                  ).toFixed(2)}
                  km
                </Text>
                <Text fontSize={'xs'} color="gray.600">
                  Nota: {item.rating}
                </Text>
              </VStack>
              <VStack>
                <Badge
                  colorScheme={item.opening_hours ? 'green' : 'red'}
                  variant={'solid'}
                  borderRadius={6}
                >
                  <Text fontSize={'xs'} color="white" bold>
                    {item.opening_hours ? 'Disponivel' : 'Indisponivel'}
                  </Text>
                </Badge>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <VStack px={5} py={3}>
        <VStack background={'white'} p={5} borderRadius={10}>
          <HStack justifyContent={'center'}>
            <Text color="gray.600" fontSize={'sm'}>
              Nenhum profissional encontrado
            </Text>
          </HStack>
        </VStack>
      </VStack>
    );
  };

  return (
    <SafeAreaView>
      <VStack>
        <AppHeader
          navigation={navigation}
          screen={'assistanceContactType'}
          payload={{ serviceId }}
          title={'Profissionais off-line'}
        />
      </VStack>
      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        data={locations}
        renderItem={({ item }) => renderItem(item)}
        ListEmptyComponent={() => renderEmpty()}
        keyExtractor={(item) => item.name}
      />
    </SafeAreaView>
  );
}
