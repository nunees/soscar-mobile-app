/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import getLogoImage from '@components/LogosImages';
import { TextArea } from '@components/TextArea';
import UserPhoto from '@components/UserPhoto';
import { ServicesList } from '@data/ServicesList';
import { VechiclesBrands } from '@data/VechiclesBrands';
import { VehiclesModels } from '@data/VehiclesModels';
import { ILocation } from '@dtos/ILocation';
import { IQuoteList } from '@dtos/IQuoteList';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ResizeMode, Video } from 'expo-av';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  VStack,
  useToast,
  Text,
  HStack,
  Image,
  ScrollView,
  Icon,
} from 'native-base';
import { useCallback, useState } from 'react';

type RouteParams = {
  quoteId: string;
  locationId: string;
};

/**
 * 1 - Solicitado
 * 2 - Em analise
 * 3 - Aprovado
 * 4 - Recusado
 */

export function QuoteDetail() {
  const [isLoading, setIsLoading] = useState(false);

  const [quote, setQuote] = useState<IQuoteList>({} as IQuoteList);
  const [location, setLocation] = useState<ILocation>({} as ILocation);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userMidia, setUserMidia] = useState<any[]>([]);

  const [partnerNotes, setPartnerNotes] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [serviceValue, setServiceValue] = useState<number>(0);
  const [franchisePrice, setFranchisePrice] = useState<number>(0);

  const [file, setFile] = useState<any>({});

  const toast = useToast();
  const { user } = useAuth();

  const route = useRoute();
  const { quoteId, locationId } = route.params as RouteParams;

  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const handleSubmitSucess = useCallback(async () => {
    await api.patch(
      `/quotes/${quoteId}`,
      {
        partner_notes: partnerNotes,
        service_description: serviceDescription,
        service_price: serviceValue,
        status: 3,
        franchise_price: franchisePrice,
      },
      {
        headers: {
          id: user.id,
        },
      }
    );

    navigation.navigate('orders');
  }, []);

  const handleDocumentUpload = useCallback(async () => {
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

      setFile(photoFile);
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
          setFranchisePrice(response.data.franchise_price);
          setServiceDescription(response.data.service_decription);
          setServiceValue(response.data.service_price);
          setPartnerNotes(response.data.partner_notes);
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
          quote.UserQuotesDocuments.map((file) =>
            setUserMidia([...userMidia, file])
          );
        } catch (error) {
          throw new AppError('Erro ao buscar arquivos do orçamento');
        }
      }

      handleQuoteDocuments();
    }, [])
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
        <AppHeader title="Detalhes do orçamento" />
      </VStack>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <VStack px={3} py={3}>
          <Text bold>Dados do proprietario</Text>
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
          <Text bold>Dados do veiculo</Text>
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
                    {VehiclesModels.map(
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
          <Text bold>Seguradora</Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <HStack>
              <VStack>
                <Text fontWeight={'bold'}>
                  Nome:{' '}
                  <Text fontStyle={'normal'}>
                    {quote.insurance_company?.name}
                  </Text>
                </Text>
                <Text fontWeight={'bold'}>
                  Registro numero:{' '}
                  <Text fontStyle={'normal'}>
                    {quote.insurance_company?.id || 'Não informado'}
                  </Text>
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold>Dados do local</Text>
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
                  Endereco:{' '}
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
          <Text bold>Dados do profissional</Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <HStack>
              <VStack>
                <UserPhoto
                  source={{
                    uri: location.users?.avatar
                      ? `${api.defaults.baseURL}/user/avatar/${location.users?.id}/${location.users?.avatar}`
                      : `https://ui-avatars.com/api/?format=png&name=${user.name}+${quote.users?.last_name}&size=512`,
                  }}
                  alt="Foto de perfil"
                  size={70}
                />
              </VStack>
              <VStack pl={3}>
                <Text bold>
                  Nome: <Text fontStyle={'normal'}>{location.users?.name}</Text>
                </Text>

                <Text bold>
                  Email:{' '}
                  <Text fontStyle={'normal'}>{location.users?.email}</Text>
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold>Servico requerido</Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Text>
              {ServicesList.map(
                (service) =>
                  service.id === quote.service_type_id && service.name
              )}
            </Text>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold>Observacoes do proprietario</Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Text>{quote.user_notes}</Text>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold>Arquivos de midia</Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            {quote?.UserQuotesDocuments?.map((file) => {
              if (file.document_type_id === 1) {
                return (
                  <Image
                    borderRadius={5}
                    key={file.id}
                    source={{
                      uri: `${api.defaults.baseURL}/quotes/document/${file.id}/${file.hashId}`,
                    }}
                    alt="Imagem do usuario"
                    resizeMode="cover"
                    size={350}
                    mb={5}
                  />
                );
              }

              if (file.document_type_id === 3) {
                return (
                  <Video
                    source={{
                      uri: `${api.defaults.baseURL}/quotes/document/${file.id}/${file.hashId}`,
                    }}
                    resizeMode={ResizeMode.COVER}
                    style={{
                      width: 330,
                      height: 330,
                    }}
                    key={file.id}
                    useNativeControls
                    isLooping
                    isMuted
                  />
                );
              }
              return <Text>Nao ha arquivos anexados</Text>;
            })}
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold>Observacoes (opcional)</Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <TextArea
              placeholder="Suas observacoes"
              fontSize="sm"
              value={partnerNotes}
              onChangeText={setPartnerNotes}
            />
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold>Descricao do servico</Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <TextArea
              placeholder="Descricao do servico"
              fontSize="sm"
              value={serviceDescription}
              onChangeText={setServiceDescription}
            />
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold>Valor da franquia</Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Input
              placeholder="Valor da franquia"
              keyboardType="decimal-pad"
              fontSize="sm"
              value={String(franchisePrice)}
              onChangeText={(value) => setFranchisePrice(Number(value))}
            />
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold>Valor do orcamento</Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <Input
              placeholder="Valor do orcamento"
              keyboardType="decimal-pad"
              fontSize="sm"
              value={String(serviceValue)}
              onChangeText={(value) => setServiceValue(Number(value))}
            />
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <Text bold>Documento de orcamento</Text>
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            {file && (
              <HStack mb={3}>
                <Icon as={FontAwesome5} name="file-alt" size={30} />
                <Text bold>Arquivo anexado</Text>
              </HStack>
            )}
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
              title="Enviar orcamento"
              mt={5}
              onPress={handleSubmitSucess}
              isLoading={isLoading}
            />
            <Button title="Recusar orcamento" variant={'outline'} mt={5} />
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
}
