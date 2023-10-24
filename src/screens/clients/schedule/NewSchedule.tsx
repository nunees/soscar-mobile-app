import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import { PartnerCard } from '@components/PartnerCard';
import { ScheduleCalendar } from '@components/ScheduleCalendar';
import { Select } from '@components/Select';
import { SelectBusinessCategories } from '@components/SelectBusinessCategories';
import { TextArea } from '@components/TextArea';
import { ILocation } from '@dtos/ILocation';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useAuth } from '@hooks/useAuth';
import { useUploadImage } from '@hooks/useUploadImage';
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
import {
  VStack,
  ScrollView,
  HStack,
  Text,
  useToast,
  Image,
  Progress,
  FlatList,
} from 'native-base';
import { useCallback, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

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
  const [message, setMessage] = useState<string>('');

  const [isPhotoLoading, setIsPhotoLoading] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [files, setfiles] = useState<any[]>([]);

  const [location, setLocation] = useState<ILocation>();

  const [userVehicles, setUserVehicles] = useState<IVehicleDTO[]>();
  const [vehicle_id, setVehicle_id] = useState<string>();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  const [requiredServices, setRequiredServices] = useState<number>();

  const [notes, setNotes] = useState<string>('');

  const [uploadForms, setUploadForms] = useState<FormData[]>([]);

  const routes = useRoute();
  const { user } = useAuth();
  const { locationId, typeofService } = routes.params as RouteParamsProps;

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { handleUserProfilePictureSelect } = useUploadImage();

  async function uploadImage() {
    try {
      setIsPhotoLoading(true);
      setProgressValue(15);

      setProgressValue(30);
      const file = await handleUserProfilePictureSelect(user.id, 'document');
      if (!file!.userPhotoUploadForm) {
        throw new AppError('Erro ao anexar arquivo');
      }

      setProgressValue(60);
      setfiles([...files, file?.photoFile]);

      setProgressValue(80);
      setUploadForms([...uploadForms, file!.userPhotoUploadForm]);

      setProgressValue(100);
      toast.show({
        title: 'Arquivo anexado',
        placement: 'top',
        bgColor: 'green.500',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro na atualização';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setProgressValue(0);
      setIsPhotoLoading(false);
    }
  }

  async function handleSubmit() {
    try {
      setIsLoading(true);

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

      console.log(response.data);

      uploadForms.map(async (form) => {
        console.log(form);
        await api.post(`/schedules/documents/${response.data.id}`, form, {
          headers: {
            id: user.id,
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      navigation.navigate('taskDone', { date: selectedDate });
    } catch (error) {
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError ? error.message : 'Erro ao agendar',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          setIsLoading(true);
          setMessage('Buscando informacoes...');
          const response = await api.get(`/locations/${locationId}`, {
            headers: {
              id: user.id,
            },
          });
          setLocation(response.data);
          // setServices(response.data.business_categories);

          const vehicles = await api.get(`/vehicles`, {
            headers: {
              id: user.id,
            },
          });

          if (vehicles.data.length === 0) {
            Alert.alert(
              'Você não possui veículos cadastrados',
              'Por favor, cadastre um veículo para continuar',
              [
                {
                  text: 'Cadastrar',
                  onPress: () => {
                    navigation.navigate('addVehicle');
                  },
                },

                {
                  text: 'Voltar',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ]
            );
            return;
          }

          setUserVehicles(vehicles.data);
        } catch (error) {
          toast.show({
            title: 'Erro ao buscar parceiros',
            placement: 'top',
            bgColor: 'red.500',
          });
        } finally {
          setIsLoading(false);
        }
      }

      fetchData();
    }, [])
  );

  console.log('Render');

  return (
    <VStack>
      <VStack>
        <AppHeader
          title="Novo agendamento"
          navigation={navigation}
          screen="searchSchedule"
        />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={setIsLoading}
          message={message}
        />
      )}

      <VStack pt={3} px={5}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 130,
          }}
        >
          {location && <PartnerCard location={location} />}
          <VStack>
            <Button title="Mais informacoes" fontSize={'xs'} h={10} mb={1} />
            <Button title="Mostrar no mapa" fontSize={'xs'} h={10} mb={3} />
          </VStack>

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
                  userVehicles
                    ? userVehicles.map((item) => {
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

          <VStack p={5} mb={5} backgroundColor="white" borderRadius={10}>
            <HStack mb={5}>
              <Text fontSize="xs" color="gray.500" textAlign="justify">
                Você pode adicionar fotos adicionais que demonstram os problemas
                relatados e ajudam o prestador de serviço a ter o melhor
                entendimento do problema.
              </Text>
            </HStack>
            <VStack>
              <FlatList
                horizontal
                data={files}
                pagingEnabled
                indicatorStyle="white"
                snapToAlignment="start"
                decelerationRate={'fast'}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity>
                    <Image
                      w={350}
                      height={200}
                      source={item}
                      alt="User image"
                    />
                  </TouchableOpacity>
                )}
              />

              <Button
                title="Carregar foto"
                variant="light"
                fontSize={'sm'}
                fontWeight={'normal'}
                onPress={uploadImage}
                mt={5}
              />
              {isPhotoLoading && (
                <Progress
                  mt={3}
                  value={progressValue}
                  w={'full'}
                  colorScheme={'purple'}
                />
              )}
            </VStack>
          </VStack>

          <Button
            title="Agendar"
            onPress={handleSubmit}
            isLoading={isLoading}
          />
        </ScrollView>
      </VStack>
    </VStack>
  );
}
