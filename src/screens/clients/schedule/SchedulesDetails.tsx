import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { ISchedules } from '@dtos/ISchedules';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useRoute } from '@react-navigation/native';
import { api } from '@services/api';
import {
  Center,
  HStack,
  Heading,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

type RouteParams = {
  scheduleId: string;
};

type SchedulesFiles = {
  id: string;
  file_url: string;
};

/**
 * 0 - Cancelado
 * 1 - Agendado
 * 2 - Em andamento
 * 3 - Finalizado
 */

export function SchedulesDetails() {
  const [schedule, setSchedule] = useState<ISchedules>();
  const [schedulesFiles, setSchedulesFiles] = useState<any[]>([]);

  const [loadedImages, setLoadedImages] = useState<any[]>([]);

  const routes = useRoute();
  const { scheduleId } = routes.params as RouteParams;

  const { user } = useAuth();
  const { profile } = useProfile();

  async function fetchScheduleDetails() {
    setLoadedImages([]);
    const response = await api.get(`/schedules/${scheduleId}`);

    setSchedule(response.data);
    setSchedulesFiles(response.data.SchedulesFiles);

    response.data.SchedulesFiles.map((file: SchedulesFiles) =>
      setLoadedImages((oldState) => [...oldState, file])
    );
  }

  async function handleCancelSchedule() {
    Alert.alert(
      'Deseja realmente cancelar o agendamento?',
      'Essa acao nao pode ser desfeita',
      [
        {
          text: 'Cancelar',
          onPress: () => null,
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            await api.put(
              `/schedules/${schedule?.id}`,
              {
                status: 0,
              },
              {
                headers: {
                  id: user.id,
                },
              }
            );
            fetchScheduleDetails();
          },
        },
      ]
    );
  }

  useEffect(() => {
    fetchScheduleDetails();
  }, []);

  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader title="Detalhes do agendamento" />
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <VStack flex={1} px={5} py={5}>
          {schedule!.status === 4 && (
            <Center mb={10}>
              <Heading bold color="red.500">
                Agendamento cancelado!
              </Heading>
              <Text color="gray.400" px={5} textAlign="center">
                O agendamento foi cancelado e por isso não pode ser mais
                alterado.
              </Text>
            </Center>
          )}

          <HStack>
            <VStack>
              <Text fontSize="md" bold>
                Meus Dados
              </Text>
            </VStack>
          </HStack>

          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon
                  as={Feather}
                  name="activity"
                  size={8}
                  color="orange.500"
                />
              </VStack>
              <VStack ml={3}>
                <Text bold>Status</Text>
                <VStack alignItems="center">
                  {schedule?.status === 4 && (
                    <VStack>
                      <Text color="red.500" bold>
                        cancelado
                      </Text>
                    </VStack>
                  )}
                  {schedule?.status === 1 && (
                    <VStack>
                      <Text color="yellow.600" bold>
                        aguardando confirmacao
                      </Text>
                    </VStack>
                  )}
                  {schedule?.status === 2 && (
                    <Text color="orange.500" bold>
                      em andamento
                    </Text>
                  )}
                  {schedule?.status === 3 && (
                    <Text color="green.500" bold>
                      finalizado
                    </Text>
                  )}
                </VStack>
              </VStack>
            </HStack>
          </VStack>
          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon as={Feather} name="disc" size={8} color="orange.500" />
              </VStack>
              <VStack ml={3}>
                <Text bold>{schedule?.vehicles?.brand.name}</Text>
                <Text>{schedule?.vehicles?.name.name}</Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon
                  as={Feather}
                  name="life-buoy"
                  size={8}
                  color="orange.500"
                />
              </VStack>
              <VStack ml={3}>
                <Text>{schedule?.vehicles?.InsuranceCompanies.name}</Text>
              </VStack>
            </HStack>
          </VStack>
          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon as={Feather} name="user" size={8} color="orange.500" />
              </VStack>
              <VStack ml={3}>
                <Text
                  bold
                >{`${schedule?.users?.name} ${schedule?.users?.last_name}`}</Text>
                <Text>{user.email}</Text>
              </VStack>
            </HStack>
          </VStack>
          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon as={Feather} name="map-pin" size={8} color="orange.500" />
              </VStack>
              <VStack ml={3}>
                <Text bold>
                  {schedule?.users?.UsersAddresses?.address_line}
                </Text>
                <Text>
                  {profile.latitude},{profile.longitude}
                </Text>
              </VStack>
            </HStack>
          </VStack>
          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon as={Feather} name="info" size={8} color="orange.500" />
              </VStack>
              <VStack ml={3} w={250}>
                <Text>
                  {schedule?.notes ? schedule?.notes : 'Sem observações'}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        <VStack flex={1} px={5}>
          <Text bold>Dados do prestador</Text>
          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon
                  as={Feather}
                  name="briefcase"
                  size={8}
                  color="orange.500"
                />
              </VStack>
              <VStack ml={3}>
                <Text bold>{schedule?.location?.business_name}</Text>
                <Text>{user.email}</Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon as={Feather} name="map-pin" size={8} color="orange.500" />
              </VStack>
              <VStack ml={3}>
                <Text bold>{schedule?.location?.address_line}</Text>
                <Text>
                  {schedule?.location?.district}-{schedule?.location?.state}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon
                  as={Feather}
                  name="calendar"
                  size={8}
                  color="orange.500"
                />
              </VStack>
              <VStack ml={3}>
                <Text>
                  {schedule?.date
                    .toString()
                    .split('T')[0]
                    .split('-')
                    .reverse()
                    .toLocaleString()
                    .replace(/,/g, '/')}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon as={Feather} name="clock" size={8} color="orange.500" />
              </VStack>
              <VStack ml={3}>
                <Text>{schedule?.time}</Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon as={Feather} name="tool" size={8} color="orange.500" />
              </VStack>
              <VStack ml={3}>
                <Text>{schedule?.service_type?.name}</Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon as={Feather} name="image" size={8} color="orange.500" />
              </VStack>
              <VStack ml={3}>
                <Text>Midia</Text>
                <VStack>
                  {loadedImages.map((image) => (
                    <Image
                      key={image.id}
                      source={{
                        uri: `${api.defaults.baseURL}/schedules/documents/${schedule?.id}/${image.file_url}`,
                      }}
                      alt="Imagem do agendamento"
                      size={300}
                    />
                  ))}
                </VStack>
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={5}>
            <HStack>
              <VStack>
                <Icon as={Feather} name="info" size={8} color="orange.500" />
              </VStack>
              <VStack ml={3}>
                <Text bold>Notas do local</Text>
                <Text>
                  {schedule?.partner_notes
                    ? schedule?.partner_notes
                    : 'Sem observações ainda'}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={20}>
            {schedule?.status !== 4 && (
              <Button
                title="Cancelar agendamento"
                onPress={handleCancelSchedule}
              />
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
