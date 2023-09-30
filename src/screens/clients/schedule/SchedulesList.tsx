import { AppHeader } from '@components/AppHeader';
import { Loading } from '@components/Loading';
import { LoadingModal } from '@components/LoadingModal';
import UserPhoto from '@components/UserPhoto';
import { IQuoteList } from '@dtos/IQuoteList';
import { ISchedules } from '@dtos/ISchedules';
import { Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
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
  Divider,
  Badge,
} from 'native-base';
import { useCallback, useState } from 'react';

const serviceTypes = [
  // Acessórios
  { id: 1, category_id: 1, name: 'Calotas' },
  { id: 2, category_id: 1, name: 'Carregadores' },
  { id: 3, category_id: 1, name: 'Suportes' },
  { id: 4, category_id: 1, name: 'Outros' },

  // Câmbio
  { id: 5, category_id: 2, name: 'Retifica' },
  { id: 6, category_id: 2, name: 'Revisão' },
  { id: 7, category_id: 2, name: 'Troca de fluido' },
  { id: 8, category_id: 2, name: 'Outros' },

  // Elétrico
  { id: 9, category_id: 3, name: 'Bateria' },
  { id: 10, category_id: 3, name: 'Lâmpadas' },
  { id: 11, category_id: 3, name: 'Revisão' },
  { id: 12, category_id: 3, name: 'Vidros' },
  { id: 13, category_id: 3, name: 'Outros' },

  // Fluidos
  { id: 14, category_id: 4, name: 'Arrefecimento' },
  { id: 15, category_id: 4, name: 'Freio' },
  { id: 16, category_id: 4, name: 'Óleo' },
  { id: 17, category_id: 4, name: 'Outros' },

  // Funilaria e Pintura
  { id: 18, category_id: 5, name: 'Funilaria' },
  { id: 19, category_id: 5, name: 'Pintura' },
  { id: 20, category_id: 5, name: 'Outros' },

  // Lavagem
  { id: 21, category_id: 6, name: 'Completa' },
  { id: 22, category_id: 6, name: 'Simples' },
  { id: 23, category_id: 6, name: 'Outros' },

  // Mecânico
  { id: 24, category_id: 7, name: 'Alinhamento' },
  { id: 25, category_id: 7, name: 'Balanceamento' },
  { id: 26, category_id: 7, name: 'Correia dentada' },
  { id: 27, category_id: 7, name: 'Embreagem' },
  { id: 28, category_id: 7, name: 'Escapamento' },
  { id: 29, category_id: 7, name: 'Freio' },
  { id: 30, category_id: 7, name: 'Injeção eletrônica' },
  { id: 31, category_id: 7, name: 'Motor' },
  { id: 32, category_id: 7, name: 'Revisão' },
  { id: 33, category_id: 7, name: 'Suspensão' },
  { id: 34, category_id: 7, name: 'Outros' },

  // Pneus
  { id: 35, category_id: 8, name: 'Alinhamento' },
  { id: 36, category_id: 8, name: 'Balanceamento' },
  { id: 37, category_id: 8, name: 'Troca' },
  { id: 38, category_id: 8, name: 'Reparos' },
  { id: 39, category_id: 8, name: 'Outros' },

  // Suspensão
  { id: 40, category_id: 9, name: 'Amortecedor' },
  { id: 41, category_id: 9, name: 'Molas' },
  { id: 42, category_id: 9, name: 'Outros' },

  // Vidros
  { id: 43, category_id: 10, name: 'Reparo' },
  { id: 44, category_id: 10, name: 'Troca' },
  { id: 45, category_id: 10, name: 'Outros' },

  // Outros
  { id: 46, category_id: 11, name: 'Outros' },
];

async function fetchData(user_id: string) {
  try {
    const response = await api.get('/schedules/client', {
      headers: {
        id: user_id,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new AppError('Não foi possível carregar os agendamentos');
  }
}

export function SchedulesList() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState('');
  const [quotes, setQuotes] = useState<ISchedules[]>([]);

  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  useFocusEffect(
    useCallback(() => {
      fetchData(user.id).then((response) => setQuotes(response));
      return () => {
        setQuotes([]);
      };
    }, [])
  );

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader title="Agendamentos Efetuados" />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={setIsLoading}
          message={isLoadingMessage}
        />
      )}

      <VStack px={5} paddingBottom={100}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={quotes}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate('schedulesDetails', {
                  scheduleId: String(item.id),
                })
              }
              mb={5}
            >
              <VStack backgroundColor="white" borderRadius={10} p={5}>
                <VStack mb={5}>
                  <HStack justifyContent={'flex-start'}>
                    <VStack pr={3}>
                      <UserPhoto
                        source={{
                          uri: item.location?.avatar
                            ? `${api.defaults.baseURL}/locations/avatar/${item.location?.id}/${item.location?.avatar}`
                            : `https://ui-avatars.com/api/?format=png&name=${item.location?.business_name}`,
                        }}
                        alt="Foto de perfil"
                        size={60}
                        borderRadius={100}
                      />
                    </VStack>

                    <VStack>
                      <Text fontSize={'md'} bold>
                        {item.location?.business_name}
                      </Text>
                      <Text fontSize={'md'}>{item.location?.city}</Text>
                    </VStack>
                  </HStack>
                </VStack>
                <HStack justifyContent={'space-between'}>
                  <VStack>
                    <HStack>
                      <Icon
                        as={FontAwesome5}
                        name="calendar-check"
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
                <Divider my={2} />
                <Text fontSize="xs" color="gray.400">
                  {item.id}
                </Text>
                <VStack>
                  {item.status === 1 && (
                    <Badge colorScheme="purple" variant={'solid'}>
                      Solicitacao enviada
                    </Badge>
                  )}

                  {item.status === 2 && (
                    <Badge colorScheme="warning">Aguardando confirmacao</Badge>
                  )}

                  {item.status === 3 && (
                    <Badge colorScheme="orange">Finalizado</Badge>
                  )}

                  {item.status === 4 && (
                    <Badge colorScheme="danger">Cacelado</Badge>
                  )}
                </VStack>
              </VStack>
            </Pressable>
          )}
          keyExtractor={({ id }) => String(id)}
          ListEmptyComponent={() => (
            <Text>Nao exitem orcamentos registrados</Text>
          )}
        />
      </VStack>
    </VStack>
  );
}
