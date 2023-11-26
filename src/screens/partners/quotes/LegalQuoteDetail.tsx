/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import getLogoImage from '@components/LogosImages';
import UserPhoto from '@components/UserPhoto';
import { SERVICES_LIST } from '@data/ServicesList';
import { VechiclesBrands } from '@data/VechiclesBrands';
import { VEHICLE_MODELS } from '@data/VehiclesModels';
import { IlegalQuoteDocument } from '@dtos/ILegalQuoteDocument';
import { ILocation } from '@dtos/ILocation';
import { IQuoteList } from '@dtos/IQuoteList';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotification } from '@hooks/notification/useNotification';
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
  legalQuoteId: string;
  locationId: string;
};

/**
 * 1 - Solicitado
 * 2 - Em analise
 * 3 - Aprovado
 * 4 - Recusado
 */

type FormDataProps = {
  partnerNotes: string;
  serviceDescription: string;
  serviceValue: string;
  franchisePrice: string;
};

const loginSchema = yup.object().shape({
  partnerNotes: yup.string().required('Informe suas observações'),
  serviceDescription: yup.string().required('Informe a descrição do serviço'),
  serviceValue: yup.string().required('Informe o valor do serviço'),
  franchisePrice: yup.string().required('Informe o valor da franquia'),
});

export function LegalQuoteDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingMessage, setIsUploadingMessage] = useState('');

  const [quote, setQuote] = useState<IQuoteList>({} as IQuoteList);
  const [files, setFiles] = useState<IlegalQuoteDocument[]>([]);

  const [location, setLocation] = useState<ILocation>({} as ILocation);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const [partnerMidia, setPartnerMidia] = useState<any[]>([]);

  const [uploadedText, setUploadedText] = useState<string>('');

  const toast = useToast();
  const { user } = useAuth();
  const route = useRoute();
  const { legalQuoteId, locationId } = route.params as RouteParams;

  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const { sendNotification } = useNotification();

  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(loginSchema),
  });

  const handleSubmitSucess = useCallback(async () => {
    try {
      setIsLoading(true);

      const fields = getValues();

      await api.patch(
        `/legal/update/${legalQuoteId}`,
        {
          partner_notes: fields.partnerNotes,
          service_description: fields.serviceDescription,
          service_price: Number(fields.serviceValue),
          status: 3,
          franchise_price: Number(fields.franchisePrice),
        },
        {
          headers: {
            id: user.id,
          },
        }
      );

      await sendNotification(
        location?.user_id as string,
        `Seu pedido de orçamento foi aprovado!`,
        'Boas notícias 😄',
        'legalQuote',
        user.id
      );

      toast.show({
        title: 'Orçamento enviado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });

      navigation.navigate('orders');
    } catch (error) {
      toast.show({
        title: 'Erro ao enviar orçamento',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDocumentUpload = useCallback(async () => {
    try {
      setIsUploading(true);
      setIsUploadingMessage('Enviando arquivo... 5%');
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0,
      });

      if (photoSelected.canceled) {
        return;
      }

      setIsUploadingMessage('Enviando arquivo... 10%');
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

        if (!fileExtension) {
          throw new AppError('Erro ao enviar arquivo');
        }

        const photoFile = {
          name: `${user.username}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        setIsUploadingMessage('Enviando arquivo... 50%');

        const userDocumentUploadForm = new FormData();
        userDocumentUploadForm.append('document', photoFile);

        setIsUploadingMessage('Enviando arquivo... 75%');
        try {
          const response = await api.post(
            `/legal/document/${quote.hashId}`,
            userDocumentUploadForm,
            {
              headers: {
                id: user.id,
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          await api.put(`/legal/document/owner/${response.data.id}`, {
            headers: {
              id: user.id,
            },
          });
        } catch (error) {
          throw new AppError('Erro ao enviar arquivo');
        }

        setIsUploadingMessage('Enviando arquivo... 90%');

        setPartnerMidia([...partnerMidia, photoFile]);

        setIsUploadingMessage('Enviando arquivo... 100%');
        setIsUploadingMessage('Arquivo enviado com sucesso');
        setIsUploading(false);
      }
    } catch (error) {
      toast.show({
        title: 'Erro ao enviar arquivo',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setUploadedText('Arquivo anexado com sucesso');
      setIsUploading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function fetchQuote() {
        try {
          const response = await api.get(`/legal/get/${legalQuoteId}`, {
            headers: {
              id: user.id,
            },
          });

          if (!response.data) {
            return;
          }

          setQuote(response.data);

          setValue('partnerNotes', response.data.partner_notes);
          setValue('serviceDescription', response.data.service_decription);
          setValue('serviceValue', response.data.service_price);
          setValue('franchisePrice', response.data.franchise_price);

          if (response.data.LegalQuoteDocuments.length > 0) {
            const documents = await api.get(
              `/legal/documents/${response.data.hashId}`,
              {
                headers: {
                  id: user.id,
                },
              }
            );

            if (!documents.data) {
              return;
            }

            setFiles(documents.data);
          }
        } catch (error) {
          throw new AppError('Erro ao buscar detalhes do orçamento');
        }
      }
      fetchQuote();
    }, [legalQuoteId])
  );

  useFocusEffect(
    useCallback(() => {
      async function handleQuoteDocuments() {
        try {
          // const user = quote.UserQuotesDocuments.filter(
          //   (item) => !item.isPartnerDocument
          // );

          if (!quote.UserQuotesDocuments) {
            return;
          }

          const partner = quote.UserQuotesDocuments.filter(
            (item) => item.isPartnerDocument
          );

          setPartnerMidia(partner);
          // setUserMidia(user);
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
            await api.patch(
              `/legal/status/${legalQuoteId}`,
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
                    ? `${api.defaults.baseURL}/user/avatar/${quote.users?.id}/${quote.users.avatar}`
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
            Dados do veículo
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
            {files.map(
              (file) =>
                !file.isPartnerDocument && (
                  <Image
                    borderRadius={5}
                    key={file.id}
                    source={{
                      uri: `${api.defaults.baseURL}/legal/documents/get/${file.id}/${quote.hashId}`,
                    }}
                    alt="Imagem do usuário"
                    resizeMode="cover"
                    w={350}
                    h={200}
                  />
                )
            )}
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          {quote.status !== 3 && (
            <VStack>
              <Text bold pb={2}>
                Observações (opcional)
              </Text>
              <VStack backgroundColor="white" borderRadius={10} p={5}>
                {!quote.partner_notes && (
                  <Controller
                    control={control}
                    name="partnerNotes"
                    rules={{ required: 'Insira suas observações' }}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Observações"
                        autoCapitalize="none"
                        fontSize={'md'}
                        keyboardType="default"
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.partnerNotes?.message}
                      />
                    )}
                  />
                )}

                {quote.partner_notes && <Text>{quote.partner_notes}</Text>}
              </VStack>
            </VStack>
          )}
          {quote.status === 3 && (
            <VStack>
              <Text bold pb={2}>
                Observações (opcional)
              </Text>
              <VStack backgroundColor="white" borderRadius={10} p={5}>
                <Text>{quote.partner_notes}</Text>
              </VStack>
            </VStack>
          )}
        </VStack>

        <VStack px={3} py={3}>
          {quote.status !== 3 && (
            <VStack>
              <Text bold pb={2}>
                Descrição do serviço
              </Text>
              <VStack backgroundColor="white" borderRadius={10} p={5}>
                {!quote.service_decription && (
                  <Controller
                    control={control}
                    name="serviceDescription"
                    rules={{ required: 'Insira a descrição do serviço' }}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Descrição do serviço"
                        autoCapitalize="none"
                        fontSize={'md'}
                        keyboardType="default"
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.serviceDescription?.message}
                      />
                    )}
                  />
                )}
                {quote.service_decription && (
                  <Text>{quote.service_decription}</Text>
                )}
              </VStack>
            </VStack>
          )}

          {quote.status === 3 && (
            <VStack>
              <Text bold pb={2}>
                Descrição do serviço
              </Text>
              <VStack backgroundColor="white" borderRadius={10} p={5}>
                <Text>{quote.service_decription}</Text>
              </VStack>
            </VStack>
          )}
        </VStack>

        <VStack px={3} py={3}>
          {quote.status !== 3 && (
            <VStack>
              <Text bold pb={2}>
                Valor da franquia (R$)
              </Text>
              <VStack backgroundColor="white" borderRadius={10} p={5}>
                <Controller
                  control={control}
                  name="franchisePrice"
                  rules={{ required: 'Insira o valor da franquia' }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Valor da franquia"
                      autoCapitalize="none"
                      fontSize={'md'}
                      keyboardType="default"
                      onChangeText={onChange}
                      value={value}
                      errorMessage={errors.franchisePrice?.message}
                    />
                  )}
                />
              </VStack>
            </VStack>
          )}
          {quote.status === 3 && (
            <VStack>
              <Text bold pb={2}>
                Valor da franquia (R$)
              </Text>
              <VStack backgroundColor="white" borderRadius={10} p={5}>
                <Text>{quote.franchise_price}</Text>
              </VStack>
            </VStack>
          )}
        </VStack>

        <VStack px={3} py={3}>
          {quote.status !== 3 && (
            <VStack>
              <Text bold pb={2}>
                Valor do orçamento (R$)
              </Text>
              <VStack backgroundColor="white" borderRadius={10} p={5}>
                <Controller
                  control={control}
                  name="serviceValue"
                  rules={{ required: 'Insira o valor do serviço' }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Descrição do serviço"
                      autoCapitalize="none"
                      fontSize={'md'}
                      keyboardType="default"
                      onChangeText={onChange}
                      value={value}
                      errorMessage={errors.serviceValue?.message}
                    />
                  )}
                />
              </VStack>
            </VStack>
          )}
          {quote.status === 3 && (
            <VStack>
              <Text bold pb={2}>
                Valor do orçamento (R$)
              </Text>
              <VStack backgroundColor="white" borderRadius={10} p={5}>
                <Text>{quote.service_price}</Text>
              </VStack>
            </VStack>
          )}
        </VStack>

        {quote.status !== 3 && (
          <VStack px={3} py={3}>
            <Text bold pb={2}>
              Documento de orçamento
            </Text>
            <VStack backgroundColor="white" borderRadius={10} p={5}>
              <VStack mb={5}>
                <Text fontSize={'xs'} color="gray.500" bold>
                  Anexe aqui uma foto do documento de orçamento que você você
                  fez, não se esqueça de enviar uma foto nítida e legível.
                </Text>
              </VStack>
              {uploadedText && (
                <Text fontSize={'xs'} color="green.500" bold>
                  {uploadedText}
                </Text>
              )}
              {quote.status !== 3 && (
                <Button
                  title="Anexar arquivo"
                  variant={'dark'}
                  bg={'purple.400'}
                  onPress={handleDocumentUpload}
                  isLoading={isUploading}
                  isLoadingText={isUploadingMessage}
                />
              )}
            </VStack>
          </VStack>
        )}

        {quote.status !== 3 && (
          <VStack px={3}>
            <Button
              title="Enviar orçamento"
              mt={2}
              onPress={handleSubmitSucess}
              isLoading={isLoading}
            />
            <Button
              title="Recusar orçamento"
              variant={'dark'}
              bg={'red.500'}
              mt={2}
            />
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
}
