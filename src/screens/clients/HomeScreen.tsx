import QRCodeImage from '@assets/qrcode.png';
import CalendarImage from '@assets/services/calendar.png';
import CompliantImage from '@assets/services/compliant.png';
import PaperImage from '@assets/services/paper.png';
import { ServiceCardTypes } from '@components/ServiceCardTypes';
import { SmallSchedulleCard } from '@components/SmallSchedulleCard';
import UserPhoto from '@components/UserPhoto';
import { ISchedules } from '@dtos/ISchedules';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { countDaysBetweenDates } from '@utils/DayjsDateProvider';
import {
  HStack,
  ScrollView,
  VStack,
  Text,
  Pressable,
  Center,
  FlatList,
  useToast,
  Icon,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<ISchedules[]>([]);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { updateProfile } = useProfile();

  const toast = useToast();

  useFocusEffect(
    useCallback(() => {
      async function fetchSchedules() {
        try {
          const response = await api.get('/schedules/client', {
            headers: {
              id: user.id,
            },
          });

          const filteredSchedules = response.data.filter(
            (schedule: ISchedules) =>
              countDaysBetweenDates(new Date(), schedule.date) > 0
          );
          setSchedules(filteredSchedules);
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
    const profile = async () => {
      try {
        const response = await api.get(`/user/profile/${user.id}`);

        await updateProfile({
          ...response.data,
          phone: response.data.mobile_phone,
        });
      } catch (error) {
        throw new AppError(error);
      }
    };

    profile();
  }, []);

  function renderNextSchedules(item: ISchedules) {
    return (
      <SmallSchedulleCard
        id={item.id}
        business_name={item.location?.business_name}
        date={item.date}
        service_type={item.service_type?.category_id}
        time={item.time}
      />
    );
  }

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
              <HStack alignItems={'center'}>
                <Pressable
                  onPress={() => navigation.navigate('notifications')}
                  mr={5}
                >
                  <Icon
                    as={FontAwesome5}
                    name="bell"
                    size={5}
                    color={'gray.600'}
                  />
                </Pressable>
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
            </HStack>
          </VStack>

          <VStack mt={5}>
            <VStack>
              <Text fontSize={'md'} bold pb={3}>
                Próximos agendamentos
              </Text>
              <FlatList
                data={schedules}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                snapToAlignment="start"
                pagingEnabled
                keyExtractor={(item) => item.id!}
                renderItem={({ item }) => renderNextSchedules(item)}
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
                Serviços mais procurados
              </Text>
              <ServiceCardTypes
                icon="calendar"
                title={'Agendamentos'}
                text={'Agende seus serviços sem sair de casa'}
                onPress={() => navigation.navigate('schedules')}
                image={CalendarImage}
                alt="Agendar serviços"
              />

              <ServiceCardTypes
                icon="file-text"
                title={'Orçamentos'}
                text={'Realize orçamentos sem sair de casa'}
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

              <ServiceCardTypes
                icon="compass"
                title={'Validar orçamento'}
                text={'Valide a autenticidade do documento de orçamento'}
                image={QRCodeImage}
                alt="Valide a autenticidade do documento de orçamento"
                onPress={() => navigation.navigate('validateDocument')}
              />
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
