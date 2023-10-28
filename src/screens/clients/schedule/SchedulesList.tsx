/* eslint-disable no-nested-ternary */
import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import { ISchedules } from '@dtos/ISchedules';
import { useAxiosFetch } from '@hooks/axios/useAxiosFetch';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { numberToMonth } from '@utils/DayjsDateProvider';
import { VStack, Text, FlatList, HStack, Pressable, Center } from 'native-base';

export function SchedulesList() {
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { state } = useAxiosFetch<ISchedules[]>({
    method: 'GET',
    url: '/schedules/client',
    headers: {
      id: user.id,
    },
  });

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader
          title="Agendamentos Efetuados"
          navigation={navigation}
          screen="services"
        />
      </VStack>

      {state.isLoading && (
        <LoadingModal
          showModal={state.isLoading}
          message={'Carregando agendamentos...'}
        />
      )}

      <VStack px={5} paddingBottom={100}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={state.data}
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
                Nao exitem orcamentos registrados
              </Text>
            </Center>
          )}
        />
      </VStack>
    </VStack>
  );
}
