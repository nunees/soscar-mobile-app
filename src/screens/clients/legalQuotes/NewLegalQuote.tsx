/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { LoadingModal } from '@components/LoadingModal';
import { Select } from '@components/Select';
import { SelectBusinessCategories } from '@components/SelectBusinessCategories';
import { TextArea } from '@components/TextArea';
import { UploadFileField } from '@components/UploadFileField';
import { ILocation } from '@dtos/ILocation';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useAxiosFetch } from '@hooks/axios/useAxiosFetch';
import { useNotification } from '@hooks/notification/useNotification';
import { useAuth } from '@hooks/useAuth';
import { useGPS } from '@hooks/useGPS';
import { useIdGenerator } from '@hooks/useIdGenerator';
import { useUploadFormData } from '@hooks/useUploadFormData';
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
  FlatList,
  Avatar,
  Badge,
} from 'native-base';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';

type RouteParamsProps = {
  serviceId: string;
};

export function NewLegalQuote() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [locationsSelected, setLocationsSelected] = useState<string[]>([]);

  const [vehicleId, setVehicleId] = useState<string>();
  const [vehicleDetails, setVehicleDetails] = useState<IVehicleDTO>();

  const [requiredServices, setRequiredServices] = useState<number>();
  const [userNotes, setUserNotes] = useState<string>('');

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParamsProps;
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user } = useAuth();

  const { position } = useGPS();
  const toast = useToast();

  const { generateId } = useIdGenerator();
  const { upload, GetUploadImage } = useUploadFormData('document');
  const { sendNotification } = useNotification();

  const locations = useAxiosFetch<ILocation[]>({
    url: `/locations/services/${serviceId}`,
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

  function handleLocationSelect(locationId: string) {
    if (
      locationsSelected.length < 3 &&
      !locationsSelected.includes(locationId)
    ) {
      if (locationsSelected.includes(locationId)) {
        const newLocations = locationsSelected.filter(
          (location) => location !== locationId
        );
        if (newLocations.length > 3) {
          toast.show({
            title: 'Voce pode selecionar ate 3 locais',
            placement: 'top',
            bgColor: 'red.500',
          });
        }
        setLocationsSelected(newLocations);
      } else {
        setLocationsSelected([...locationsSelected, locationId]);
      }
    }

    if (locationsSelected.includes(locationId)) {
      const locations = locationsSelected.filter(
        (location) => location !== locationId
      );
      setLocationsSelected(locations);
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

      await api.post(
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

      upload.data?.forEach(async (file) => {
        await api.post(`/quotes/legal/document/${generatedHash}`, file, {
          headers: {
            id: user.id,
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      locationsSelected.map(async (location: string) => {
        const result = await api.get<ILocation>(`/locations/${location}`, {
          headers: {
            id: user.id,
          },
        });
        await sendNotification(
          result.data.user_id as string,
          `Você têm um novo pedido de orçamento jurídico de <strong>${user.name}</strong> , abra o app e confira`,
          'Pedido de orçamento jurídico 🧑🏾‍⚖️',
          'quotes',
          user.id
        );
      });

      setIsSaving(false);
      toast.show({
        title: 'Orcamento solicitado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });
      navigation.navigate('quotes');
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
          message="Carregando informações"
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
            <Text fontSize="sm" bold mb={2}>
              Veiculo
            </Text>
            <Select
              w={'full'}
              height={10}
              label={'Selecione um veículo'}
              data={
                vehicles.state?.data
                  ? vehicles.state.data.map((item) => {
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
              Tipo de Serviço
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
              Informações adicionais
            </Text>
            <TextArea
              h={150}
              fontSize="sm"
              textAlign="left"
              onChangeText={setUserNotes}
              value={userNotes}
            />
          </VStack>
        </VStack>

        <VStack px={5} py={1}>
          <UploadFileField
            upload={upload}
            GetUploadImage={GetUploadImage}
            text="Imagens"
          />
        </VStack>

        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <HStack justifyContent={'space-between'}>
              <VStack>
                <Text fontSize="sm" bold mb={1}>
                  Locais
                </Text>
                <Text fontSize="xxs" mb={3}>
                  Voce pode escolher até 3 locais, deslize para a direita ou
                  esquerda para visualizar mais locais
                </Text>
              </VStack>
            </HStack>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={locations.state.data}
              horizontal
              pagingEnabled
              snapToAlignment="start"
              keyExtractor={(item) => item.id}
              mb={3}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleLocationSelect(item.id)}>
                  <HStack px={5} py={5} w={330} justifyContent={'flex-start'}>
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
                          uri: item.users?.avatar
                            ? `${api.defaults.baseURL}/user/avatar/${user.id}/${item.users?.avatar}`
                            : `https://ui-avatars.com/api/?name=${item.users?.name}&background=random&length=1&size=128`,
                        }}
                        size={20}
                      />
                    </HStack>
                    <HStack ml={3} mt={2}>
                      <VStack>
                        <Text bold fontSize={'md'}>
                          {item?.business_name}{' '}
                        </Text>
                        <Text fontSize={'sm'}>{item.city}</Text>
                        <Text>
                          {CalculatePositionDistance(
                            [
                              Number(position.coords.latitude),
                              Number(position.coords.longitude),
                            ],
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
                    Nenhum local encontrado para o serviço selecionado
                  </Text>
                );
              }}
            />
          </VStack>
        </VStack>

        <VStack px={5} py={1}>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Text fontSize="sm" bold mb={2}>
              Confirmação
            </Text>
            <Text fontSize="xxs" mb={3} color="gray.400">
              Ao solicitar o orçamento, você concorda com os termos de uso e
              politica de privacidade
            </Text>
            <Button
              onPress={handleSubmit}
              mb={3}
              title="Solicitar orçamento"
              isLoading={isSaving}
            />

            <Button
              onPress={() => navigation.navigate('quotes')}
              mb={3}
              title="Cancelar"
              variant={'dark'}
              bg={'red.500'}
              isLoading={isSaving}
            />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
