/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import getLogoImage from '@components/LogosImages';
import { StatusIcon } from '@components/StatusIcon';
import { TextArea } from '@components/TextArea';
import { IReviewDTO } from '@dtos/IReviewDTO';
import { ISchedules } from '@dtos/ISchedules';
import { Feather } from '@expo/vector-icons';
import { useNotification } from '@hooks/notification/useNotification';
import { useAuth } from '@hooks/useAuth';
import { useMapsLinking } from '@hooks/useMapsLinking';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import {
  FlatList,
  HStack,
  Heading,
  Icon,
  Image,
  Radio,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';

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

export function SchedulesDetails() {
  const [schedule, setSchedule] = useState<ISchedules>();
  const [loadedImages, setLoadedImages] = useState<any[]>([]);
  const [review, setReview] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  const [userReview, setUserReview] = useState<IReviewDTO>();

  const routes = useRoute();
  const { scheduleId } = routes.params as RouteParams;

  const { sendNotification } = useNotification();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user } = useAuth();
  const { deviceMapNavigation } = useMapsLinking();

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
  }, [scheduleId]);

  async function handleCancelSchedule() {
    Alert.alert(
      'Deseja realmente cancelar o agendamento?',
      'Essa ação não pode ser desfeita',
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
            await sendNotification(
              schedule?.location?.user_id as string,
              `O agendamento do dia ${schedule?.date
                ?.toString()
                .split('T')[0]
                .split('-')
                .reverse()
                .toLocaleString()
                .replace(
                  /,/g,
                  '/'
                )} as ${schedule?.time} foi cancelado pelo cliente`,
              'Agendamento cancelado',
              'schedule',
              user.id
            );
            fetchScheduleDetails();
          },
        },
      ]
    );
  }

  async function handleReviewSchedule() {
    try {
      await api.post(
        `/reviews`,
        {
          location_id: schedule?.location_id,
          rating,
          review,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchReviews() {
    try {
      const response = await api.get(
        `/reviews/comments/${schedule?.location_id}`,
        {
          headers: {
            id: user.id,
          },
        }
      );

      const userReview: IReviewDTO = response.data.find(
        (item: IReviewDTO) => item.user_id === user.id
      );

      setUserReview(userReview);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchScheduleDetails();
      fetchReviews();
      return () => {
        setSchedule(undefined);
        setLoadedImages([]);
      };
    }, [scheduleId])
  );

  console.log(rating);

  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader
          title="Detalhes do agendamento"
          navigation={navigation}
          screen="schedulesList"
        />
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <VStack px={5} mt={3}>
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
              <Text color="gray.400" textAlign="center">
                O agendamento foi cancelado e por isso não pode ser alterado.
              </Text>
            </VStack>
          )}

          <VStack backgroundColor="white" p={5} borderRadius={10}>
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
                  <Text>Aguardando confirmação</Text>
                  <Text fontSize={'xs'} color="gray.400">
                    Seu agendamento esta pendente de confirmação
                  </Text>
                </VStack>
              )}
              {schedule?.status === 2 && (
                <VStack alignItems="center">
                  <Text>Em processo de analise</Text>
                  <Text fontSize={'xs'} color="gray.400">
                    Seu agendamento está em processo de análise e o prestador de
                    serviço entrará em contato.
                  </Text>
                </VStack>
              )}
              {schedule?.status === 3 && (
                <VStack alignItems="center">
                  <Text>Finalizado</Text>
                  <Text fontSize={'xs'} color="gray.400">
                    Seu agendamento foi confirmado, aguarde o prestador de
                    serviço entrar em contato.
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

          <VStack mt={5} backgroundColor="white" p={3} borderRadius={10}>
            <HStack
              justifyContent="space-between"
              backgroundColor="white"
              borderRadius={10}
            >
              <VStack>
                <Text bold>Veículo</Text>
                <Text bold fontSize={'md'}>
                  {schedule?.vehicles?.brand.name}
                </Text>
                <Text fontSize={'md'}>
                  {schedule?.vehicles?.name.name} / {schedule?.vehicles?.year}
                </Text>
              </VStack>
              <VStack>
                {schedule?.vehicles?.brand.icon && (
                  <Image
                    source={getLogoImage(schedule?.vehicles?.brand.icon)}
                    alt={'Carro'}
                    size={60}
                  />
                )}
              </VStack>
            </HStack>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={3} borderRadius={10}>
            <Text bold>Seguradora</Text>
            <VStack>
              <Text>{schedule?.vehicles?.InsuranceCompanies.name}</Text>
            </VStack>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={3} borderRadius={10}>
            <Text bold>Tipo de serviço</Text>
            <Text>{schedule?.notes ? schedule?.notes : 'Sem observações'}</Text>
          </VStack>
        </VStack>

        <VStack flex={1} px={5}>
          <Text bold>Dados do prestador</Text>

          <VStack mt={5} backgroundColor="white" p={3} borderRadius={10}>
            <Text>Local</Text>
            <Text bold>{schedule?.location?.business_name}</Text>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={3} borderRadius={10}>
            <Text bold>Endereço</Text>
            <Text>
              {schedule?.location?.address_line}, {schedule?.location?.number}
            </Text>
            <Text>
              {schedule?.location?.district} / {schedule?.location?.state}
            </Text>

            <Button
              mt={1}
              title="Ver no mapa"
              backgroundColor={'purple.500'}
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
            />
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Data do pedido de agendamento</Text>
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
            <Text bold>Horário</Text>
            <Text>{schedule?.time}</Text>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Categoria de serviço</Text>
            <Text>{schedule?.service_type?.name}</Text>
          </VStack>

          <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold>Imagens e Videos</Text>
            <HStack pt={2}>
              <VStack>
                <FlatList
                  data={loadedImages}
                  horizontal
                  pagingEnabled
                  snapToAlignment="start"
                  renderItem={({ item }) => (
                    <Image
                      borderRadius={10}
                      key={item}
                      source={{
                        uri: `${api.defaults.baseURL}/schedules/documents/${schedule?.id}/${item.file_url}`,
                      }}
                      alt="Imagem do agendamento"
                      size={350}
                    />
                  )}
                  ListEmptyComponent={() => (
                    <Text color="gray.400">Sem imagens</Text>
                  )}
                />
              </VStack>
            </HStack>
          </VStack>

          {schedule?.status === 3 && (
            <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
              <HStack>
                <VStack>
                  <Icon as={Feather} name="info" size={8} color="purple.500" />
                </VStack>
                <VStack ml={3}>
                  <Text bold>Informações finais</Text>
                  <Text>{schedule?.partner_notes}</Text>
                </VStack>
              </HStack>
            </VStack>
          )}

          {userReview && (
            <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
              <HStack>
                <VStack ml={3}>
                  <Text bold>Seus comentários</Text>
                  <Text>{userReview.review}</Text>
                  <Text>Nota: {userReview.rating}</Text>
                </VStack>
              </HStack>
            </VStack>
          )}

          <VStack mt={20}>
            {schedule?.status === 1 && (
              <Button
                title="Cancelar agendamento"
                onPress={handleCancelSchedule}
              />
            )}

            {schedule?.status === 2 && (
              <Button
                title="Cancelar agendamento"
                onPress={handleCancelSchedule}
              />
            )}
          </VStack>

          {schedule?.status === 3 && userReview === null && (
            <VStack mt={5} backgroundColor="white" p={5} borderRadius={10}>
              <VStack>
                <TextArea
                  placeholder={'Deixe uma avaliação'}
                  value={review}
                  onChangeText={setReview}
                />
                <Text bold pb={3}>
                  Nota
                </Text>
              </VStack>
              <Radio.Group
                name="rating"
                colorScheme={'purple'}
                mb={3}
                onChange={(value) => setRating(Number(value))}
              >
                <HStack>
                  <Radio value="0" size="sm">
                    <Text mr={3}>0</Text>
                  </Radio>

                  <Radio value="1" size="sm">
                    <Text mr={3}>1</Text>
                  </Radio>
                  <Radio value="2" size="sm">
                    <Text mr={3}>2</Text>
                  </Radio>
                  <Radio value="3" size="sm">
                    <Text mr={3}>3</Text>
                  </Radio>
                  <Radio value="4" size="sm">
                    <Text mr={3}>4</Text>
                  </Radio>
                  <Radio value="5" size="sm">
                    <Text mr={3}>5</Text>
                  </Radio>
                </HStack>
              </Radio.Group>
              <Button title="Avaliar" onPress={handleReviewSchedule} />
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </VStack>
  );
}
