import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import { SERVICES_LIST } from '@data/ServicesList';
import { VEHICLE_MODELS } from '@data/VehiclesModels';
import { IQuoteList } from '@dtos/IQuoteList';
import { useAxiosFetch } from '@hooks/axios/useAxiosFetch';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { numberToMonth } from '@utils/DayjsDateProvider';
import { VStack, Text, FlatList, HStack, Center, Badge } from 'native-base';
import { TouchableOpacity } from 'react-native';

export function QuotesList() {
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const quotes = useAxiosFetch<IQuoteList[]>({
    url: '/quotes/client',
    method: 'get',
    headers: {
      id: user.id,
    },
  });

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader
          title="Orcamentos"
          navigation={navigation}
          screen="services"
        />
      </VStack>

      {quotes.state.isLoading && (
        <LoadingModal
          showModal={quotes.state.isLoading}
          message={'Carregando orçamentos...'}
        />
      )}

      <FlatList
        data={quotes.state.data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('quoteDetails', {
                locationId: item.location_id,
                quoteId: item.id,
                vehicleId: item.vehicle_id,
              })
            }
          >
            <VStack px={2} my={2} mx={3}>
              <VStack backgroundColor={'white'} borderRadius={5}>
                <HStack>
                  <VStack
                    w={100}
                    backgroundColor={'purple.900'}
                    borderBottomLeftRadius={5}
                    borderTopLeftRadius={5}
                  >
                    <Text
                      color={'white'}
                      textAlign={'center'}
                      fontSize={'3xl'}
                      bold
                    >
                      {item.created_at?.toString().split('T')[0].split('-')[2]}
                    </Text>
                    <Text color={'white'} textAlign={'center'} fontSize={'xl'}>
                      {numberToMonth(
                        item.created_at?.toString().split('T')[0].split('-')[1]
                      )}
                    </Text>
                  </VStack>

                  <VStack ml={3}>
                    <Text bold color="gray.600">
                      {SERVICES_LIST.map((service) =>
                        service.id === item.service_type_id ? service.name : ''
                      )}
                    </Text>
                    <Text>
                      {VEHICLE_MODELS.map((car) =>
                        item.vehicles.name_id === car.id ? car.name : ''
                      )}{' '}
                      / {item.vehicles.year}
                    </Text>
                    <Text color="gray.400">
                      {item.vehicles.plate.toUpperCase()}
                    </Text>
                  </VStack>

                  <VStack ml={5}>
                    {item.status === 1 ||
                      (item.status === 2 && (
                        <Badge colorScheme={'yellow'}>
                          <Text bold fontSize={'xs'}>
                            Aguardando
                          </Text>
                        </Badge>
                      ))}

                    {item.status === 3 && (
                      <Badge colorScheme={'blue'}>
                        <Text bold fontSize={'xs'}>
                          Analise
                        </Text>
                      </Badge>
                    )}

                    {item.status === 4 && (
                      <Badge colorScheme={'green'}>
                        <Text bold fontSize={'xs'}>
                          Aprovado
                        </Text>
                      </Badge>
                    )}
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Center>
            <Text bold color="gray.400">
              Nao exitem orcamentos registrados
            </Text>
          </Center>
        )}
      />
    </VStack>
  );
}
