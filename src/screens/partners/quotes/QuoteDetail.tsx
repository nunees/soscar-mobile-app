/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import getLogoImage from '@components/LogosImages';
import { TextArea } from '@components/TextArea';
import UserPhoto from '@components/UserPhoto';
import { SERVICES_LIST } from '@data/ServicesList';
import { VechiclesBrands } from '@data/VechiclesBrands';
import { VEHICLE_MODELS } from '@data/VehiclesModels';
import { ILocation } from '@dtos/ILocation';
import { IQuoteList } from '@dtos/IQuoteList';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { VStack, useToast, Text, HStack, Image, ScrollView } from 'native-base';
import { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

type RouteParams = {
  quoteId: string;
  locationId: string;
};

type FormDataProps = {
  partnerNotes: string;
  serviceDescription: string;
  serviceValue: string;
  franchisePrice: string;
};

const quoteSchema = yup.object().shape({
  partnerNotes: yup.string().required('Informe suas observações'),
  serviceDescription: yup.string().required('Informe a descrição do serviço'),
  serviceValue: yup.string().required('Informe o valor do serviço'),
  franchisePrice: yup
    .string()
    .required('Informe o valor da franquia da seguradora'),
});

export function QuoteDetail() {
  const [isLoading] = useState(false);

  const [quote, setQuote] = useState<IQuoteList>({} as IQuoteList);
  const [location, setLocation] = useState<ILocation>({} as ILocation);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userMidia, setUserMidia] = useState<any[]>([]);
  const [partnerMidia, setPartnerMidia] = useState<any[]>([]);

  const toast = useToast();
  const { user } = useAuth();

  const route = useRoute();
  const { quoteId, locationId } = route.params as RouteParams;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(quoteSchema),
  });

  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const handleSubmitSucess = useCallback(
    async ({
      partnerNotes,
      franchisePrice,
      serviceDescription,
      serviceValue,
    }: FormDataProps) => {
      await api.patch(
        `/quotes/${quoteId}`,
        {
          partner_notes: partnerNotes,
          service_description: serviceDescription,
          service_price: Number(serviceValue),
          status: 3,
          franchise_price: Number(franchisePrice),
        },
        {
          headers: {
            id: user.id,
          },
        }
      );

      navigation.navigate('orders');
    },
    []
  );

  const handleDocumentUpload = useCallback(async () => {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (photoSelected.canceled) {
      return;
    }

    if (photoSelected.assets[0].uri) {
      const photoInfo = (await FileSystem.getInfoAsync(
        photoSelected.assets[0].uri
      )) as IFileInfo;

      if (photoInfo?.size && photoInfo.size / 1021 / 1024 > 10) {
        toast.show({
          title: 'A imagem deve ter no máximo 10MB',
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

      const userDocumentUploadForm = new FormData();
      userDocumentUploadForm.append('file', photoFile);

      try {
        const response = await api.post(
          `/quotes/partner/document/${quoteId}/${quote.hashId}`,
          userDocumentUploadForm,
          {
            headers: {
              id: user.id,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        await api.put(
          `/quotes/document/owner/${response.data.id}/${user.id}/`,
          {
            headers: {
              id: user.id,
            },
          }
        );
      } catch (error) {
        throw new AppError('Erro ao enviar arquivo');
      }

      setPartnerMidia(photoFile);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function fetchQuote() {
        try {
          const response = await api.get(`/quotes/find/${quoteId}`, {
            headers: {
              id: user.id,
            },
          });

          setQuote(response.data);
          setValue('partnerNotes', response.data.partner_notes);
          setValue('serviceDescription', response.data.service_decription);
          setValue('serviceValue', response.data.service_price);
          setValue('franchisePrice', response.data.franchise_price);
        } catch (error) {
          throw new AppError('Erro ao buscar detalhes do orçamento');
        }
      }
      fetchQuote();
    }, [quoteId])
  );

  useFocusEffect(
    useCallback(() => {
      async function handleQuoteDocuments() {
        try {
          const user = quote.UserQuotesDocuments.filter(
            (item) => !item.isPartnerDocument
          );

          const partner = quote.UserQuotesDocuments.filter(
            (item) => item.isPartnerDocument
          );

          setPartnerMidia(partner);
          setUserMidia(user);
        } catch (error) {
          throw new AppError('Erro ao buscar arquivos do orçamento');
        }
      }

      handleQuoteDocuments();
    }, [quote, location])
  );

  useFocusEffect(
    useCallback(() => {
      async function handleQuoteStatus() {
        try {
          if (quote.status === 1) {
            await api.put(
              `/quotes/status/${quoteId}`,
              {
                status: 2,
              },
              {
                headers: {
                  id: user.id,
                },
              }
            );
          }
        } catch (error) {
          throw new AppError('Erro ao atualizar status do orçamento');
        }
      }

      handleQuoteStatus();
    }, [quote.status])
  );

  useFocusEffect(
    useCallback(() => {
      async function handleLocationDetails() {
        try {
          const responseLocation = await api.get(`/locations/${locationId}`, {
            headers: {
              id: user.id,
            },
          });

          setLocation(responseLocation.data);
        } catch (error) {
          throw new AppError('Erro ao buscar detalhes do local');
        }
      }

      handleLocationDetails();
    }, [locationId])
  );

  return (
    <VStack>
      <VStack>
        <AppHeader
          title="Detalhes do orçamento"
          navigation={navigation}
          screen="orders"
        />
      </VStack>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Dados do proprietário
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <HStack>
              <UserPhoto
                source={{
                  uri: quote.users?.avatar
                    ? `${api.defaults.baseURL}/user/avatar/${quote.users?.id}/${quote.users?.avatar}`
                    : `https://ui-avatars.com/api/?format=png&name=${user.name}+${quote.users?.last_name}&size=512`,
                }}
                alt="Foto de perfil"
                size={70}
              />
              <VStack pl={3}>
                <Text bold>
                  Nome:{' '}
                  <Text fontWeight={'normal'}>
                    {quote.users?.name} {quote.users?.last_name}
                  </Text>
                </Text>
                <Text bold>
                  Email: <Text fontWeight={'normal'}>{quote.users?.email}</Text>
                </Text>
                <Text bold>
                  Telefone:{' '}
                  <Text fontWeight={'normal'}>{quote.users?.mobile_phone}</Text>
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Dados do veiculo
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <HStack justifyContent={'space-between'}>
              <VStack>
                <Text bold>
                  Marca:{' '}
                  <Text fontWeight={'normal'}>
                    {VechiclesBrands.map(
                      (model) =>
                        model.id === quote.vehicles?.brand_id && model.name
                    )}
                  </Text>
                </Text>
                <Text bold>
                  Modelo:{' '}
                  <Text fontWeight={'normal'}>
                    {VEHICLE_MODELS.map(
                      (model) =>
                        model.id === quote.vehicles?.name_id && model.name
                    )}
                  </Text>
                </Text>

                <Text bold>
                  Ano: <Text fontWeight={'normal'}>{quote.vehicles?.year}</Text>
                </Text>
                <Text bold>
                  Placa:{' '}
                  <Text fontWeight={'normal'}>{quote.vehicles?.plate}</Text>
                </Text>
                <Text bold>
                  Cor:{' '}
                  <Text fontWeight={'normal'}>{quote.vehicles?.color}</Text>
                </Text>
              </VStack>

              <VStack>
                {VechiclesBrands.map(
                  (vehicle) =>
                    vehicle.id === quote.vehicles?.brand_id && (
                      <Image
                        source={getLogoImage(vehicle.icon)}
                        alt={'Carro'}
                        size={100}
                      />
                    )
                )}
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Seguradora
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <HStack>
              <VStack>
                <Text fontWeight={'bold'}>
                  Nome:{' '}
                  <Text fontStyle={'normal'}>
                    {quote.insurance_company?.name}
                  </Text>
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Dados do local
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <HStack>
              <VStack>
                <Text fontWeight={'bold'}>
                  Local:{' '}
                  <Text fontStyle={'normal'}>{location.business_name}</Text>
                </Text>
                <Text fontWeight={'bold'}>
                  CNPJ/CPF: <Text fontStyle={'normal'}>{location.cnpj}</Text>
                </Text>
                <Text fontWeight={'bold'}>
                  Endereço:{' '}
                  <Text fontStyle={'normal'}>
                    {location.address_line},{location.number} - {location.city}{' '}
                    - {location.state}
                  </Text>
                </Text>
                <Text fontWeight={'bold'}>
                  Email:{' '}
                  <Text fontStyle={'normal'}>{location.business_email}</Text>
                </Text>
                <Text fontWeight={'bold'}>
                  Telefone:{' '}
                  <Text fontStyle={'normal'}>{location.business_phone}</Text>
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Serviço requerido
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Text>
              {SERVICES_LIST.map(
                (service) =>
                  service.id === quote.service_type_id && service.name
              )}
            </Text>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Observações do proprietário
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Text>{quote.user_notes}</Text>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Arquivos de mídia
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            {userMidia.map((file) => (
              <Image
                borderRadius={5}
                key={file.id}
                source={{
                  uri: `${api.defaults.baseURL}/quotes/document/${file.id}/${file.hashId}`,
                }}
                alt="Imagem do usuário"
                resizeMode="cover"
                size={350}
                mb={5}
              />
            ))}
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Observações (opcional)
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            {quote.status !== 3 && (
              <Controller
                control={control}
                name="partnerNotes"
                rules={{ required: 'Adicione informações adicionais' }}
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    placeholder="Suas observações"
                    fontSize="sm"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.partnerNotes?.message}
                  />
                )}
              />
            )}
            {quote.status === 3 && <Text>{quote.partner_notes}</Text>}
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Descrição do serviço
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            {quote.status !== 3 && (
              <Controller
                control={control}
                name="serviceDescription"
                rules={{ required: 'Descreve o serviço' }}
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    placeholder="Descrição do serviço"
                    fontSize="sm"
                    defaultValue=""
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.serviceDescription?.message}
                  />
                )}
              />
            )}
            {quote.status === 3 && <Text>{quote.service_decription}</Text>}
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Valor da franquia
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            {quote.status !== 3 && (
              <Controller
                control={control}
                name="franchisePrice"
                rules={{
                  required:
                    'Insira o valor da franquia, caso nao haja coloque 0',
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Valor da franquia"
                    fontSize="sm"
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    errorMessage={errors.partnerNotes?.message}
                  />
                )}
              />
            )}
            {quote.status === 3 && <Text>R$ {quote.franchise_price}</Text>}
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Valor do servico
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            {quote.status !== 3 && (
              <Controller
                control={control}
                name="serviceValue"
                rules={{ required: 'Insira o valor do serviço' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Valor do serviço"
                    fontSize="sm"
                    defaultValue=""
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    errorMessage={errors.partnerNotes?.message}
                  />
                )}
              />
            )}
            {quote.status === 3 && <Text>R$ {quote.franchise_price}</Text>}
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold pb={2}>
            Documento de orçamento
          </Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            {partnerMidia.length > 0 &&
              partnerMidia?.map((file) => (
                <Image
                  borderRadius={5}
                  key={file.id}
                  source={{
                    uri: `${api.defaults.baseURL}/quotes/document/${file.id}/${file.hashId}`,
                  }}
                  alt="Imagem do usuário"
                  resizeMode="cover"
                  size={350}
                  mb={5}
                />
              ))}

            {quote.status !== 3 && (
              <Button
                title="Anexar arquivo"
                variant={'outline'}
                onPress={handleDocumentUpload}
              />
            )}
          </VStack>
        </VStack>

        {quote.status !== 3 && (
          <VStack px={3} py={3}>
            <Button
              title="Enviar orçamento"
              mt={5}
              onPress={handleSubmit(handleSubmitSucess)}
              isLoading={isLoading}
            />
            <Button title="Recusar orçamento" variant={'outline'} mt={5} />
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
}
