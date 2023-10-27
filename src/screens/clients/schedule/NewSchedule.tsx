import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import { PartnerCard } from '@components/PartnerCard';
import { ScheduleCalendar } from '@components/ScheduleCalendar';
import { Select } from '@components/Select';
import { SelectBusinessCategories } from '@components/SelectBusinessCategories';
import { TextArea } from '@components/TextArea';
import { UploadFileField } from '@components/UploadFileField';
import { ILocation } from '@dtos/ILocation';
import { ISchedules } from '@dtos/ISchedules';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useAxiosFetch } from '@hooks/axios/useAxiosFetch';
import { useAxiosPost } from '@hooks/axios/useAxiosPost';
import { useAuth } from '@hooks/useAuth';
import { useUploadFormData } from '@hooks/useUploadFormData';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { handleTime } from '@utils/DateTime';
import { VStack, ScrollView, Text } from 'native-base';
import { useState } from 'react';

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

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [requiredServices, setRequiredServices] = useState<number>();
  const [notes, setNotes] = useState<string>('');

  const routes = useRoute();
  const { user } = useAuth();
  const { locationId, typeofService } = routes.params as RouteParamsProps;

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { upload, GetUploadImage } = useUploadFormData('document');
  const { postState, postData } = useAxiosPost<ISchedules>();

  async function handleSubmit() {
    await postData({
      url: '/schedules',
      method: 'post',
      data: {
        vehicle_id,
        location_id: locationId,
        service_type: Number(requiredServices),
        date: selectedDate,
        time,
        notes,
      },
      headers: {
        id: user.id,
        'Content-Type': 'application/json',
      },
    });

    upload.data?.forEach(async (file) => {
      await api
        .post(`/schedules/documents/${postState.data.id}`, file, {
          headers: {
            id: user.id,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          navigation.navigate('taskDone', { date: selectedDate });
        });
    });
  }

  const location = useAxiosFetch<ILocation>({
    url: `/locations/${locationId}`,
    method: 'get',
    headers: {
      id: user.id,
    },
  });

  const vehicles = useAxiosFetch<IVehicleDTO[]>({
    url: '/vehicles',
    method: 'get',
    headers: {
      id: user.id,
    },
  });

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

      {location.state.isLoading && (
        <LoadingModal
          showModal={location.state.isLoading}
          message={'Carregando...'}
        />
      )}

      <VStack pt={3} px={5}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 130,
          }}
        >
          {location && <PartnerCard location={location.state.data} />}

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
                  vehicles.state.data
                    ? vehicles.state?.data.map((item) => {
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

          <Button
            title="Agendar"
            onPress={handleSubmit}
            isLoading={postState.isLoading}
          />
        </ScrollView>
      </VStack>
    </VStack>
  );
}
