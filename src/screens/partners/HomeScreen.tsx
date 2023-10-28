/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SearchBar } from '@components/SearchBar';
import { SmallSchedulleCard } from '@components/SmallSchedulleCard';
import UserPhoto from '@components/UserPhoto';
import { ISchedules } from '@dtos/ISchedules';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  Text,
  ScrollView,
  VStack,
  HStack,
  useToast,
  Center,
  Pressable,
  FlatList,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
  const [schedules, setSchedules] = useState<ISchedules[]>([]);

  const { user } = useAuth();
  const { updateProfile } = useProfile();

  const toast = useToast();

  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  useFocusEffect(
    useCallback(() => {
      async function fetchSchedules() {
        try {
          const response = await api.get('/schedules/partner', {
            headers: {
              id: user.id,
            },
          });

          setSchedules(response.data);

          // const schedulesByDate = schedules.map((schedule) => {
          //   return {
          //     id: schedule.id,
          //     business_name: schedule.location?.business_name,
          //     date: schedule.date,
          //     time: schedule.time,
          //     service: schedule.service_type?.name,
          //   };
          // });

          // setSchedulesByDate(schedulesByDate);
        } catch (error) {
          if (error instanceof AppError) {
            toast.show({
              title: 'Erro ao carregar agendamentos',
              placement: 'top',
              bgColor: 'red.500',
            });
          }
        }
      }

      fetchSchedules();
    }, [schedules.length])
  );

  useEffect(() => {
    async function fetchUserData() {
      const response = await api.get(`/user/profile/${user.id}`, {
        headers: {
          id: user.id,
        },
      });
      updateProfile({
        birth_date: response.data.birth_date,
        cpf: response.data.cpf,
        genderId: response.data.genderId,
        last_name: response.data.last_name,
        name: response.data.name,
        phone: response.data.mobile_phone,
      });
    }

    fetchUserData();
  }, []);

  console.log(schedules);

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack>
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

          <VStack px={5} mt={5}>
            <VStack>
              <Text fontSize={'md'} bold pb={3}>
                Seus proximos clientes
              </Text>

              <FlatList
                data={schedules}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                snapToAlignment="start"
                pagingEnabled
                keyExtractor={(item) => item.id!}
                renderItem={({ item }) => {
                  return (
                    <VStack mb={3} borderRadius={5} shadow={0.8}>
                      <SmallSchedulleCard
                        id={item.id}
                        client={item.users?.name}
                        date={item.date}
                        service_type={item.service_type?.category_id}
                        time={item.time}
                      />
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
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
