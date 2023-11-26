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
          title="Orçamentos"
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
              <VStack backgroundColor={'white'} borderRadius={5} h={110}>
                <HStack>
                  <VStack
                    w={100}
                    h={110}
                    backgroundColor={'purple.700'}
                    borderRadius={5}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <Text
                      color={'white'}
                      textAlign={'center'}
                      fontSize={'3xl'}
                      bold
                    >
                      {item.created_at?.toString().split('T')[0].split('-')[2]}
                    </Text>
                    <Text color={'white'} textAlign={'center'} fontSize={'md'}>
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
                    <HStack>
                      {item.status === 1 && (
                        <Badge
                          colorScheme={'info'}
                          mt={2}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text fontSize={'xs'} color="white">
                            Aguardando
                          </Text>
                        </Badge>
                      )}

                      {item.status === 2 && (
                        <Badge
                          colorScheme={'blue'}
                          mt={2}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text fontSize={'xs'} color={'white'}>
                            Análise
                          </Text>
                        </Badge>
                      )}

                      {item.status === 3 && (
                        <Badge
                          colorScheme={'green'}
                          mt={2}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text fontSize={'xs'} color={'black'}>
                            Aprovado
                          </Text>
                        </Badge>
                      )}

                      {item.status === 4 && (
                        <Badge
                          colorScheme={'red'}
                          mt={2}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text fontSize={'xs'} color={'white'}>
                            Recusado
                          </Text>
                        </Badge>
                      )}

                      {item.is_juridical && (
                        <Badge
                          colorScheme={'purple'}
                          mt={2}
                          ml={3}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text fontSize={'xs'} color={'white'}>
                            jurídico
                          </Text>
                        </Badge>
                      )}

                      {!item.is_juridical && (
                        <Badge
                          colorScheme={'purple'}
                          mt={2}
                          ml={3}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text
                            fontSize={'xs'}
                            color={'white'}
                            borderRadius={10}
                            variant={'solid'}
                          >
                            comum
                          </Text>
                        </Badge>
                      )}
                    </HStack>
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
              Nao exitem orçamentos registrados
            </Text>
          </Center>
        )}
      />
    </VStack>
  );
}
