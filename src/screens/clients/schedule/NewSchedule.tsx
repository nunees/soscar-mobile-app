import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { SelectBusinessCategories } from '@components/SelectBusinessCategories';
import { TextArea } from '@components/TextArea';
import { ILocation } from '@dtos/ILocation';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  VStack,
  ScrollView,
  HStack,
  Heading,
  Text,
  useToast,
  Icon,
  Image,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

type RouteParamsProps = {
  locationId: string;
  typeofService: number;
};

type VehicleSelect = {
  label: string;
  value: string;
};

const ICON_SIZE = 5;

export function NewSchedule() {
  const [files, setfiles] = useState<any[]>([]);

  const [location, setLocation] = useState<ILocation>();

  const [userVehicles, setUserVehicles] = useState<IVehicleDTO[]>();
  const [vehicle_id, setVehicle_id] = useState<string>();
  const [services, setServices] = useState<number[]>();

  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  const [requiredServices, setRequiredServices] = useState<number>();

  const [notes, setNotes] = useState<string>('');

  const routes = useRoute();
  const { user } = useAuth();
  const { locationId, typeofService } = routes.params as RouteParamsProps;

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const userPhotoUploadForm = new FormData();

  function getWeekDay(date: Date) {
    const weekdays = [
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sabado',
      'Domingo',
    ];
    const currentWeekday = weekdays[date.getDay()];
    return currentWeekday;
  }

  async function handleUserProfilePictureSelect() {
    try {
      const media = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        aspect: [4, 4],
      });

      if (media.canceled) {
        return;
      }

      if (media.assets[0].uri) {
        const mediaInfo = (await FileSystem.getInfoAsync(
          media.assets[0].uri
        )) as IFileInfo;

        if (mediaInfo?.size && mediaInfo.size / 1021 / 1024 > 30) {
          toast.show({
            title: 'O arquivo deve ter no máximo 30MB',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        const fileExtension = media.assets[0].uri.split('.').pop();
        if (
          fileExtension !== 'jpg' &&
          fileExtension !== 'jpeg' &&
          fileExtension !== 'png' &&
          fileExtension !== 'mp4' &&
          fileExtension !== 'pdf'
        ) {
          toast.show({
            title: 'Formato de arquivo não suportado',
            placement: 'top',
            bgColor: 'red.500',
          });
          return;
        }

        const file = {
          name: `${user.username}.${fileExtension}`.toLowerCase(),
          uri: media.assets[0].uri,
          type: `${media.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        // userPhotoUploadForm.append('document', file);

        setfiles([...files, file]);

        toast.show({
          title: 'Arquivo anexado',
          placement: 'top',
          bgColor: 'green.500',
        });
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro na atualização';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  function handleDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    setDate(`${day}/${month}/${year}`);
  }

  function handleTime(date: Date) {
    const fullHours = date.toLocaleTimeString('pt-BR');
    const currentTime = fullHours.split(':');
    setTime(`${currentTime[0]}:${currentTime[1]}`);
  }

  async function fetchData() {
    try {
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });
      setLocation(response.data);
      setServices(response.data.business_categories);

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
    }
  }

  async function handleSubmit() {
    try {
      const response = await api.post(
        '/schedules',
        {
          vehicle_id,
          location_id: locationId,
          service_type: Number(requiredServices),
          date,
          time,
          notes,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );

      try {
        files.map(async (file) => {
          console.log('hit');
          userPhotoUploadForm.append('document', file);
          await api.post(
            `/schedules/documents/${response.data.id}`,
            userPhotoUploadForm,
            {
              headers: {
                id: user.id,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
        });
      } catch (error) {
        toast.show({
          title: 'Erro ao anexar arquivos',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    } catch (error) {
      toast.show({
        title: 'Erro ao agendar serviço',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VStack pb={10}>
      <VStack>
        <AppHeader title="Novo agendamento" />
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false} marginBottom={100}>
        <VStack>
          {location && (
            <VStack px={5} key={location.id}>
              <VStack>
                <VStack ml={2} mb={3}>
                  <HStack py={5}>
                    <VStack>
                      <Heading>{location.business_name}</Heading>
                      <Text>100 Avaliações</Text>
                      <Text>{location.users?.name}</Text>
                      <Text>Telefone: {location.business_phone}</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          )}

          <VStack px={5}>
            <HStack mr={5} mb={5}>
              <HStack mt={2}>
                <Icon
                  as={Feather}
                  name="tool"
                  color="orange.600"
                  size={ICON_SIZE}
                />
              </HStack>
              <HStack>
                <SelectBusinessCategories
                  label={'Tipo de Serviço'}
                  categoryOfService={typeofService}
                  onValueChange={(value) => setRequiredServices(Number(value))}
                />
              </HStack>
            </HStack>

            <HStack mr={5} mb={5}>
              <HStack mt={2}>
                <Icon
                  as={Feather}
                  name="truck"
                  color="orange.600"
                  size={ICON_SIZE}
                />
              </HStack>
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
            </HStack>

            <HStack mr={5}>
              <HStack>
                <VStack mt={3}>
                  <Icon
                    as={Feather}
                    name="calendar"
                    size={ICON_SIZE}
                    color="orange.600"
                  />
                </VStack>
                <VStack>
                  <Input
                    placeholder={'Data'}
                    w={120}
                    editable={false}
                    value={date}
                    caretHidden
                    onPressIn={() => {
                      DateTimePickerAndroid.open({
                        mode: 'date',
                        value: new Date(),
                        onChange: (event, date) => handleDate(date as Date),
                      });
                    }}
                  />
                </VStack>
              </HStack>
              <HStack>
                <VStack mt={3}>
                  <Icon
                    as={Feather}
                    name="clock"
                    size={ICON_SIZE}
                    color="orange.600"
                  />
                </VStack>
                <VStack>
                  <Input
                    placeholder={'Horario'}
                    w={120}
                    editable={false}
                    value={time}
                    caretHidden
                    onPressIn={() => {
                      DateTimePickerAndroid.open({
                        mode: 'time',
                        is24Hour: true,
                        value: new Date(),
                        onChange: (event, date) => handleTime(date as Date),
                      });
                    }}
                  />
                </VStack>
              </HStack>
            </HStack>

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

            <VStack>
              <HStack mb={5}>
                <Text fontSize="xs" bold color="gray.500">
                  Você pode adicionar fotos ou videos adicionais que demonstram
                  os problemas relatados e ajudam o prestador de serviço a ter o
                  melhor entendimento do problema. Você pode adicionar imagens,
                  videos ou documentos.
                </Text>
              </HStack>
              <VStack maxW={400} flexWrap="wrap">
                {files.map((item) => (
                  <HStack key={item.id}>
                    <TouchableOpacity>
                      <HStack mb={5}>
                        <Image
                          w={'full'}
                          height={200}
                          source={item}
                          alt="Some thing in the way"
                          resizeMode="cover"
                        />
                      </HStack>
                    </TouchableOpacity>
                  </HStack>
                ))}

                <Button
                  title="Carregar foto"
                  variant="outline"
                  onPress={handleUserProfilePictureSelect}
                />
              </VStack>
            </VStack>

            <Button title="Agendar" mt={100} onPress={handleSubmit} />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
