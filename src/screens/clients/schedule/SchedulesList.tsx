/* eslint-disable no-nested-ternary */
import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import { ISchedules } from '@dtos/ISchedules';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { numberToMonth } from '@utils/DayjsDateProvider';
import { VStack, Text, FlatList, HStack, Pressable, Badge } from 'native-base';
import { useCallback, useState } from 'react';

async function fetchData(user_id: string) {
  try {
    const response = await api.get('/schedules/client', {
      headers: {
        id: user_id,
      },
    });

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
      setIsLoading(true);
      setIsLoadingMessage('Carregando agendamentos');
      fetchData(user.id).then((response) => setQuotes(response));
      setIsLoading(false);
      return () => {
        setQuotes([]);
      };
    }, [])
  );

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader
          title="Agendamentos Efetuados"
          navigation={navigation}
          screen="services"
        />
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
              <Badge
                colorScheme={
                  item.status === 1
                    ? 'blue'
                    : item.status === 2
                    ? 'yellow'
                    : item.status === 3
                    ? 'purple'
                    : 'green'
                }
                w={400}
                h={100}
                justifyContent={'space-between'}
              >
                <HStack justifyContent={'flex-start'}>
                  <HStack
                    w={70}
                    h={100}
                    backgroundColor={'purple.700'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    mr={3}
                  >
                    <VStack>
                      <Text
                        fontSize={'4xl'}
                        color={'white'}
                        bold
                        textAlign={'center'}
                      >
                        {item.date.toString().split('T')[0].split('-')[2]}
                      </Text>
                      <Text fontSize={'xs'} color="white">
                        {numberToMonth(
                          item.date.toString().split('T')[0].split('-')[1]
                        )}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack mt={2}>
                      <Text fontSize={'md'} bold>
                        {item.location?.business_name}
                      </Text>
                      <Text fontSize={'md'}>{item.location?.city}</Text>
                      <Text fontSize={'xs'}>
                        Criado em:{' '}
                        {item.created_at
                          ?.toString()
                          .split('T')[0]
                          .split('-')
                          .reverse()
                          .join('/')}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    {/* <UserPhoto
                      source={{
                        uri:
                          item.users?.avatar &&
                          `${api.defaults.baseURL}/user/avatar/${item.users?.id}/${item.users?.avatar}`,
                      }}
                      alt="Foto de perfil"
                      size={60}
                      borderRadius={100}
                    /> */}

                    {item.status === 1 && (
                      <Badge
                        colorScheme={'blue'}
                        variant={'solid'}
                        w={90}
                        h={8}
                        borderRadius={6}
                      >
                        <Text fontSize={'xs'} color="white">
                          Agendado
                        </Text>
                      </Badge>
                    )}
                    {item.status === 2 && (
                      <Badge
                        colorScheme={'yellow'}
                        variant={'solid'}
                        w={90}
                        h={8}
                        borderRadius={10}
                      >
                        <Text fontSize={'xs'} color="white">
                          Aguardando
                        </Text>
                      </Badge>
                    )}
                    {item.status === 3 && (
                      <Badge
                        colorScheme={'yellow'}
                        variant={'solid'}
                        w={90}
                        h={8}
                      >
                        <Text fontSize={'xs'} color="white">
                          Em analise
                        </Text>
                      </Badge>
                    )}
                    {item.status === 4 && (
                      <Badge
                        colorScheme={'green'}
                        variant={'solid'}
                        w={90}
                        h={8}
                      >
                        <Text fontSize={'xs'} color="white">
                          Finalizado
                        </Text>
                      </Badge>
                    )}
                  </HStack>
                </HStack>
              </Badge>
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
