import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { UserPhoto } from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { VStack, Text, useToast, ScrollView, HStack, Icon } from 'native-base';
import { useEffect, useState } from 'react';

type RouteParamsProps = {
  locationId: string;
};

const paymentMethods = [
  { id: 1, name: 'Dinheiro' },
  { id: 2, name: 'Crédito' },
  { id: 3, name: 'Débito' },
  { id: 4, name: 'PIX' },
  { id: 5, name: 'Transferencia' },
  { id: 6, name: 'Outros' },
];

const servicesCategories = [
  { id: 1, name: 'Acessorios' },
  { id: 2, name: 'Cambio' },
  { id: 3, name: 'Eletrica' },
  { id: 4, name: 'Fluidos' },
  { id: 5, name: 'Funilaria e Pintura' },
  { id: 6, name: 'Lavagem' },
  { id: 7, name: 'Mecanica' },
  { id: 8, name: 'Pneus' },
  { id: 9, name: 'Suspensão' },
  { id: 10, name: 'Vidros' },
  { id: 11, name: 'Outros' },
];

export function LocationDetails() {
  const [location, setLocation] = useState<ILocation>({} as ILocation);
  const [hasPhotos, setHasPhotos] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  const routes = useRoute();
  const toast = useToast();
  const { user } = useAuth();

  const { locationId } = routes.params as RouteParamsProps;

  async function handleFetchLocationDetails() {
    try {
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });

      setLocation(response.data);
      console.log(response.data);
    } catch (error) {
      toast.show({
        title: 'Erro ao carregar detalhes da localização',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function handleUserProfilePictureSelect() {
    try {
      setIsPhotoLoading(true);
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )) as IFileInfo;

        if (photoInfo?.size && photoInfo.size / 1021 / 1024 > 5) {
          toast.show({
            title: 'A imagem deve ter no máximo 5MB',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${user.username}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('photo', photoFile);

        await api.post(
          `/locations/upload/${location.id}`,
          userPhotoUploadForm,
          {
            headers: {
              id: user.id,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        toast.show({
          title: 'Foto atualizada',
          placement: 'top',
          bgColor: 'green.500',
        });
        setIsPhotoLoading(false);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro na atualização';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsPhotoLoading(false);
    }
  }

  useEffect(() => {
    handleFetchLocationDetails();
  }, []);

  return (
    <VStack pb={10}>
      <VStack mb={10}>
        <AppHeader title="Detalhes" />
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false} marginBottom={100}>
        <HStack px={5}>
          <VStack>
            <UserPhoto
              source={{
                uri: `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`,
              }}
              alt="Foto de perfil"
              size={100}
            />
          </VStack>
          <VStack>
            <VStack ml={3} mt={2}>
              <Text bold>{user.name}</Text>
              <Text>100 Avaliações</Text>
              <Text>{location.business_name}</Text>
              <Text>{location.business_phone}</Text>
            </VStack>
          </VStack>
          <VStack position="relative" left={120}>
            <Icon
              as={Feather}
              name="message-circle"
              size={8}
              color="orange.600"
            />
          </VStack>
        </HStack>

        <VStack px={5} mt={10}>
          <HStack>
            <HStack>
              <Icon
                as={Feather}
                name="briefcase"
                size={5}
                ml={3}
                color="amber.600"
              />
              <VStack ml={2}>
                <Text>{location.cnpj}</Text>
              </VStack>
            </HStack>
          </HStack>
        </VStack>

        <VStack px={5} mt={5}>
          <HStack>
            <HStack>
              <Icon
                as={Feather}
                name="map-pin"
                size={5}
                ml={3}
                mt={5}
                color="amber.600"
              />
              <VStack ml={2}>
                <Text>
                  {location.address_line},{location.number}-{location.district}
                </Text>
                <Text>
                  {location.city}-{location.state}
                </Text>
                <Text>{location.zipcode}</Text>
              </VStack>
            </HStack>
          </HStack>
        </VStack>

        <VStack px={5} mt={5}>
          <HStack>
            <HStack>
              <Icon
                as={Feather}
                name="mail"
                size={5}
                ml={3}
                color="amber.600"
              />
              <VStack ml={2}>
                <Text>{location.business_email}</Text>
              </VStack>
            </HStack>
          </HStack>
        </VStack>

        <VStack px={5} mt={5}>
          <HStack>
            <HStack>
              <Icon
                as={Feather}
                name="info"
                size={5}
                ml={3}
                color="amber.600"
              />
              <VStack ml={2} w={300}>
                <Text>{location.business_description}</Text>
              </VStack>
            </HStack>
          </HStack>
        </VStack>

        <VStack px={5} mt={5}>
          <HStack>
            <HStack>
              <Icon
                as={Feather}
                name="dollar-sign"
                size={5}
                ml={3}
                color="amber.600"
              />
              <VStack ml={2} w={300}>
                {location.payment_methods?.map((payment) => {
                  return (
                    <HStack key={payment}>
                      <HStack>
                        <VStack ml={2}>
                          <Text>
                            {
                              paymentMethods.find((method) =>
                                method.id === payment ? method.name : ''
                              )?.name
                            }
                          </Text>
                        </VStack>
                      </HStack>
                    </HStack>
                  );
                })}
              </VStack>
            </HStack>
          </HStack>
        </VStack>

        <VStack px={5} mt={5}>
          <HStack>
            <HStack>
              <Icon
                as={Feather}
                name="tool"
                size={5}
                ml={3}
                color="amber.600"
              />
              <VStack ml={2} w={300}>
                {location.business_categories?.map((category) => {
                  return (
                    <HStack key={category}>
                      <HStack>
                        <VStack ml={2}>
                          <Text>
                            {
                              servicesCategories.find((service) =>
                                service.id === category ? service.name : ''
                              )?.name
                            }
                          </Text>
                        </VStack>
                      </HStack>
                    </HStack>
                  );
                })}
              </VStack>
            </HStack>
          </HStack>
        </VStack>

        <VStack px={5} mt={5}>
          <HStack>
            <HStack>
              <Icon
                as={Feather}
                name="image"
                size={5}
                ml={3}
                color="amber.600"
              />
              <VStack ml={2} w={300}>
                {location.photos &&
                  location.photos.map((photo) => {
                    return (
                      <HStack key={photo}>
                        <HStack>
                          <VStack ml={2}>
                            <Text>{photo}</Text>
                          </VStack>
                        </HStack>
                      </HStack>
                    );
                  })}

                {location.photos?.length === 0 && (
                  <VStack mb={5}>
                    <Text>
                      Adicione fotos ao seu local e atraia mais clientes
                    </Text>
                  </VStack>
                )}
                <Button
                  title="Adicionar fotos"
                  onPress={handleUserProfilePictureSelect}
                  h={50}
                />
              </VStack>
            </HStack>
          </HStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
