/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import getLogoImage from '@components/LogosImages';
import { StatusIcon } from '@components/StatusIcon';
import { TextArea } from '@components/TextArea';
import { ISchedules } from '@dtos/ISchedules';
import { AppError } from '@utils/AppError';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useMapsLinking } from '@hooks/useMapsLinking';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import {
  HStack,
  Heading,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base';
import { useCallback, useState } from 'react';
import { Alert, Linking, TouchableOpacity } from 'react-native';

type RouteParams = {
  scheduleId: string;
};

type SchedulesFiles = {
  id: string;
  file_url: string;
};

/**

 * 1 - Agendado
 * 2 - Aguardando confirmacao
 * 3 - Em analise
 * 4 - Realizado
 */

export function ScheduleDetail() {
  const [isLoading, setIsLoading] = useState(false);

  const [schedule, setSchedule] = useState<ISchedules>();
  const [loadedImages, setLoadedImages] = useState<any[]>([]);

  const [observation, setObservation] = useState<string>('');

  const routes = useRoute();
  const toast = useToast();
  const { scheduleId } = routes.params as RouteParams;

  const { user } = useAuth();
  const { deviceMapNavigation } = useMapsLinking();

  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const fetchScheduleDetails = useCallback(async () => {
    try {
      const response = await api.get(`/schedules/find/${scheduleId}`, {
        headers: {
          id: user.id,
        },
      });

      setSchedule(response.data);

      setSchedule(response.data);
      response.data.SchedulesFiles.map((file: SchedulesFiles) =>
        setLoadedImages((oldState) => [...oldState, file])
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

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
                status: 4,
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

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await api.put(
        `/schedules/${scheduleId}`,
        {
          status: 3,
          partner_notes: observation || 'Nenhuma observacao adicionada',
        },
        {
          headers: {
            id: user.id,
          },
        }
      );
      navigation.navigate('orders');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : 'Ocorreu um erro ao enviar';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchScheduleDetails();
      return () => {
        setSchedule({} as ISchedules);
        setLoadedImages([]);
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      async function handleStatus() {
        if (schedule?.status === 1 || schedule?.status === 2) {
          await api.put(
            `/schedules/${scheduleId}`,
            {
              status: 2,
            },
            {
              headers: {
                id: user.id,
              },
            }
          );
        }
      }

      handleStatus();
    }, [])
  );

  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader
          title="Detalhes do agendamento"
          navigation={navigation}
          screen="orders"
        />
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <VStack px={5} py={5}>
          {schedule?.status === 4 && (
            <VStack
              mb={10}
              px={5}
              backgroundColor="white"
              borderRadius={10}
              p={5}
              alignItems="center"
            >
              <Heading bold color="red.500">
                Agendamento cancelado!
              </Heading>
              <Text color="gray.400" px={5} textAlign="center">
                O agendamento foi cancelado e por isso não pode ser alterado.
              </Text>
            </VStack>
          )}

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={3}>
              {' '}
              Status
            </Text>
            <StatusIcon
              status={Number(schedule?.status)}
              accepted={schedule?.status === 3}
            />
            <VStack alignItems="center">
              {schedule?.status === 4 && (
                <VStack alignItems="center">
                  <Text>Cancelado</Text>
                  <Text fontSize={'xs'} color="gray.400">
                    Seu agendamento foi cancelado
                  </Text>
                </VStack>
              )}
              {schedule?.status === 1 && (
                <VStack alignItems="center">
                  <Text>Aguardando confirmacao</Text>
                  <Text fontSize={'xs'} color="gray.400">
                    Seu agendamento esta pendente de confirmacao
                  </Text>
                </VStack>
              )}
              {schedule?.status === 2 && (
                <VStack alignItems="center">
                  <Text>Em processo de analise</Text>
                  <Text fontSize={'xs'} color="gray.400">
                    Seu agendamento esta em processo de analise e o prestador de
                    servico entrara em contato.
                  </Text>
                </VStack>
              )}
              {schedule?.status === 3 && (
                <VStack alignItems="center">
                  <Text>Finalizado</Text>
                  <Text fontSize={'xs'} color="gray.400">
                    Seu agendamento foi confirmado, aguarde o prestador de
                    servico entrar em contato.
                  </Text>
                </VStack>
              )}
            </VStack>
          </VStack>

          <VStack mt={5}>
            <Text fontSize="md" bold>
              Meus Dados
            </Text>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <HStack
              justifyContent="space-between"
              backgroundColor="white"
              borderRadius={10}
            >
              <VStack>
                <Text bold>Veiculo</Text>
                <Text bold fontSize={'lg'}>
                  {schedule?.vehicles?.brand.name}
                </Text>
                <HStack>
                  <Text fontSize={'md'}>{schedule?.vehicles?.name.name}</Text>
                  <Text> / </Text>
                  <Text fontSize={'md'}>{schedule?.vehicles?.year}</Text>
                </HStack>
                <Text fontSize={'xs'}>{schedule?.vehicles?.plate}</Text>
              </VStack>
              <VStack>
                {schedule?.vehicles?.brand.icon && (
                  <Image
                    source={getLogoImage(schedule?.vehicles?.brand.icon)}
                    alt={'Carro'}
                    size={100}
                  />
                )}
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Seguradora</Text>
            <VStack>
              <Text>{schedule?.vehicles?.InsuranceCompanies.name}</Text>
            </VStack>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Informacoes do usuario</Text>
            <Text>{schedule?.notes ? schedule?.notes : 'Sem observações'}</Text>
          </VStack>
        </VStack>

        <VStack flex={1} px={5}>
          <Text bold>Dados do prestador</Text>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Local de servico</Text>
            <Text>{schedule?.location?.business_name}</Text>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Endereco</Text>
            <Text>
              {schedule?.location?.address_line}, {schedule?.location?.number} -{' '}
              {schedule?.location?.district} / {schedule?.location?.state}
            </Text>

            <TouchableOpacity
              onPress={() =>
                schedule?.location &&
                Linking.openURL(
                  deviceMapNavigation(
                    schedule.location.latitude,
                    schedule.location.longitude,
                    schedule.location.business_name
                  )
                )
              }
            >
              <Text color="purple.500" bold>
                Ver no mapa
              </Text>
            </TouchableOpacity>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Data</Text>
            <Text>
              {schedule?.date
                ?.toString()
                .split('T')[0]
                .split('-')
                .reverse()
                .toLocaleString()
                .replace(/,/g, '/')}
            </Text>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Horario</Text>
            <Text>{schedule?.time}</Text>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Servico</Text>
            <Text>{schedule?.service_type?.name}</Text>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Imagens e Videos</Text>
            <HStack pt={2}>
              <VStack>
                {loadedImages.map((image) => (
                  <Image
                    borderRadius={10}
                    key={image.id}
                    source={{
                      uri: `${api.defaults.baseURL}/schedules/documents/${schedule?.id}/${image.file_url}`,
                    }}
                    alt="Imagem do agendamento"
                    size={350}
                  />
                ))}
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <HStack>
              <VStack>
                <Icon as={Feather} name="info" size={8} color="purple.500" />
              </VStack>
              <VStack ml={3}>
                <Text bold>Informacoes adicionais</Text>
              </VStack>
            </HStack>
            <HStack py={3}>
              {schedule?.status === 4 ||
                (schedule?.status === 3 && (
                  <VStack>
                    <Text>{schedule.partner_notes}</Text>
                  </VStack>
                ))}
              {schedule?.status === 1 ||
                (schedule?.status === 2 && (
                  <VStack>
                    <TextArea
                      w={330}
                      h={150}
                      value={observation}
                      onChangeText={setObservation}
                      placeholder="Voce pode adicionar informacoes adicionais para o cliente."
                    />
                  </VStack>
                ))}
            </HStack>
          </VStack>

          <VStack mt={20}>
            {schedule?.status !== 4 && schedule?.status !== 3 && (
              <VStack>
                <Button
                  title="Confirmar Agendamento"
                  onPress={handleSubmit}
                  mb={3}
                  isLoading={isLoading}
                  isLoadingText="Enviando..."
                />
                <Button
                  title="Cancelar agendamento"
                  onPress={handleCancelSchedule}
                  variant="outline"
                  mb={3}
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
