import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { LoadingModal } from '@components/LoadingModal';
import { PartnerCard } from '@components/PartnerCard';
import { Select } from '@components/Select';
import { SelectBusinessCategories } from '@components/SelectBusinessCategories';
import { TextArea } from '@components/TextArea';
import { ILocation } from '@dtos/ILocation';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { Video, ResizeMode } from 'expo-av';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  Center,
  HStack,
  ScrollView,
  Text,
  VStack,
  useToast,
  Image,
  Modal,
  Icon,
  FlatList,
} from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import { v4 as uuid } from 'uuid';

type RouteParamsProps = {
  serviceId: string;
};

type mediaProps = {
  name: string;
  type: string;
  uri: string;
};

export function NewLegalQuote() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);

  const [locations, setLocations] = useState<ILocation[]>();
  const [selectedLocations, setSelectedLocations] = useState<ILocation[]>();

  const [vehicles, setVehicles] = useState<IVehicleDTO[]>();
  const [vehicleId, setVehicleId] = useState<string>();
  const [vehicleDetails, setVehicleDetails] = useState<IVehicleDTO>();
  const [files, setFiles] = useState<any[]>([]);
  const [requiredServices, setRequiredServices] = useState<number>();
  const [userNotes, setUserNotes] = useState<string>('');

  const routes = useRoute();
  const { serviceId, locationId } = routes.params as RouteParamsProps;
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user } = useAuth();
  const { profile } = useProfile();
  const toast = useToast();

  async function handleMediaSelect() {
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
        } as mediaProps;

        // userPhotoUploadForm.append('document', file);

        setFiles([...files, file]);

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

  async function handleFetchLocation() {
    try {
      setIsLoading(true);
      const response = await api.get(`/locations/services/${serviceId}`, {
        headers: {
          id: user.id,
        },
      });
      setLocations(response.data);
      console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      throw new AppError('Erro ao buscar localizacao');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFindVehicleDetails(vehicleId: string) {
    try {
      setIsLoading(true);
      const response = await api.get(`/vehicles/${vehicleId}`, {
        headers: {
          id: user.id,
        },
      });
      setVehicleDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.show({
        title: 'Erro ao buscar informacoes do veiculo',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFetchVechicles() {
    try {
      setIsLoading(true);
      const response = await api.get(`/vehicles/`, {
        headers: {
          id: user.id,
        },
      });
      setVehicles(response.data);
      setIsLoading(false);
    } catch (error) {
      throw new AppError('Erro ao buscar veiculos');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDeleteMedia(item: mediaProps) {
    const newFiles = files.filter((file) => file.name !== item.name);
    setFiles(newFiles);
    setShowMediaMenu(false);
  }

  async function handleCarSelect(value: string) {
    setVehicleId(value);
    await handleFindVehicleDetails(value);
  }

  async function handleSubmit() {
    try {
      setIsSaving(true);
      const generatedHash = await uuid();

      const response = await api.post(
        '/quotes/',
        {
          hashId: generatedHash,
          user_id: user.id,
          vehicle_id: vehicleId,
          location_id: locationId,
          insurance_company_id: vehicleDetails?.InsuranceCompanies?.id,
          service_type_id: requiredServices,
          user_notes: userNotes,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );

      files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        await api.post(
          `/quotes/documents/${response.data.id}/${generatedHash}`,
          formData,
          {
            headers: {
              id: user.id,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      });

      setIsSaving(false);
      toast.show({
        title: 'Orcamento solicitado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });
      navigation.navigate('home');
    } catch (error) {
      setIsSaving(false);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Ocorreu um erro ao solicitar o orcamento';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      handleFetchLocation();
      handleFetchVechicles();
    }, [])
  );

  function getDistanceFromLatLonInKm(arg0: number[], arg1: number[]) {
    throw new Error('Function not implemented.');
  }

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader title="Novo orcamento" />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={setIsLoading}
          message="Carregando informacoes"
        />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <VStack alignSelf="center">
          <VStack
            w={350}
            backgroundColor="white"
            borderRadius={10}
            py={5}
            px={5}
          >
            <Text fontSize="md" bold mb={2}>
              Veiculo
            </Text>
            <Select
              w={'full'}
              height={10}
              label={'Selecione um veículo'}
              data={
                vehicles
                  ? vehicles.map((item) => {
                      return {
                        label: `${item.brand.name} - ${item.name.name}`,
                        value: String(item.id),
                      };
                    })
                  : []
              }
              onValueChange={(value) => handleCarSelect(value)}
            />
          </VStack>
        </VStack>

        <VStack alignSelf="center" mt={5}>
          <VStack
            w={350}
            backgroundColor="white"
            borderRadius={10}
            py={5}
            px={5}
          >
            <Text fontSize="md" bold>
              Seguradora
            </Text>
            <Text>{vehicleDetails?.InsuranceCompanies?.name}</Text>
          </VStack>
        </VStack>

        <VStack alignSelf="center" mt={5}>
          <VStack
            w={350}
            backgroundColor="white"
            borderRadius={10}
            py={5}
            px={5}
          >
            <Text fontSize="md" bold mb={2}>
              Tipo de Servico
            </Text>
            <SelectBusinessCategories
              label={'Tipo de Serviço'}
              categoryOfService={Number(serviceId)}
              onValueChange={(value) => setRequiredServices(Number(value))}
            />
          </VStack>
        </VStack>

        <VStack alignSelf="center" mt={5}>
          <VStack
            w={350}
            backgroundColor="white"
            borderRadius={10}
            py={5}
            px={5}
          >
            <Text fontSize="md" bold mb={2}>
              Meus Dados
            </Text>
            <Text color="gray.400">
              Nome: {`${profile.name} ${profile.last_name}`}
            </Text>
            <Text color="gray.400">Email: {user.email}</Text>
            <Text color="gray.400">
              Telefone: {profile.phone || 'Nao inserido'}
            </Text>
          </VStack>
        </VStack>

        <VStack alignSelf="center" mt={5}>
          <VStack
            w={350}
            backgroundColor="white"
            borderRadius={10}
            py={5}
            px={5}
          >
            <Text fontSize="md" bold mb={2}>
              Informacoes adicionais
            </Text>
            <TextArea
              h={150}
              placeholder="Insira informacoes que possam ajudar o profissional a entender
              melhor o seu problema e te ajudar da melhor forma possivel"
              fontSize="xs"
              textAlign="justify"
              onChangeText={setUserNotes}
            />
          </VStack>
        </VStack>

        <VStack alignSelf="center" mt={5}>
          <VStack
            w={350}
            backgroundColor="white"
            borderRadius={10}
            py={5}
            px={5}
          >
            <HStack justifyContent="space-between">
              <Text fontSize="md" bold mb={2}>
                Arquivos de midia
              </Text>

              <Button
                colorScheme="purple"
                w={50}
                h={30}
                onPress={handleMediaSelect}
                hasIcon
                iconName="plus"
              />
            </HStack>
            <VStack>
              <Text fontSize="xs" pt={1} color="gray.400">
                Fotos e videos podem agilizar o processo de analise e reduzir o
                tempo de espera.
              </Text>
            </VStack>
            <VStack flexWrap="wrap" mt={5}>
              {files.map((file: mediaProps) => {
                if (
                  file.type === 'image/png' ||
                  file.type === 'image/jpeg' ||
                  file.type === 'image/jpg'
                ) {
                  return (
                    <VStack>
                      <Pressable onLongPress={() => setShowMediaMenu(true)}>
                        {showMediaMenu && (
                          <Modal
                            isOpen={showMediaMenu}
                            onClose={() => setShowMediaMenu(false)}
                          >
                            <Modal.Content maxW={400}>
                              <Modal.Body>
                                <VStack>
                                  <Button
                                    onPress={() => handleDeleteMedia(file)}
                                    colorScheme="red"
                                    title="Excluir"
                                    mb={2}
                                  />

                                  <Button
                                    onPress={() => setShowMediaMenu(false)}
                                    colorScheme="red"
                                    title="Cancelar"
                                    variant={'outline'}
                                  />
                                </VStack>
                              </Modal.Body>
                            </Modal.Content>
                          </Modal>
                        )}
                        <Image
                          source={{ uri: file.uri }}
                          alt={file.name}
                          resizeMode="contain"
                          w={320}
                          h={200}
                        />
                      </Pressable>
                    </VStack>
                  );
                }
                if (file.type === 'video/mp4' || file.type === 'video/mov') {
                  return (
                    <VStack>
                      {showMediaMenu && (
                        <Modal
                          isOpen={showMediaMenu}
                          onClose={() => setShowMediaMenu(false)}
                        >
                          <Modal.Content maxW={400}>
                            <Modal.Body>
                              <VStack>
                                <Button
                                  onPress={() => handleDeleteMedia(file)}
                                  colorScheme="red"
                                  title="Excluir"
                                  mb={2}
                                />

                                <Button
                                  onPress={() => null}
                                  colorScheme="red"
                                  title="Cancelar"
                                  variant={'outline'}
                                />
                              </VStack>
                            </Modal.Body>
                          </Modal.Content>
                        </Modal>
                      )}
                      <Pressable onLongPress={() => setShowMediaMenu(true)}>
                        <Video
                          source={file}
                          resizeMode={ResizeMode.COVER}
                          style={{
                            width: 320,
                            height: 200,
                          }}
                          useNativeControls
                          isLooping
                          isMuted
                        />
                      </Pressable>
                    </VStack>
                  );
                }
                return <Text>{file.name}</Text>;
              })}
            </VStack>
          </VStack>
        </VStack>

        <VStack alignSelf="center" mt={5}>
          <VStack
            w={350}
            backgroundColor="white"
            borderRadius={10}
            py={5}
            px={5}
          >
            <HStack justifyContent={'space-between'}>
              <Text fontSize="md" bold mb={2}>
                Locais
              </Text>
              <TouchableOpacity onPress={() => console.log('oi')}>
                <Icon
                  as={FontAwesome5}
                  name={'search-plus'}
                  size={5}
                  color="purple.500"
                />
              </TouchableOpacity>
            </HStack>
            <FlatList
              data={locations}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <VStack>
                  <VStack alignSelf="center" mt={5}>
                    <VStack ml={2} mb={3}>
                      <HStack justifyContent="space-between" mb={1}>
                        <Text>{item?.business_name} </Text>
                      </HStack>

                      <VStack>
                        <HStack mb={1}>
                          <Icon
                            name="map-pin"
                            as={Feather}
                            size={4}
                            color="purple.400"
                          />
                          {/* <Text>
                            {' '}
                            {getDistanceFromLatLonInKm(
                              [
                                Number(profile.latitude),
                                Number(profile.longitude),
                              ],
                              [Number(item.latitude), Number(item.longitude)]
                            ).}
                            km de voce
                          </Text> */}
                        </HStack>
                        <HStack mb={1}>
                          <Icon
                            name="clock"
                            as={Feather}
                            size={4}
                            color="purple.400"
                          />
                          <Text> {item?.open_hours}</Text>
                        </HStack>
                        <HStack mb={1}>
                          <Icon
                            name="phone"
                            as={Feather}
                            size={4}
                            color="purple.400"
                          />
                          <Text> {item?.business_phone}</Text>
                        </HStack>
                      </VStack>
                    </VStack>
                  </VStack>
                </VStack>
              )}
              ListEmptyComponent={() => {
                return (
                  <Text textAlign={'center'} color="gray.400" pt={10}>
                    Nada por aqui, adicione um local
                  </Text>
                );
              }}
            />
          </VStack>
        </VStack>

        <VStack alignSelf="center" mt={5}>
          <VStack
            w={350}
            backgroundColor="white"
            borderRadius={10}
            py={5}
            px={5}
          >
            <Text fontSize="md" bold mb={2}>
              Confirmacao
            </Text>
            <Text fontSize="xs" mb={3} color="gray.400">
              Ao solicitar o orcamento, voce concorda com os termos de uso e
              politica de privacidade
            </Text>
            <Button
              onPress={handleSubmit}
              mb={3}
              title="Solicitar orcamento"
              isLoading={isSaving}
            />

            <Button
              onPress={() => navigation.navigate('quotes')}
              mb={3}
              title="Cancelar"
              variant={'outline'}
              isLoading={isSaving}
            />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
