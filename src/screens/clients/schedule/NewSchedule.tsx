import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { LoadingModal } from '@components/LoadingModal';
import { PartnerCard } from '@components/PartnerCard';
import { ScheduleCalendar } from '@components/ScheduleCalendar';
import { Select } from '@components/Select';
import { SelectBusinessCategories } from '@components/SelectBusinessCategories';
import { TextArea } from '@components/TextArea';
import { UploadFileField } from '@components/UploadFileField';
import { ILocation } from '@dtos/ILocation';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useNotification } from '@hooks/notification/useNotification';
import { useAuth } from '@hooks/useAuth';
import { useUploadFormData } from '@hooks/useUploadFormData';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { handleTime } from '@utils/DateTime';
import { VStack, ScrollView, Text, useToast } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

type RouteParamsProps = {
  locationId: string;
  typeofService: number;
};

type VehicleSelect = {
  label: string;
  value: string;
};

export function NewSchedule() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [vehicle_id, setVehicle_id] = useState<string>();

  const [vehicles, setVehicles] = useState<IVehicleDTO[]>();
  const [location, setLocation] = useState<ILocation>();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [requiredServices, setRequiredServices] = useState<number>();
  const [notes, setNotes] = useState<string>('');

  const routes = useRoute();
  const { user } = useAuth();
  const { locationId, typeofService } = routes.params as RouteParamsProps;

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  const { upload, GetUploadImage } = useUploadFormData('document');
  const { sendNotification } = useNotification();

  async function handleSubmit() {
    try {
      setIsSubmiting(true);
      const response = await api.post(
        '/schedules',
        {
          vehicle_id,
          location_id: locationId,
          service_type: Number(requiredServices),
          date: selectedDate,
          time,
          notes,
        },
        {
          headers: {
            id: user.id,
            'Content-Type': 'application/json',
          },
        }
      );

      upload.data?.forEach(async (file) => {
        await api.post(`/schedules/documents/${response.data.id}`, file, {
          headers: {
            id: user.id,
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      await sendNotification(
        location?.user_id as string,
        `Você têm um novo pedido de agendamento de <strong>${user.name}</strong> , abra o app e confira`,
        'Novo agendamento 🤩',
        'schedule',
        user.id
      );
      setIsSubmiting(false);
      navigation.navigate('taskDone', { date: selectedDate });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'Ocorreu um erro ao enviar o agendamento';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsSubmiting(false);
    }
  }

  async function fetchLocation() {
    try {
      setIsLoading(true);
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });
      setLocation(response.data);
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : 'Ocorreu um erro ao buscar';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchVehicles() {
    const response = await api.get('/vehicles', {
      headers: {
        id: user.id,
      },
    });
    setVehicles(response.data);
  }

  useFocusEffect(
    useCallback(() => {
      fetchLocation();
      fetchVehicles();
    }, [locationId, typeofService])
  );

  useEffect(() => {
    if (vehicles?.length === 0) {
      Alert.alert(
        'Você não possui veículos cadastrados',
        'Cadastre um veículo para poder agendar um serviço',
        [
          {
            text: 'Ok',
            onPress: () => navigation.navigate('addVehicle'),
          },
        ]
      );
    }
  }, [vehicles]);

  return (
    <VStack>
      <VStack>
        <AppHeader
          title="Novo agendamento"
          navigation={navigation}
          screen="searchSchedule"
          payload={{ serviceId: typeofService }}
        />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          message={'Carregando...'}
          setShowModal={setIsLoading}
        />
      )}

      <VStack pt={3} px={5}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 130,
          }}
        >
          {location && (
            <PartnerCard
              location={location}
              onPress={() =>
                navigation.navigate('locationDetails', {
                  locationId: location.id,
                })
              }
            />
          )}

          <VStack p={5} mb={5} backgroundColor="white" borderRadius={10}>
            <VStack>
              <Text bold pb={1}>
                Tipo de serviço
              </Text>
            </VStack>
            <VStack>
              <SelectBusinessCategories
                label={'Tipo de Serviço'}
                categoryOfService={typeofService}
                onValueChange={(value) => setRequiredServices(Number(value))}
              />
            </VStack>
          </VStack>

          <VStack p={5} mb={5} backgroundColor="white" borderRadius={10}>
            <VStack>
              <Text bold pb={1}>
                Veículo
              </Text>
              <Select
                label={'Selecione um veículo'}
                data={
                  vehicles
                    ? vehicles.map((item) => {
                        return {
                          label: `${item.brand.name} - ${item.name.name}`,
                          value: String(item.id),
                        } as VehicleSelect;
                      })
                    : []
                }
                onValueChange={(value) => setVehicle_id(value)}
              />
            </VStack>
          </VStack>

          <VStack
            p={5}
            mb={5}
            backgroundColor="white"
            borderRadius={10}
            justifyContent="space-between"
          >
            <Text bold pb={1}>
              Data
            </Text>

            <ScheduleCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </VStack>

          <VStack
            p={5}
            mb={5}
            backgroundColor="white"
            borderRadius={10}
            justifyContent="space-between"
          >
            <Text bold pb={1}>
              Horário
            </Text>

            {time && (
              <Text mb={3} fontSize={'2xl'} textAlign={'center'}>
                {time}
              </Text>
            )}

            <Button
              title="Selecionar horário"
              bgColor={'purple.500'}
              mb={2}
              onPress={() => {
                DateTimePickerAndroid.open({
                  mode: 'time',
                  is24Hour: true,
                  value: new Date(),
                  onChange: (event, date) => setTime(handleTime(date as Date)),
                });
              }}
            />
            <Text
              fontSize="xxs"
              color="gray.600"
              textAlign="justify"
              w={320}
              onPressIn={() => console.log('ok')}
            >
              O tempo médio de reparo é de 1 hora, no entanto pode ser
              necessário mais tempo. Não se preocupe, seu mecânico irá
              informá-lo se necessário.
            </Text>
          </VStack>

          <VStack p={5} mb={5} backgroundColor="white" borderRadius={10}>
            <VStack>
              <Text bold>Informações adicionais (Opcional)</Text>
            </VStack>
            <VStack>
              <TextArea
                w={'full'}
                h={150}
                fontSize="sm"
                color="gray.900"
                mt={5}
                onChangeText={(text) => setNotes(text)}
              />
            </VStack>
          </VStack>

          <UploadFileField
            upload={upload}
            GetUploadImage={GetUploadImage}
            text="Imagens"
          />

          <Button
            title="Agendar"
            onPress={handleSubmit}
            isLoading={isSubmiting}
            isLoadingText={'Agendando...'}
          />
          <Button
            title="Cancelar"
            bgColor="red.500"
            mt={3}
            onPress={() => navigation.navigate('home')}
          />
        </ScrollView>
      </VStack>
    </VStack>
  );
}
