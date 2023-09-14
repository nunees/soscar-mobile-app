import { ReminderBell } from '@components/ReminderBell';
import { UserLocation } from '@components/UserLocation';
import { UserPhoto } from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { ILocationScheduleDTO } from '@dtos/ILocationSchedule.DTO';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import {
  Text,
  ScrollView,
  VStack,
  HStack,
  Icon,
  Heading,
  Box,
  Center,
} from 'native-base';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

/**
 * 0 - Cancelado
 * 1 - Agendado
 * 2 - Em andamento
 * 3 - Finalizado
 */

export function HomeScreen() {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [schedules, setSchedules] = useState<ILocationScheduleDTO[]>([]);
  const [openSchedulesCounter, setOpenSchedulesCounter] = useState<number>(0);
  const [inProgressSchedulesCounter, setInProgressSchedulesCounter] =
    useState<number>(0);
  const [finishedSchedulesCounter, setFinishedSchedulesCounter] =
    useState<number>(0);
  const [canceledSchedulesCounter, setCanceledSchedulesCounter] =
    useState<number>(0);

  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  function greeting() {
    const hours = new Date().getHours();
    if (hours >= 0 && hours < 12) {
      return 'Bom dia';
    }
    if (hours >= 12 && hours < 18) {
      return 'Boa tarde';
    }
    return 'Boa noite';
  }

  async function countOpenSchedules() {
    const openSchedules = schedules.filter((schedule) => schedule.status === 1);
    setOpenSchedulesCounter(openSchedules.length);
  }

  async function countInProgressSchedules() {
    const openSchedules = schedules.filter((schedule) => schedule.status === 2);
    setInProgressSchedulesCounter(openSchedules.length);
  }

  async function countFinishedSchedules() {
    const openSchedules = schedules.filter((schedule) => schedule.status === 3);
    setFinishedSchedulesCounter(openSchedules.length);
  }

  async function countCanceledSchedules() {
    const openSchedules = schedules.filter((schedule) => schedule.status === 4);
    setCanceledSchedulesCounter(openSchedules.length);
  }

  async function loadData() {
    console.log(user.name, { profile });
    try {
      const profileResponse = await api.get('/user/profile', {
        headers: {
          id: user.id,
        },
      });

      profile.name = profileResponse.data.name;
      profile.last_name = profileResponse.data.last_name;
      profile.phone = profileResponse.data.phone;
      profile.cpf = profileResponse.data.cpf;
      profile.genderId = profileResponse.data.genderID;
      profile.birth_date = profileResponse.data.birth_date;

      updateProfile(profile);

      const locationsResponse = await api.get('/locations', {
        headers: {
          id: user.id,
        },
      });

      setLocations(locationsResponse.data.locations);

      locations.map(async (location) => {
        const schedulesResponse = await api.get(
          `/schedules/location/user/${location.id}`,
          {
            headers: {
              id: user.id,
            },
          }
        );

        setSchedules(schedulesResponse.data);
      });

      countOpenSchedules();
      countInProgressSchedules();
      countFinishedSchedules();
      countCanceledSchedules();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack py={10} px={19}>
        <HStack mb={5} justifyContent={'center'}>
          <UserLocation />
        </HStack>

        <HStack justifyContent={'space-between'}>
          <HStack justifyItems={'baseline'}>
            <TouchableOpacity onPress={() => navigation.navigate('home')}>
              <UserPhoto
                source={{
                  uri: user.avatar
                    ? `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`
                    : `https://ui-avatars.com/api/?format=png&name=${user.name}+${profile.last_name}`,
                }}
                alt="Foto de perfil"
                size={8}
              />
            </TouchableOpacity>
            <Box ml={2} pb={10}>
              <Heading color="gray.200" fontSize="lg">
                {`${greeting()},`}
              </Heading>
              <Text>{`${user.name}`}</Text>
            </Box>
          </HStack>
          <HStack mt={3}>
            <ReminderBell />
          </HStack>
        </HStack>

        <VStack width={380}>
          <Heading>Resumo</Heading>
          <HStack justifyContent="space-between">
            <Text>Agendamentos em aberto: </Text>
            <Text>{openSchedulesCounter}</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text>Agendamentos em andamento: </Text>
            <Text>{inProgressSchedulesCounter}</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text>Agendamentos finalizados: </Text>
            <Text>{finishedSchedulesCounter}</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text>Agendamentos cancelados: </Text>
            <Text>{canceledSchedulesCounter}</Text>
          </HStack>
        </VStack>

        <VStack mt={10}>
          <HStack justifyContent="space-between">
            <Heading>Agendamentos</Heading>
            <TouchableOpacity onPress={loadData}>
              <Icon
                as={Feather}
                name="refresh-ccw"
                size={8}
                color="orange.500"
              />
            </TouchableOpacity>
          </HStack>
        </VStack>

        {schedules.length > 0 ? (
          <VStack>
            <VStack mt={5}>
              <Text>Aguardando</Text>
              {locations.map((location) => (
                <VStack>
                  {schedules.map((schedule) => {
                    if (schedule.status === 1) {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('scheduleDetail', {
                              scheduleId: String(schedule.id),
                            })
                          }
                        >
                          <VStack
                            w={380}
                            h={50}
                            borderWidth={1}
                            borderColor="gray.600"
                            borderRadius={5}
                            justifyItems="baseline"
                            alignItems="center"
                            mt={2}
                            key={schedule.id}
                          >
                            <VStack p={3}>
                              <HStack>
                                <HStack pr={3}>
                                  <Icon
                                    as={Feather}
                                    name="briefcase"
                                    size={5}
                                    color="orange.500"
                                  />
                                  <Text bold pl={2}>
                                    {location.business_name}
                                  </Text>
                                </HStack>
                                <HStack pl={3}>
                                  <Icon
                                    as={Feather}
                                    name="calendar"
                                    size={5}
                                    color="orange.500"
                                  />
                                  <Text bold pl={2}>
                                    {schedule.date
                                      .toString()
                                      .split('T')[0]
                                      .split('-')
                                      .reverse()
                                      .join('/')}
                                  </Text>
                                </HStack>
                                <HStack pl={3}>
                                  <Icon
                                    as={Feather}
                                    name="clock"
                                    size={5}
                                    color="orange.500"
                                  />
                                  <Text bold pl={2}>
                                    {schedule.time}
                                  </Text>

                                  <Icon
                                    as={Feather}
                                    name="arrow-right"
                                    size={7}
                                    color="orange.500"
                                    ml={5}
                                  />
                                </HStack>
                              </HStack>
                            </VStack>
                          </VStack>
                        </TouchableOpacity>
                      );
                    }
                    return <VStack></VStack>;
                  })}
                </VStack>
              ))}
            </VStack>

            <VStack mt={5}>
              <Text>Em andamento</Text>
              {locations.map((location) => (
                <VStack>
                  {schedules.map((schedule) => {
                    if (schedule.status === 2) {
                      return (
                        <VStack
                          w={380}
                          h={50}
                          borderWidth={1}
                          borderColor="gray.600"
                          borderRadius={5}
                          justifyItems="baseline"
                          alignItems="center"
                          mt={2}
                        >
                          <VStack p={3}>
                            <HStack>
                              <HStack pr={3}>
                                <Icon
                                  as={Feather}
                                  name="briefcase"
                                  size={5}
                                  color="orange.500"
                                />
                                <Text bold pl={2}>
                                  {location.business_name}
                                </Text>
                              </HStack>
                              <HStack pl={3}>
                                <Icon
                                  as={Feather}
                                  name="calendar"
                                  size={5}
                                  color="orange.500"
                                />
                                <Text bold pl={2}>
                                  {schedule.date
                                    .toString()
                                    .split('T')[0]
                                    .split('-')
                                    .reverse()
                                    .join('/')}
                                </Text>
                              </HStack>
                              <HStack pl={3}>
                                <Icon
                                  as={Feather}
                                  name="clock"
                                  size={5}
                                  color="orange.500"
                                />
                                <Text bold pl={2}>
                                  {schedule.time}
                                </Text>

                                <Icon
                                  as={Feather}
                                  name="arrow-right"
                                  size={7}
                                  color="orange.500"
                                  ml={5}
                                />
                              </HStack>
                            </HStack>
                          </VStack>
                        </VStack>
                      );
                    }
                    return null;
                  })}
                </VStack>
              ))}
            </VStack>
          </VStack>
        ) : (
          <VStack pt={5}>
            <Center>
              <Text color="gray.600">Voce nao possui nenhum em aberto</Text>
            </Center>
          </VStack>
        )}
      </VStack>
    </ScrollView>
  );
}
