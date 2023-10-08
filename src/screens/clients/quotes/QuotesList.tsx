import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import { ServicesList } from '@data/ServicesList';
import { IQuoteList } from '@dtos/IQuoteList';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  VStack,
  Text,
  FlatList,
  HStack,
  Icon,
  Pressable,
  Center,
  useToast,
  Divider,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';

export function QuotesList() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState('');
  const [quotes, setQuotes] = useState<IQuoteList[]>([]);

  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const toast = useToast();

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          setIsLoading(true);
          setIsLoadingMessage('Buscando orçamentos...');
          const response = await api.get('/quotes/client', {
            headers: {
              id: user.id,
            },
          });

          setQuotes(response.data);
        } catch (error) {
          const isAppError = error instanceof AppError;
          const errorMessage = isAppError
            ? error.message
            : 'Ocorreu um erro ao buscar os orçamentos';
          toast.show({
            title: errorMessage,
            placement: 'top',
            bgColor: 'red.500',
          });
        } finally {
          setIsLoading(false);
        }
      }

      fetchData();
    }, [])
  );

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader title="Orcamentos" />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={() => setIsLoading(false)}
          message={isLoadingMessage}
        />
      )}

      <FlatList
        data={quotes}
        renderItem={({ item }) => (
          <Pressable
            alignSelf="center"
            onPress={() =>
              navigation.navigate('quoteDetails', {
                locationId: item.location_id,
                quoteId: item.id,
                vehicleId: item.vehicle_id,
              })
            }
          >
            <VStack
              w={350}
              backgroundColor="white"
              borderRadius={5}
              py={5}
              px={5}
              shadow={1}
            >
              <HStack>
                <VStack>
                  <HStack>
                    <Icon
                      as={Feather}
                      name="calendar"
                      size={5}
                      color="purple.500"
                    />
                    <Text pl={2}>
                      {item.created_at
                        ?.toString()
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/')}
                    </Text>
                  </HStack>
                </VStack>
                <VStack pl={5}>
                  <HStack>
                    <Icon
                      as={Feather}
                      name="clock"
                      size={5}
                      color="purple.500"
                    />
                    <Text pl={1}>
                      {item.created_at
                        ?.toString()
                        .split('T')[1]
                        .split(':')
                        .slice(0, 2)
                        .join(':')}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <HStack pt={3}>
                <VStack>
                  <HStack>
                    <Icon
                      as={Feather}
                      name="tool"
                      size={5}
                      color="purple.400"
                    />
                    <Text fontWeight={'normal'} pl={2}>
                      {
                        ServicesList.find(
                          (service) => service.id === item.service_type_id
                        )?.name
                      }
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <HStack pt={3}>
                <VStack>
                  <HStack>
                    <Icon
                      as={Feather}
                      name="life-buoy"
                      size={5}
                      color="purple.400"
                    />
                    <Text fontWeight={'normal'} pl={2}>
                      {item.insurance_company.name}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
              <Divider mt={2} />
              <HStack>
                <Text fontSize="xs" color="gray.600">
                  key: {item.hashId}
                </Text>
              </HStack>
            </VStack>
          </Pressable>
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
