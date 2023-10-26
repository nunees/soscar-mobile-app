/* eslint-disable no-nested-ternary */
import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import { ISchedules } from '@dtos/ISchedules';
import { useAxiosFetch } from '@hooks/axios/useAxiosFetch';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { numberToMonth } from '@utils/DayjsDateProvider';
import {
  VStack,
  Text,
  FlatList,
  HStack,
  Pressable,
  Badge,
  Center,
} from 'native-base';

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
                    </VStack>
                  </HStack>
                  <HStack>
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
