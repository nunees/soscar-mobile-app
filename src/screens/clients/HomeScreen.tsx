import CalendarImage from '@assets/services/calendar.png';
import CompliantImage from '@assets/services/compliant.png';
import PaperImage from '@assets/services/paper.png';
import { SearchBar } from '@components/SearchBar';
import { ServiceCardTypes } from '@components/ServiceCardTypes';
import { SmallSchedulleCard } from '@components/SmallSchedulleCard';
import UserPhoto from '@components/UserPhoto';
import { ISchedules } from '@dtos/ISchedules';
import { useAuth } from '@hooks/useAuth';
// import { useGPS } from '@hooks/useGPS';
import { useProfile } from '@hooks/useProfile';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import {
  HStack,
  ScrollView,
  VStack,
  Text,
  FlatList,
  Center,
  Pressable,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type SchedulesType = {
  id: string | undefined | null;
  date: string | undefined | null;
  business_name: string | undefined | null;
  time: string | undefined | null;
  service: string | undefined | null;
};

export function HomeScreen() {
  const { user } = useAuth();
  const { updateProfile } = useProfile();

  const [schedulesByDate, setSchedulesByDate] = useState<SchedulesType[]>(
    {} as SchedulesType[]
  );

  const [schedules, setSchedules] = useState<ISchedules[]>([]);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  // const { coords } = useGPS();

  const fetchUserData = useCallback(async (user_id: string) => {
    const response = await api.get(`/user/profile/${user_id}`, {
      headers: {
        id: user_id,
      },
    });
    return response;
  }, []);

  const fetchSchedules = useCallback(async (user_id: string) => {
    const response = await api.get('/schedules/client', {
      headers: {
        id: user_id,
      },
    });
    return response;
  }, []);

  useEffect(() => {
    const schedulesByDate = schedules.map((schedule) => {
      return {
        id: schedule.id,
        business_name: schedule.location?.business_name,
        date: String(schedule.created_at),
        time: schedule.time,
        service: schedule.service_type?.name,
      };
    });

    setSchedulesByDate(schedulesByDate);
    console.log(schedulesByDate);
  }, [schedules]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData(user.id).then((response) => {
        updateProfile({
          birth_date: response.data.birth_date,
          cpf: response.data.cpf,
          genderId: response.data.genderId,
          last_name: response.data.last_name,
          name: response.data.name,
          phone: response.data.mobile_phone,
        });
      });

      fetchSchedules(user.id).then((response) => {
        setSchedules(response.data);
      });
    }, [])
  );

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack px={5} py={2}>
          <VStack backgroundColor="white" p={5} borderRadius={10} shadow={1}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <VStack>
                <Text fontSize={'md'} color="gray.700">
                  Boas vindas,
                </Text>
                <Text fontSize={'md'} bold color="gray.700">
                  {user.name}!
                </Text>
              </VStack>
              <Pressable onPress={() => navigation.navigate('profile')}>
                <UserPhoto
                  source={{
                    uri: user.avatar
                      ? `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`
                      : `https://ui-avatars.com/api/?format=png&name=${user.name}W&size=512`,
                  }}
                  alt="Foto de perfil"
                  size={10}
                  borderWidth={3}
                  borderColor="purple.700"
                />
              </Pressable>
            </HStack>
            <HStack mt={3}>
              <SearchBar />
            </HStack>
          </VStack>

          <VStack mt={5}>
            <VStack>
              <Text fontSize={'md'} bold pb={3}>
                Proximos agendamentos
              </Text>

              <FlatList
                data={schedulesByDate}
                horizontal={true}
                snapToAlignment="start"
                pagingEnabled
                keyExtractor={(item) => item.id!}
                renderItem={({ item }) => {
                  return (
                    <VStack mb={3} borderRadius={5} shadow={0.8}>
                      <SmallSchedulleCard data={item} />
                    </VStack>
                  );
                }}
                ListEmptyComponent={() => (
                  <HStack
                    backgroundColor="white"
                    w={350}
                    borderRadius={10}
                    p={3}
                    justifyContent={'space-around'}
                  >
                    <VStack w={20} h={20}>
                      <VStack
                        backgroundColor={'purple.700'}
                        borderRadius={10}
                        alignItems={'center'}
                      >
                        <Text bold fontSize={'4xl'} p={3} color="white">
                          {new Date().getDate().toString()}
                        </Text>
                      </VStack>
                    </VStack>
                    <VStack pt={5}>
                      <Center>
                        <Text color="green.600">Tudo certo! 👍</Text>
                        <Text color="green.600" bold>
                          Você não possui agendamentos
                        </Text>
                      </Center>
                    </VStack>
                  </HStack>
                )}
              />
            </VStack>
          </VStack>

          <VStack mt={5}>
            <VStack>
              <Text fontSize={'md'} bold pb={3}>
                Servicos mais procurados
              </Text>
              <ServiceCardTypes
                icon="calendar"
                title={'Agendamento de  serviços'}
                text={'Agende seus serviços sem sair de casa'}
                onPress={() => navigation.navigate('schedules')}
                image={CalendarImage}
                alt="Agendar serviços"
              />

              <ServiceCardTypes
                icon="file-text"
                title={'Orçamento de  serviços'}
                text={'Realize orcamentos sem sair de casa'}
                onPress={() => navigation.navigate('quotes')}
                image={PaperImage}
                alt="Orçamento de serviços"
              />
              <ServiceCardTypes
                icon="briefcase"
                title={'Orçamentos judiciais'}
                text={'Realize orçamentos judiciais sem sair de casa'}
                image={CompliantImage}
                alt="Orçamento judiciais de serviços"
                onPress={() => navigation.navigate('legalQuotes')}
              />

              {/* <ServiceCardTypes
                icon="compass"
                title={'Encontre um profissional'}
                text={'Encontre um profissional para realizar seu serviço'}
                image={FindImage}
                alt="Encontre um profissional para realizar seu serviço"
              /> */}
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
