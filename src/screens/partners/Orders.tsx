import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import UserPhoto from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { IQuoteList } from '@dtos/IQuoteList';
import { ISchedules } from '@dtos/ISchedules';
import { IUserDTO } from '@dtos/IUserDTO';
import { Feather, FontAwesome5, Octicons } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  VStack,
  Text,
  HStack,
  Icon,
  Divider,
  FlatList,
  Badge,
  useToast,
  Center,
  ScrollView,
} from 'native-base';
import { useCallback, useState } from 'react';
import { set } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';

async function fetchUserDetails(
  schedule_list: ISchedules[],
  partner_id: string
) {
  const users: IUserDTO[] = [];
  schedule_list.map(async (schedule) => {
    const response = await api.get(`/user/profile/${schedule.user_id}`, {
      headers: {
        id: partner_id,
      },
    });
    console.log(response.data);
  });
}

type userInfo = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export function Orders() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [toggleSchedules, setToggleSchedules] = useState(true);
  const [toggleQuotes, setToggleQuotes] = useState(false);

  const [schedules, setSchedules] = useState<ISchedules[]>({} as ISchedules[]);
  const [quotes, setQuotes] = useState<IQuoteList[]>({} as IQuoteList[]);

  const [userInfo, setUserInfo] = useState<IUserDTO[]>([]);

  const [locations, setLocations] = useState<ILocation[]>({} as ILocation[]);

  const { user } = useAuth();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const toast = useToast();

  // const fetchVehicleDetails = useCallback(async () => {}, []);
  // const fetchLocationDetails = useCallback(async () => {}, []);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Buscando agendamentos');
    try {
      if (toggleSchedules) {
        const response = await api.get('/schedules/partner', {
          headers: {
            id: user.id,
          },
        });
        setSchedules(response.data);
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
      setIsLoading(false);
    }
  }, [toggleSchedules]);

  const fetchQuotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadingMessage('Buscando orcamentos');
      if (toggleQuotes) {
        const response = await api.get('/quotes/partner', {
          headers: {
            id: user.id,
          },
        });

        const responseLocations = await api.get('/locations/', {
          headers: {
            id: user.id,
          },
        });

        setQuotes(response.data);
        setLocations(responseLocations.data);
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
      setIsLoading(false);
    }
  }, [toggleQuotes]);

  useFocusEffect(
    useCallback(() => {
      fetchSchedules();

      return () => {
        setSchedules({} as ISchedules[]);
        setUserInfo([] as IUserDTO[]);
      };
    }, [toggleSchedules])
  );

  useFocusEffect(
    useCallback(() => {
      fetchQuotes();
    }, [toggleQuotes])
  );

  return (
    <VStack>
      <VStack>
        <AppHeader title="Solicitacoes" />
      </VStack>

      <VStack>
        {isLoading && (
          <LoadingModal
            message={loadingMessage}
            showModal={isLoading}
            setShowModal={setIsLoading}
          />
        )}

        <HStack justifyContent={'space-between'} px={10} py={5}>
          <VStack>
            <TouchableOpacity
              onPress={() => {
                setToggleQuotes(false);
                setToggleSchedules(true);
              }}
            >
              <Text bold fontSize={'md'}>
                Agendamentos
              </Text>
              {toggleSchedules && (
                <Divider mt={1} borderColor="purple.900" borderWidth={1} />
              )}
            </TouchableOpacity>
          </VStack>
          <Divider orientation="vertical" />
          <VStack>
            <TouchableOpacity
              onPress={() => {
                setToggleSchedules(false);
                setToggleQuotes(true);
              }}
            >
              <Text bold fontSize={'md'}>
                Orcamentos
              </Text>
              {toggleQuotes && (
                <Divider mt={1} borderColor="purple.900" borderWidth={1} />
              )}
            </TouchableOpacity>
          </VStack>
        </HStack>
        <Divider />
      </VStack>

      {/** Hold the container */}
      <ScrollView>
        {toggleSchedules && (
          <VStack px={5} py={3}>
            <FlatList
              data={schedules}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('scheduleDetail', {
                      scheduleId: String(item.id),
                    })
                  }
                  style={{
                    paddingBottom: 10,
                  }}
                >
                  <VStack backgroundColor="white" borderRadius={10} p={5}>
                    {/* {} */}
                    <VStack mb={5}>
                      <VStack pr={3}>
                        <HStack>
                          <HStack>
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
                          </HStack>
                          <HStack>
                            <VStack ml={10}>
                              <Text fontSize={'md'} bold>
                                {item.location?.business_name}
                              </Text>
                              <Text fontSize={'md'}>{item.location?.city}</Text>
                            </VStack>
                          </HStack>

                          <HStack ml={60}>
                            {item.status === 1 && (
                              <Badge
                                colorScheme="warning"
                                variant={'outline'}
                                h={8}
                              >
                                Novo
                              </Badge>
                            )}
                          </HStack>
                        </HStack>
                      </VStack>
                    </VStack>
                    {/* {} */}
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
                          <Text pl={1}>{item.time}</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Divider my={2} />
                    <Text fontSize="xs" color="gray.400">
                      {item.id}
                    </Text>
                    <VStack>
                      {item.status === 1 && (
                        <Badge
                          colorScheme="purple"
                          variant={'solid'}
                          h={10}
                          borderRadius={10}
                        >
                          Solicitacao recebida
                        </Badge>
                      )}

                      {item.status === 2 && (
                        <Badge
                          colorScheme="warning"
                          variant={'solid'}
                          h={10}
                          borderRadius={10}
                        >
                          Aguardando sua confirmacao
                        </Badge>
                      )}

                      {item.status === 3 && (
                        <Badge
                          colorScheme="green"
                          variant={'solid'}
                          h={10}
                          borderRadius={10}
                        >
                          Aceita
                        </Badge>
                      )}

                      {item.status === 4 && (
                        <Badge
                          colorScheme="danger"
                          variant={'solid'}
                          h={10}
                          borderRadius={10}
                        >
                          Cancelado
                        </Badge>
                      )}
                    </VStack>
                  </VStack>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <Center>
                  <Text color="gray.400" bold>
                    Nao existem agendamentos registrados
                  </Text>
                </Center>
              )}
            />
          </VStack>
        )}

        {toggleQuotes && quotes && (
          <VStack px={5} py={3}>
            <FlatList
              data={quotes}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('scheduleDetail', {
                      scheduleId: String(item.id),
                    })
                  }
                  style={{
                    paddingBottom: 10,
                  }}
                  key={item.id}
                >
                  <VStack backgroundColor="white" borderRadius={10} p={5}>
                    <VStack mb={5}>
                      <HStack justifyContent={'flex-start'}>
                        <VStack pr={3}></VStack>

                        <VStack>
                          {/* <Text fontSize={'md'} bold>
                          )}
                          {/* <Text fontSize={'md'} bold>
                          {item.location?.business_name}
                        </Text>
                        <Text fontSize={'md'}>{item.location?.city}</Text> */}
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
                          {/* <Text pl={2}>
                          {item.created_at
                            ?.toString()
                            .split('T')[0]
                            .split('-')
                            .reverse()
                            .join('/')}
                        </Text> */}
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
                            {/* {item.created_at
                            ?.toString()
                            .split('T')[1]
                            .split(':')
                            .slice(0, 2)
                            .join(':')} */}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Divider my={2} />
                    <Text fontSize="xs" color="gray.400">
                      {item.id}
                    </Text>
                    {item.is_juridical && (
                      <Icon as={Octicons} name="law" size={5} />
                    )}
                    {/* <VStack>
                    {item.status === 1 && (
                      <Badge colorScheme="purple" variant={'solid'}>
                        Solicitacao recebida
                      </Badge>
                    )}

                    {item.status === 2 && (
                      <Badge colorScheme="warning">
                        Aguardando sua confirmacao
                      </Badge>
                    )}

                    {item.status === 3 && (
                      <Badge colorScheme="orange">Aceita</Badge>
                    )}

                    {item.status === 4 && (
                      <Badge colorScheme="danger">Cancelado</Badge>
                    )}
                  </VStack> */}
                  </VStack>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <Center>
                  <Text color="gray.400" bold>
                    Nao existem orcamentos registrados
                  </Text>
                </Center>
              )}
            />
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
}
