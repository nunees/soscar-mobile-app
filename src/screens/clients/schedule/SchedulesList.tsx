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
import {
  VStack,
  Text,
  FlatList,
  HStack,
  Pressable,
  Center,
  useToast,
} from 'native-base';
import { useCallback, useState } from 'react';

export function SchedulesList() {
  const [schedules, setSchedules] = useState<ISchedules[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const toast = useToast();

  async function fetchSchedules() {
    try {
      setIsLoading(true);
      const response = await api.get<ISchedules[]>('/schedules/client', {
        headers: {
          id: user.id,
        },
      });

      setSchedules(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'Ocorreu um erro ao buscar os agendamentos';
      toast.show({
        title: message,
        placement: 'top',
        bg: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
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
          message={'Carregando agendamentos...'}
          onClose={() => setIsLoading(false)}
        />
      )}

      <VStack px={5} paddingBottom={100}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={schedules}
          borderRadius={10}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate('schedulesDetails', {
                  scheduleId: String(item.id),
                })
              }
              mb={5}
              borderRadius={10}
            >
              <HStack
                backgroundColor={'white'}
                w={400}
                h={110}
                borderRadius={10}
                justifyContent={'flex-start'}
              >
                <HStack justifyContent={'space-between'}>
                  <HStack
                    w={90}
                    h={110}
                    backgroundColor={'purple.700'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    mr={3}
                    borderRadius={10}
                  >
                    <VStack>
                      <Text
                        fontSize={'4xl'}
                        color={'white'}
                        bold
                        textAlign={'center'}
                      >
                        {item.date?.toString().split('T')[0].split('-')[2]}
                      </Text>
                      <Text fontSize={'xs'} color="white">
                        {numberToMonth(
                          item.date?.toString().split('T')[0].split('-')[1]
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
                      <Text>
                        Status:{' '}
                        <Text
                          color={
                            item.status === 1
                              ? 'green.600'
                              : item.status === 2
                              ? 'yellow.600'
                              : item.status === 3
                              ? 'blue.600'
                              : 'gray.600'
                          }
                        >
                          {' '}
                          {item.status === 1
                            ? 'agendado'
                            : item.status === 2
                            ? 'aguardando'
                            : item.status === 3
                            ? 'em analise'
                            : 'finalizado'}
                        </Text>
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>
              </HStack>
            </Pressable>
          )}
          keyExtractor={({ id }) => String(id)}
          ListEmptyComponent={() => (
            <Center>
              <Text bold color="gray.600">
                Nao exitem orçamentos registrados
              </Text>
            </Center>
          )}
        />
      </VStack>
    </VStack>
  );
}
