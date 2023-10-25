/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { LoadingModal } from '@components/LoadingModal';
import { Select } from '@components/Select';
import { SelectBusinessCategories } from '@components/SelectBusinessCategories';
import { TextArea } from '@components/TextArea';
import { ILocation } from '@dtos/ILocation';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useAuth } from '@hooks/useAuth';
import { useGPS } from '@hooks/useGPS';
import { useIdGenerator } from '@hooks/useIdGenerator';
import { useUploadImage } from '@hooks/useUploadImage';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { CalculatePositionDistance } from '@utils/CalculatePositionDistance';
import {
  HStack,
  ScrollView,
  Text,
  VStack,
  useToast,
  Image,
  FlatList,
  Avatar,
  Badge,
} from 'native-base';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';

type RouteParamsProps = {
  serviceId: string;
};

export function NewLegalQuote() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const [uploadFormData, setUploadFormData] = useState<FormData[]>([]);

  const [locationsSelected, setLocationsSelected] = useState<string[]>([]);

  const [locations, setLocations] = useState<ILocation[]>();

  const [vehicles, setVehicles] = useState<IVehicleDTO[]>();
  const [vehicleId, setVehicleId] = useState<string>();
  const [vehicleDetails, setVehicleDetails] = useState<IVehicleDTO>();
  const [files, setFiles] = useState<any[]>([]);
  const [requiredServices, setRequiredServices] = useState<number>();
  const [userNotes, setUserNotes] = useState<string>('');

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParamsProps;
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user } = useAuth();

  const { coords } = useGPS();
  const toast = useToast();

  const { generateId } = useIdGenerator();
  const { handleUserProfilePictureSelect } = useUploadImage();

  async function handleMediaSelect() {
    try {
      setIsPhotoUploading(true);
      setProgressValue(15);

      setProgressValue(30);
      const file = await handleUserProfilePictureSelect(user.id, 'document');

      setProgressValue(50);
      if (!file?.userPhotoUploadForm) {
        return;
      }

      setUploadFormData([...uploadFormData, file.userPhotoUploadForm]);

      setFiles([...files, file.photoFile]);
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
      setIsPhotoUploading(false);
      setProgressValue(0);
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

  function handleLocationSelect(locationId: string) {
    if (locationsSelected.includes(locationId)) {
      const newLocations = locationsSelected.filter(
        (location) => location !== locationId
      );
      setLocationsSelected(newLocations);
    } else {
      setLocationsSelected([...locationsSelected, locationId]);
    }
  }

  async function handleCarSelect(value: string) {
    setVehicleId(value);
    await handleFindVehicleDetails(value);
  }

  async function handleSubmit() {
    try {
      setIsSaving(true);
      const generatedHash = generateId(128);

      console.log({
        user_id: user.id,
        hashId: generatedHash,
        vehicle_id: vehicleId,
        insurance_company_id: vehicleDetails?.InsuranceCompanies?.id,
        service_type_id: requiredServices,
        user_notes: String(userNotes),
        locations: locationsSelected,
      });

      const response = await api.post(
        '/quotes/legal',
        {
          user_id: user.id,
          hashId: generatedHash,
          vehicle_id: vehicleId,
          insurance_company_id: vehicleDetails?.InsuranceCompanies?.id,
          service_type_id: requiredServices,
          user_notes: userNotes,
          locations: locationsSelected,
        },
        {
          headers: {
            id: user.id,
            'Content-Type': 'application/json',
          },
        }
      );

      uploadFormData.map(async (file) => {
        await api.post(
          `/quotes/legal/document/${response.data.id}/${generatedHash}`,
          file,
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
      // navigation.navigate('home');
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

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader
          title="Novo orcamento"
          navigation={navigation}
          screen="quotes"
        />
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
        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
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

        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Text fontSize="md" bold>
              Seguradora
            </Text>
            <Text>{vehicleDetails?.InsuranceCompanies?.name}</Text>
          </VStack>
        </VStack>

        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
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

        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Text fontSize="md" bold mb={2}>
              Informacoes adicionais
            </Text>
            <TextArea
              h={150}
              placeholder="Insira informacoes que possam ajudar o profissional a entender
              melhor o seu problema e te ajudar da melhor forma possivel"
              fontSize="xs"
              textAlign="left"
              onChangeText={setUserNotes}
              value={userNotes}
            />
          </VStack>
        </VStack>

        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <HStack justifyContent="space-between">
              <Text fontSize="md" bold mb={2}>
                Arquivos de midia
              </Text>
            </HStack>
            <VStack>
              <Text fontSize="xs" pt={1} color="gray.400">
                Fotos e videos podem agilizar o processo de analise e reduzir o
                tempo de espera.
              </Text>
            </VStack>
            <FlatList
              data={files}
              horizontal
              pagingEnabled
              snapToAlignment="start"
              renderItem={({ item }) => (
                <Image source={item} alt={item.name} w={320} h={200} />
              )}
            />

            <VStack py={5}>
              <Button
                onPress={handleMediaSelect}
                title="Adicionar fotos"
                isLoading={isPhotoUploading}
                isLoadingText={`Carregando... ${progressValue}%`}
              />
            </VStack>
          </VStack>
        </VStack>

        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <HStack justifyContent={'space-between'}>
              <VStack>
                <Text fontSize="md" bold>
                  Locais
                </Text>
                <Text fontSize="xs">
                  Voce pode escolher ate 3 locais, deslize para a direita para
                  visualizar mais locais
                </Text>
              </VStack>
            </HStack>
            <FlatList
              data={locations}
              horizontal
              pagingEnabled
              snapToAlignment="start"
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleLocationSelect(item.id)}>
                  <HStack
                    px={5}
                    py={5}
                    w={330}
                    justifyContent={'space-between'}
                  >
                    {locationsSelected.includes(item.id) && (
                      <Badge
                        colorScheme={'purple'}
                        position={'absolute'}
                        right={1}
                        top={3}
                        borderRadius={6}
                      >
                        Selecionado
                      </Badge>
                    )}
                    <HStack>
                      <Avatar
                        source={{
                          uri: `${api.defaults.baseURL}/user/avatar/${user.id}/${item.users?.avatar}`,
                        }}
                        size={20}
                      />
                    </HStack>
                    <HStack>
                      <VStack>
                        <Text bold fontSize={'md'}>
                          {item?.business_name}{' '}
                        </Text>
                        <Text fontSize={'sm'}>{item.city}</Text>
                        <Text>
                          {CalculatePositionDistance(
                            [Number(coords.latitude), Number(coords.longitude)],
                            [Number(item.latitude), Number(item.longitude)]
                          ).toPrecision(2)}
                          km de voce
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => {
                return (
                  <Text textAlign={'center'} color="gray.400" pt={10}>
                    Nenhum local encontrado para o servico selecionado
                  </Text>
                );
              }}
            />
          </VStack>
        </VStack>

        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
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
