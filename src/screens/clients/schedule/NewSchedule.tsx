import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
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
        await api
          .post(`/schedules/documents/${response.data.id}`, file, {
            headers: {
              id: user.id,
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(() => {
            navigation.navigate('taskDone', { date: selectedDate });
          });
      });

      await sendNotification(
        location?.users?.id as string,
        `Você recebeu um novo agendamento de ${user.name}`,
        'Novo agendamento',
        'schedule',
        user.id
      );
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
    }
  }

  async function fetchLocation() {
    try {
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });
      setLocation(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : 'Ocorreu um erro ao buscar';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
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

      {/* {location.state.isLoading && (
        <LoadingModal
          showModal={location.state.isLoading}
          message={'Carregando...'}
        />
      )} */}

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
                Tipo de servico
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
              Horario
            </Text>

            <Input
              placeholder={'Selecione um horario'}
              editable={false}
              value={time}
              caretHidden
              onPressIn={() => {
                DateTimePickerAndroid.open({
                  mode: 'time',
                  is24Hour: true,
                  value: new Date(),
                  onChange: (event, date) => setTime(handleTime(date as Date)),
                });
              }}
            />
            <Text fontSize="xs" color="gray.600" textAlign="justify" w={320}>
              O tempo medio de reparo e de 1 hora, no entanto pode ser
              necessario mais tempo. Nao se preocupe, seu mecanico ira
              informa-lo se necessario.
            </Text>
          </VStack>

          <VStack p={5} mb={5} backgroundColor="white" borderRadius={10}>
            <VStack>
              <Text bold>Informacoes adicionais (Opcional)</Text>
            </VStack>
            <VStack>
              <TextArea
                placeholder={'Descreva aqui os problemas apresentados'}
                w={'full'}
                h={150}
                fontSize="sm"
                color="gray.300"
                mt={5}
                onChangeText={(text) => setNotes(text)}
              />
            </VStack>
          </VStack>

          <UploadFileField
            upload={upload}
            GetUploadImage={GetUploadImage}
            text=" Você pode adicionar fotos adicionais que demonstram os problemas
            relatados e ajudam o prestador de serviço a ter o melhor
            entendimento do problema."
          />

          <Button title="Agendar" onPress={handleSubmit} />
        </ScrollView>
      </VStack>
    </VStack>
  );
}
