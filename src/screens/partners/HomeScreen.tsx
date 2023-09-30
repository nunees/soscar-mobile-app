import UserPhoto from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { ILocationScheduleDTO } from '@dtos/ILocationSchedule.DTO';
import { ISchedules } from '@dtos/ISchedules';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { DateToString } from '@utils/DateToString';
import {
  Text,
  ScrollView,
  VStack,
  HStack,
  Icon,
  Heading,
  useToast,
  Center,
  Pressable,
  Badge,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { set } from 'react-hook-form';

/**
 * 0 - Cancelado
 * 1 - Agendado
 * 2 - Em andamento
 * 3 - Finalizado
 */

type ScheduleCardType = {
  created_at: string;
  date: Date;
  id: string;
  location_id: string;
  notes: string;
  partner_notes: string | null;
  service_type_id: number;
  status: number;
  time: string;
  user_id: string;
  vehicle_id: string;
};

export function HomeScreen() {
  const [schedules, setSchedules] = useState<ISchedules[]>({} as ISchedules[]);

  const { user } = useAuth();

  const toast = useToast();

  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await api.get('/schedules/partner', {
        headers: {
          id: user.id,
        },
      });

      if (!response.data) {
        setSchedules({} as ISchedules[]);
      }

      setSchedules(response.data);
    } catch (error) {
      if (error instanceof AppError) {
        toast.show({
          title: 'Erro ao carregar agendamentos',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
    return () => {
      setSchedules({} as ISchedules[]);
    };
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack
        backgroundColor="purple.900"
        borderBottomLeftRadius={10}
        borderBottomRightRadius={10}
      >
        <HStack justifyContent="space-between">
          <VStack justifyContent={'space-between'} px={3}>
            <HStack justifyItems={'baseline'} mb={2}>
              <HStack ml={2} pt={5}>
                <Text bold color="white" fontSize={20}>
                  Ola, {user.name}
                </Text>
              </HStack>
            </HStack>
          </VStack>

          <VStack alignItems="center" justifyContent="center" mt={5} mr={5}>
            <UserPhoto
              source={{
                uri: user.avatar
                  ? `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`
                  : `https://ui-avatars.com/api/?format=png&name=${user.name}W&size=512`,
              }}
              alt="Foto de perfil"
              size={8}
            />
          </VStack>
        </HStack>

        <VStack px={5} py={5}>
          <VStack p={5} borderRadius={10} backgroundColor="white">
            <Heading fontFamily={'heading'}>Resumo</Heading>
            <HStack justifyContent="space-between">
              <Text>Agendamentos em aberto: </Text>
              <Text>0</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text>Agendamentos em andamento: </Text>
              <Text>0</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text>Agendamentos finalizados: </Text>
              <Text>0</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text>Agendamentos cancelados: </Text>
              <Text>0</Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>

      <VStack px={3} py={5}>
        <VStack backgroundColor={'white'} p={3} borderRadius={10}>
          <Text bold pb={5}>
            Agendamentos pendentes
          </Text>

          {schedules.length > 0 &&
            schedules?.map(
              (schedule: ISchedules) =>
                schedule.status === 1 && (
                  <Pressable
                    p={3}
                    key={schedule.id}
                    borderColor="gray.200"
                    borderBottomWidth={1}
                    mb={2}
                    onPress={() =>
                      navigation.navigate('scheduleDetail', {
                        scheduleId: schedule.id,
                      })
                    }
                  >
                    <HStack justifyContent={'space-between'}>
                      <Text bold>{schedule.location?.business_name}</Text>
                      <HStack alignItems={'baseline'}>
                        <Icon
                          name="clock"
                          as={Feather}
                          size={4}
                          color="purple.900"
                        />
                        <Text pl={1}>{DateToString(schedule.date)}</Text>
                      </HStack>
                      <HStack alignItems={'baseline'}>
                        <Icon
                          name="calendar"
                          as={Feather}
                          size={4}
                          color="purple.900"
                        />
                        <Text pl={1}>{schedule.time}</Text>
                      </HStack>
                    </HStack>
                    <HStack justifyContent={'space-between'}>
                      <HStack alignItems={'baseline'} pt={1}>
                        {schedule.status === 1 && (
                          <Badge colorScheme="warning" variant="solid" mr={1}>
                            <Text color="white">Aguardando confirmacao</Text>
                          </Badge>
                        )}
                      </HStack>
                      <HStack alignItems={'baseline'}></HStack>
                    </HStack>
                  </Pressable>
                )
            )}
          {schedules.length && (
            <Center>
              <Text color="gray.300">Nenhum agendamento pendente</Text>
            </Center>
          )}
        </VStack>
      </VStack>

      <VStack px={3} py={5}>
        <VStack backgroundColor={'white'} px={5} borderRadius={10}>
          <Text bold pb={5}>
            Publicidade
          </Text>
        </VStack>
      </VStack>

      <VStack px={3} py={5}>
        <VStack backgroundColor={'white'} px={5} borderRadius={10}>
          <Text bold pb={5}>
            Informacoes
          </Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
