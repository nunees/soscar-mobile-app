/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { LoadingModal } from '@components/LoadingModal';
import { Select } from '@components/Select';
import { SelectBusinessCategories } from '@components/SelectBusinessCategories';
import { TextArea } from '@components/TextArea';
import UserPhoto from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useGPS } from '@hooks/useGPS';
import { useIdGenerator } from '@hooks/useIdGenerator';
import { useProfile } from '@hooks/useProfile';
import { useUploadImage } from '@hooks/useUploadImage';
import { useNavigation, useRoute } from '@react-navigation/native';
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
  Icon,
  FlatList,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

type RouteParamsProps = {
  serviceId: string;
  locationId: string;
};

export function NewQuote() {
  const [isLoading, setIsLoading] = useState(false);

  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const [isSaving, setIsSaving] = useState(false);

  const [location, setLocation] = useState<ILocation>();
  const [vehicles, setVehicles] = useState<IVehicleDTO[]>();
  const [vehicleId, setVehicleId] = useState<string>();

  const [vehicleDetails, setVehicleDetails] = useState<IVehicleDTO>();
  const [files, setFiles] = useState<any[]>([]);

  const [requiredServices, setRequiredServices] = useState<number>();
  const [userNotes, setUserNotes] = useState<string>('');

  const [uploadForms, setUploadForms] = useState<FormData[]>([]);
  const { handleUserProfilePictureSelect } = useUploadImage();

  const routes = useRoute();
  const { serviceId, locationId } = routes.params as RouteParamsProps;
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user } = useAuth();
  const { profile } = useProfile();
  const toast = useToast();
  const { generateId } = useIdGenerator();

  const { coords } = useGPS();

  async function handleMediaSelect() {
    try {
      setIsPhotoLoading(true);
      setProgressValue(15);

      setProgressValue(30);
      const file = await handleUserProfilePictureSelect(user.id, 'document');
      if (!file!.userPhotoUploadForm) {
        throw new AppError('Erro ao anexar arquivo');
      }

      setProgressValue(60);
      setFiles([...files, file?.photoFile]);

      setProgressValue(80);
      setUploadForms([...uploadForms, file!.userPhotoUploadForm]);

      setFiles([...files, file?.photoFile]);

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
      setIsPhotoLoading(false);
      setProgressValue(0);
    }
  }

  async function handleFetchLocation() {
    try {
      setIsLoading(true);
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });
      setLocation(response.data);
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

  async function handleCarSelect(value: string) {
    setVehicleId(value);
    await handleFindVehicleDetails(value);
  }

  async function handleSubmit() {
    try {
      setIsSaving(true);
      const hash = generateId(128);

      const response = await api.post(
        '/quotes/',
        {
          hashId: hash,
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
          `/quotes/documents/${response.data.id}/${hash}`,
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
      navigation.navigate('quoteDone');
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

  useEffect(() => {
    handleFetchLocation();
    handleFetchVechicles();
  }, []);

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
        <VStack px={5} mb={3}>
          <HStack backgroundColor="white" borderRadius={10} py={5} px={5}>
            <HStack mr={3}>
              <UserPhoto
                source={{
                  uri: location?.users?.avatar
                    ? `${api.defaults.baseURL}/user/avatar/${location.user_id}/${location.users.avatar}`
                    : `https://ui-avatars.com/api/?format=png&name=${user.name}+${profile.last_name}&size=512`,
                }}
                alt="Foto de perfil"
                size={90}
              />
            </HStack>

            <HStack>
              <VStack maxW={250}>
                <Text bold fontSize="sm" textTransform="uppercase">
                  {location?.business_name}
                </Text>

                <Text fontSize="xs">
                  {location?.address_line}, {location?.number}
                </Text>
                <Text fontSize="xs">
                  {location?.city} - {location?.state}
                </Text>

                <Text fontSize="xs">{location?.business_phone}</Text>
                <HStack>
                  <Icon
                    as={FontAwesome5}
                    name="map-marker-alt"
                    size={3}
                    mt={1}
                  />
                  <Text fontSize="xs">
                    {CalculatePositionDistance(
                      [Number(coords.latitude), Number(coords.longitude)],
                      [Number(location?.latitude), Number(location?.longitude)]
                    ).toFixed(2)}
                    {' km de distancia'}
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            {/* */}
          </HStack>
        </VStack>

        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Text fontSize="sm" bold mb={2}>
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
            <Text fontSize="sm" bold>
              Seguradora
            </Text>
            <Text>{vehicleDetails?.InsuranceCompanies?.name}</Text>
          </VStack>
        </VStack>

        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Text fontSize="sm" bold mb={2}>
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
            <Text fontSize="sm" bold mb={2}>
              Informacoes adicionais (opcional)
            </Text>
            <TextArea
              h={150}
              fontSize="sm"
              textAlign="justify"
              onChangeText={setUserNotes}
            />
          </VStack>
        </VStack>

        <VStack px={5} py={1}>
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
                      width={350}
                      height={200}
                      source={{ uri: item.uri }}
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
                onPress={handleMediaSelect}
                mt={5}
                isLoading={isPhotoLoading}
                isLoadingText={`Carregando ${progressValue}%`}
              />
            </VStack>
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
              isLoadingText="Solicitando orcamento"
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
