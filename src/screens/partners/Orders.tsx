import { AppHeader } from '@components/AppHeader';
import UserPhoto from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { IQuoteList } from '@dtos/IQuoteList';
import { ISchedules } from '@dtos/ISchedules';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import {
  VStack,
  Text,
  HStack,
  Icon,
  Divider,
  FlatList,
  Badge,
} from 'native-base';
import { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';

export function Orders() {
  const [toggleSchedules, setToggleSchedules] = useState(true);
  const [toggleQuotes, setToggleQuotes] = useState(false);

  const [schedules, setSchedules] = useState<ISchedules[]>({} as ISchedules[]);
  const [quotes, setQuotes] = useState<IQuoteList[]>({} as IQuoteList[]);
  const [locations, setLocations] = useState<ILocation[]>({} as ILocation[]);

  const { user } = useAuth();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const fetchSchedules = useCallback(async () => {
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
      console.log(error);
    }
  }, []);

  const fetchQuotes = useCallback(async () => {
    try {
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
      console.log(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchQuotes();
      fetchSchedules();
    }, [toggleSchedules, toggleQuotes])
  );

  return (
    <VStack>
      <VStack>
        <AppHeader title="Solicitacoes" />
      </VStack>

      <VStack>
        <HStack justifyContent={'space-between'} px={10} py={5}>
          <VStack>
            <TouchableOpacity
              onPress={() => {
                setToggleSchedules(true);
                setToggleQuotes(false);
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
                  </VStack>
                </VStack>
              </TouchableOpacity>
            )}
          />
        </VStack>
      )}

      {toggleQuotes && (
        <VStack px={5} py={3}>
          {quotes.length > 0 && (
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
                >
                  <Text>Something</Text>
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
            />
          )}
        </VStack>
      )}
    </VStack>
  );
}
