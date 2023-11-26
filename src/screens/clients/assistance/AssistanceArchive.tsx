/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import { ASSISTANCE_SERVICES } from '@data/AssistanceServices';
import { ISearchAssistanceDTO } from '@dtos/ISearchAssistanceDTO';
import { FontAwesome5 } from '@expo/vector-icons';
import { useGPS } from '@hooks/useGPS';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
  Icon,
} from 'native-base';
import { useCallback, useState } from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RouteProps = {
  serviceId: number;
};

const radius = 4 * 1000;

export function AssistanceArchieve() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locations, setLocations] = useState<ISearchAssistanceDTO[]>([]);
  const [loading, setLoading] = useState(false);

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

  async function fetchLocationPhoneNumber(placeId: string) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?location=${latitude}%2C${longitude}&fields=formatted_phone_number&place_id=${placeId}&key=${process.env.GOOGLE_MAPS_APIKEY}`;

    const result = await axios.get(url);

    return result.data.result.formatted_phone_number;
  }

  function sendMessagetoWhatsapp(phoneNumber: string) {
    if (!phoneNumber)
      return toast.show({
        title: 'Número de telefone não encontrado ou não cadastrado',
        placement: 'top',
        bgColor: 'red.500',
      });
    try {
      Linking.openURL(
        `whatsapp://send?phone=${phoneNumber}&text=Olá, gostaria de solicitar um serviço, você está disponível?`
      );
    } catch (error) {
      toast.show({
        title: 'Erro ao abrir o whatsapp',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const queryString = ASSISTANCE_SERVICES.find(
        (item) => item.id === serviceId
      )?.searchQuery;

      if (!queryString) throw new AppError('Localização não encontrada');

      const search_url =
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=` +
        `${latitude}%2C${longitude}&radius=${radius}&keyword=${queryString}&key=${process.env.GOOGLE_MAPS_APIKEY}`;

      const result = await axios.get(search_url);

      console.log(result.data.results);

      result.data.results.map(async (item: ISearchAssistanceDTO) => {
        const phone_number = await fetchLocationPhoneNumber(item.place_id);
        // eslint-disable-next-line no-param-reassign
        item.phone_number = phone_number;
      });

      setLocations(result.data.results);
      setLoading(false);

      if (result.data.results.length === 0) {
        console.log('new search');
        fetchUserLocation();
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : 'Erro ao buscar locais';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserLocation();
      fetchLocations();

      return () => {
        setLocations([]);
      };
    }, [serviceId])
  );

  const renderItem = (item: ISearchAssistanceDTO) => {
    return (
      <TouchableOpacity>
        <VStack px={5} py={3}>
          <VStack background={'white'} p={5} borderRadius={10}>
            <HStack justifyContent={'flex-start'}>
              <VStack>
                <Avatar
                  source={{
                    uri: item.photos
                      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${item.photos[0].photo_reference}&sensor=false&key=${process.env.GOOGLE_MAPS_APIKEY}`
                      : `https://ui-avatars.com/api/?format=png&name=${item.name}&size=512`,
                  }}
                  size={'lg'}
                />
              </VStack>
              <VStack px={5} w={200}>
                <Text bold>
                  {item.name.length > 15
                    ? item.name.slice(0, 15).concat('...').toLocaleLowerCase()
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
                  colorScheme={item.opening_hours ? 'purple' : 'red'}
                  variant={'solid'}
                  borderRadius={6}
                  marginRight={item.opening_hours ? 5 : 0}
                >
                  <Text fontSize={'xs'} color="white" bold>
                    {item.opening_hours ? 'Disponível' : 'Indisponível'}
                  </Text>
                </Badge>

                <VStack>
                  <HStack mt={5}>
                    {item.phone_number && (
                      <Icon
                        name="whatsapp"
                        as={FontAwesome5}
                        size={8}
                        color="green.500"
                        onPress={() =>
                          sendMessagetoWhatsapp(item.phone_number as string)
                        }
                      />
                    )}
                    {!item.phone_number && (
                      <Icon
                        name="whatsapp"
                        as={FontAwesome5}
                        size={8}
                        color="gray.200"
                      />
                    )}
                  </HStack>
                </VStack>
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
          screen={'assistanceList'}
          payload={{ serviceId }}
          title={'Lista de Profissionais'}
        />
      </VStack>

      {loading && (
        <LoadingModal showModal={loading} message="Buscando parceiros" />
      )}

      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        data={locations}
        renderItem={({ item }) => renderItem(item)}
        ListEmptyComponent={() => renderEmpty()}
        keyExtractor={(item) => item.vicinity}
      />
    </SafeAreaView>
  );
}
