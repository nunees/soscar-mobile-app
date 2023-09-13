import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { TextArea } from '@components/TextArea';
import { ISchedules } from '@dtos/ISchedules';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  Center,
  HStack,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

type RouteParams = {
  scheduleId: string;
};

type SchedulesFiles = {
  id: string;
  file_url: string;
};

/**
 * 1 - Agendado
 * 2 - Em andamento
 * 3 - Finalizado
 * 4 - Cancelado
 */

export function ScheduleDetail() {
  const [schedule, setSchedule] = useState<ISchedules>();
  const [schedulesFiles, setSchedulesFiles] = useState<any[]>([]);
  const [partnerNotes, setPartnerNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [loadedImages, setLoadedImages] = useState<any[]>([]);

  const routes = useRoute();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();
  const { scheduleId } = routes.params as RouteParams;

  const { user } = useAuth();
  const { profile } = useProfile();
  const toast = useToast();

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
    setIsLoading(true);
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
            try {
              setIsLoading(true);
              await api.put(
                `/schedules/${schedule?.id}`,
                {
                  status: 4,
                  partner_notes: partnerNotes,
                },
                {
                  headers: {
                    id: user.id,
                  },
                }
              );
              toast.show({
                title: 'Agendamento cancelado',
                placement: 'top',
                bgColor: 'green.500',
              });
              setIsLoading(false);
              navigation.navigate('home');
            } catch (error) {
              setIsLoading(false);
              const isAppError = error instanceof AppError;
              toast.show({
                title: isAppError ? error.message : 'Erro ao anexar arquivos',
                placement: 'top',
                bgColor: 'red.500',
              });
            }
          },
        },
      ]
    );
    setIsLoading(false);
  }

  async function handleApproveSchedule() {
    try {
      setIsLoading(true);
      await api.put(
        `/schedules/${schedule?.id}`,
        {
          status: 2,
          partner_notes: partnerNotes,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );
      toast.show({
        title: 'Agendamento aprovado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });
      setIsLoading(false);
      navigation.navigate('home');
    } catch (error) {
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError ? error.message : 'Erro ao anexar arquivos',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchScheduleDetails();
  }, []);

  return (
    <VStack flex={1}>
      <HStack>
        <AppHeader title="Detalhes do agendamento" />
      </HStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <VStack flex={1} px={5} py={5}>
          <HStack justifyContent="space-between">
            <VStack>
              <Text fontSize="md" bold>
                Informacoes do cliente
              </Text>
            </VStack>
            <VStack>
              <TouchableOpacity onPress={() => fetchScheduleDetails()}>
                <Icon
                  as={Feather}
                  name="message-square"
                  size={8}
                  color="orange.500"
                />
              </TouchableOpacity>
            </VStack>
          </HStack>

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
                <Text>{schedule?.users?.email}</Text>
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
        </VStack>

        <VStack flex={1} px={5}>
          <Text bold>Dados do prestador</Text>

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

          <VStack mt={10}>
            <VStack ml={3}>
              <Text bold>Seus comentarios</Text>
              <TextArea
                placeholder={'Digite aqui suas observacoes'}
                w={'full'}
                h={150}
                fontSize="sm"
                color="gray.300"
                onChangeText={(text) => setPartnerNotes(text)}
              />
            </VStack>
          </VStack>

          <VStack mt={20}>
            {schedule?.status === 0 ? (
              <Center>
                <Text bold fontSize="md">
                  Agendamento cancelado
                </Text>
              </Center>
            ) : (
              <VStack>
                <Button
                  title="Aprovar agendamento"
                  onPress={handleApproveSchedule}
                  mb={2}
                  backgroundColor="green.500"
                  isLoading={isLoading}
                />
                <Button
                  title="Cancelar agendamento"
                  onPress={handleCancelSchedule}
                  backgroundColor="red.500"
                  isLoading={isLoading}
                />
              </VStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
