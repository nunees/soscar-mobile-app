import ProfilePicture from '@assets/profile.png';
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { SelectBusinessCategories } from '@components/SelectBusinessCategories';
import { TextArea } from '@components/TextArea';
import { UserPhoto } from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { Entypo, Feather } from '@expo/vector-icons';
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
  const [profilePicture, setProfilePicture] = useState<ImagePickerAsset>();
  const [userVehicles, setUserVehicles] = useState<IVehicleDTO[]>();
  const [choosedVehicle, setChoosedVehicle] = useState<string>();
  const [services, setServices] = useState<number[]>();

  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  const [requiredServices, setRequiredServices] = useState<number>();

  const [errorMessage, setErrorMessage] = useState('');

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

      const profilePicture = await api.get(
        `/user/avatar/${response.data.user_id}/${response.data.users.avatar}`
      );

      if (!profilePicture.data) {
        setProfilePicture(ProfilePicture);
      } else {
        setProfilePicture(profilePicture.data);
      }
    } catch (error) {
      toast.show({
        title: 'Erro ao buscar parceiros',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function handleSubmit() {
    // const response = await api.post('/schedules', userPhotoUploadForm, {
    //   headers: {
    //     id: user.id,
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });

    try {
      files.map(async (file) => {
        console.log('hit');
        userPhotoUploadForm.append('document', file);
        await api.post(
          '/schedules/documents/asdlasjdlasj',
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
        title: 'Erro ao agendar',
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
          {location ? (
            <VStack px={5} key={location.id}>
              <VStack>
                <HStack>
                  <VStack ml={2} mb={3}>
                    <UserPhoto
                      source={profilePicture}
                      alt="Profile Picture"
                      size={10}
                    />
                    <Heading>{location.business_name}</Heading>
                    <Text>100 Avaliações</Text>
                    <Text>{location.users?.name}</Text>
                    <Text>Telefone: {location.business_phone}</Text>
                  </VStack>
                  <VStack position="relative" left={150} top={10}>
                    <Icon as={Feather} name="message-square" size={8} />
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          ) : (
            <VStack px={5} py={5}></VStack>
          )}

          <VStack px={5} mt={5}>
            <HStack px={5}>
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

            <HStack px={5} mt={5}>
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
                onValueChange={(value) => setChoosedVehicle(value)}
              />
            </HStack>

            <HStack px={5} mt={5}>
              <HStack mt={4}>
                <Icon
                  as={Entypo}
                  name="calendar"
                  color="orange.600"
                  size={ICON_SIZE}
                />
              </HStack>
              <VStack>
                <Input
                  placeholder={'Data'}
                  w={200}
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
                {errorMessage && (
                  <Text color="red.500" bold>
                    {errorMessage}
                  </Text>
                )}
              </VStack>
            </HStack>

            <HStack px={5} mt={5}>
              <HStack mt={4}>
                <Icon
                  as={Entypo}
                  name="time-slot"
                  color="orange.600"
                  size={ICON_SIZE}
                />
              </HStack>
              <VStack>
                <Input
                  placeholder={'Horario'}
                  w={200}
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
                {errorMessage && (
                  <Text color="red.500" bold>
                    {errorMessage}
                  </Text>
                )}
              </VStack>
            </HStack>

            <VStack>
              <TextArea
                placeholder={'Descreva aqui os problemas apresentados'}
                w={'full'}
                h={150}
                mt={50}
                fontSize="sm"
                color="gray.300"
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
                  <HStack>
                    <TouchableOpacity>
                      <HStack mb={5}>
                        <Image
                          w={'full'}
                          height={200}
                          source={item}
                          alt="Some thing in the way"
                          resizeMode="cover"
                          key={item.name}
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
