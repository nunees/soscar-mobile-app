import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import { PartnerCard } from '@components/PartnerCard';
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
import { handleDate, handleTime } from '@utils/DateTime';
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
  Center,
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

export function NewSchedule() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

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
        navigation.navigate('home');
        toast.show({
          title: 'Agendamento realizado com sucesso!',
          placement: 'top',
          bgColor: 'green.500',
        });
      } catch (error) {
        const isAppError = error instanceof AppError;
        toast.show({
          title: isAppError ? error.message : 'Erro ao anexar arquivos',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError ? error.message : 'Erro ao agendar',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader title="Novo agendamento" />
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
          {location && (
            <PartnerCard
              image={{
                uri:
                  `${api.defaults.baseURL}/locations/avatar/${location.id}/${location.avatar}` ||
                  `https://ui-avatars.com/api/?name=${location.business_name}&background=random&length=1&rounded=true&size=128`,
              }}
              location={location}
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

          <HStack
            p={5}
            mb={5}
            backgroundColor="white"
            borderRadius={10}
            justifyContent="space-between"
          >
            <HStack alignItems="center">
              <VStack>
                <Text bold pb={1}>
                  Data
                </Text>
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
                      onChange: (event, date) =>
                        setDate(handleDate(date as Date)),
                    });
                  }}
                />
              </VStack>
            </HStack>
            <HStack>
              <VStack>
                <Text bold pb={1}>
                  Hora
                </Text>
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
                      onChange: (event, date) =>
                        setTime(handleTime(date as Date)),
                    });
                  }}
                />
              </VStack>
            </HStack>
          </HStack>

          <VStack p={5} mb={5} backgroundColor="white" borderRadius={10}>
            <HStack>
              <Icon
                as={Feather}
                name="info"
                size={38}
                color="orange.400"
                mr={1}
                mt={1}
              />
              <Text fontSize="xs" bold color="gray.600" textAlign="justify">
                O tempo medio de reparo e de 1 hora, no entanto pode ser
                necessario mais tempo. Nao se preocupe, seu mecanico ira
                informa-lo se necessario.
              </Text>
            </HStack>
          </VStack>

          <VStack p={5} mb={5} backgroundColor="white" borderRadius={10}>
            <VStack>
              <Text bold>Informacoes adicionais</Text>
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
              <Text fontSize="xs" bold color="gray.500" textAlign="justify">
                Você pode adicionar fotos ou videos adicionais que demonstram os
                problemas relatados e ajudam o prestador de serviço a ter o
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

          <Button title="Agendar" onPress={handleSubmit} />
        </ScrollView>
      </VStack>
    </VStack>
  );
}
