/* eslint-disable import/no-extraneous-dependencies */
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import getLogoImage from '@components/LogosImages';
import { TextArea } from '@components/TextArea';
import { VechiclesBrands } from '@data/VechiclesBrands';
import { ILocation } from '@dtos/ILocation';
import { IQuoteList } from '@dtos/IQuoteList';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useAuth } from '@hooks/useAuth';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  VStack,
  Text,
  useToast,
  ScrollView,
  Image,
  HStack,
  Avatar,
  FlatList,
} from 'native-base';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type RouteParamsProps = {
  quoteId: string;
  locationId: string;
  vehicleId: string;
};

export function QuoteDetails() {
  const [isLoading, setIsLoading] = useState(false);

  const [quote, setQuote] = useState<IQuoteList>({} as IQuoteList);
  const [location, setLocation] = useState<ILocation>({} as ILocation);
  const [vehicle, setVehicle] = useState<IVehicleDTO>({} as IVehicleDTO);

  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();
  const { quoteId, locationId, vehicleId } = route.params as RouteParamsProps;

  async function handleCancelQuote() {
    Alert.alert(
      'Tem certeza que deseja cancelar o orçamento?',
      'Ao cancelar o orçamento, você não poderá mais editar os detalhes do mesmo.',
      [
        {
          text: 'Cancelar',
          onPress: async () => {
            try {
              setIsLoading(true);
              await api.put(
                `/quotes/status/${locationId}`,
                {
                  status: 4,
                },
                {
                  headers: {
                    id: user.id,
                  },
                }
              );

              toast.show({
                title: 'Orçamento cancelado com sucesso!',
                placement: 'top',
                bgColor: 'green.500',
              });
            } catch (error) {
              const isAppError = error instanceof AppError;
              const errorMessage = isAppError
                ? error.message
                : 'Ocorreu um erro ao cancelar o orçamento';
              toast.show({
                title: errorMessage,
                placement: 'top',
                bgColor: 'red.500',
              });
            } finally {
              setIsLoading(false);
              navigation.navigate('quotesList');
            }
          },
        },

        {
          text: 'Voltar',
          onPress: () => {},
        },
      ]
    );
  }

  useFocusEffect(
    useCallback(() => {
      async function fetchLocation() {
        try {
          const location = await api.get(`/locations/${locationId}`, {
            headers: {
              id: user.id,
            },
          });

          setLocation(location.data);
        } catch (error) {
          const isAppError = error instanceof AppError;
          const errorMessage = isAppError
            ? error.message
            : 'Ocorreu um erro ao buscar os orçamentos';
          toast.show({
            title: errorMessage,
            placement: 'top',
            bgColor: 'red.500',
          });
        }
      }

      fetchLocation();
    }, [locationId])
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          const response = await api.get(`/quotes/find/${quoteId}`, {
            headers: {
              id: user.id,
            },
          });

          setQuote(response.data);
          console.log(response.data);
        } catch (error) {
          const isAppError = error instanceof AppError;
          toast.show({
            title: isAppError ? error.message : 'Erro ao buscar orçamento',
            placement: 'top',
            bg: 'red.500',
          });
        }
      }

      fetchData();
    }, [quoteId, quote.status])
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchVehicleDetails() {
        const vehicle = await api.get(`/vehicles/${vehicleId}`, {
          headers: {
            id: user.id,
          },
        });

        setVehicle(vehicle.data);
      }

      fetchVehicleDetails();
    }, [vehicleId])
  );

  console.log(quote?.UserQuotesDocuments);

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader
          title="Detalhes do orçamento"
          navigation={navigation}
          screen="quotesList"
        />
      </VStack>

      <VStack px={5}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 200,
          }}
        >
          <VStack>
            <VStack backgroundColor="white" borderRadius={10} p={5}>
              <HStack>
                <VStack>
                  <Avatar
                    source={{
                      uri: location.users?.avatar
                        ? `${api.defaults.baseURL}/user/avatar/${location.users?.id}/${location.users?.avatar}`
                        : `https://ui-avatars.com/api/?format=png&name=${location.business_name}+${location.business_email}&size=512`,
                    }}
                    size={'lg'}
                    mr={2}
                  />
                </VStack>
                <VStack>
                  <VStack w={250}>
                    <Text fontSize={'sm'} bold>
                      {location.business_name}
                    </Text>
                    <Text fontSize={'sm'}>
                      {location.address_line},{location.number} -{' '}
                      {location.city} - {location.state}
                    </Text>
                  </VStack>
                </VStack>
              </HStack>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Status</Text>
              {quote.status === 1 && <Text>Solicitado</Text>}
              {quote.status === 2 && <Text>Em analise</Text>}
              {quote.status === 3 && <Text>Aprovado</Text>}
              {quote.status === 4 && (
                <Text>Recusado ou Cancelado pelo usuario</Text>
              )}
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Chave de verificacao</Text>
              <HStack justifyContent={'space-between'} alignItems={'center'}>
                <VStack w={160}>
                  <Text fontSize={'2xs'}>{quote?.hashId}</Text>
                </VStack>
                <QRCode value={quote?.hashId} size={100} />
              </HStack>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Descrição</Text>
              <Text>{quote?.user_notes}</Text>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <HStack justifyContent={'space-between'}>
              <VStack px={5} py={5}>
                <Text bold>Veiculo</Text>
                <Text>{vehicle.brand?.name}</Text>
                <Text>{vehicle.name?.name}</Text>
                <Text>{vehicle.year}</Text>
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

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold mb={2}>
                Arquivos enviados pelo usuario
              </Text>
              <VStack>
                <FlatList
                  data={quote?.UserQuotesDocuments}
                  keyExtractor={(item) => item.id}
                  pagingEnabled
                  snapToAlignment="start"
                  renderItem={({ item }) => (
                    <Image
                      borderRadius={5}
                      source={{
                        uri: `${api.defaults.baseURL}/quotes/document/${item.id}/${item.hashId}`,
                      }}
                      alt="Imagem do usuario"
                      resizeMode="cover"
                      size={350}
                      mb={5}
                    />
                  )}
                />
              </VStack>
            </VStack>
          </VStack>

          {quote.status === 2 && (
            <>
              <VStack backgroundColor="white" borderRadius={10} mt={5}>
                <VStack px={5} py={5}>
                  <Text bold>Observacoes do profissional</Text>
                  <Text>{quote.partner_notes}</Text>
                </VStack>
              </VStack>

              <VStack backgroundColor="white" borderRadius={10} mt={5}>
                <VStack px={5} py={5}>
                  <Text bold>Descricao do servico</Text>
                  <Text>{quote.service_decription}</Text>
                </VStack>
              </VStack>

              <VStack backgroundColor="white" borderRadius={10} mt={5}>
                <VStack px={5} py={5}>
                  <Text bold>Valor do orcamento</Text>
                  <Text>{quote.service_price}</Text>
                </VStack>
              </VStack>

              <VStack backgroundColor="white" borderRadius={10} mt={5}>
                <VStack px={5} py={5}>
                  <Text bold>Valor aceito pela franquia</Text>
                  <Text>{quote.franchise_price}</Text>
                </VStack>
              </VStack>

              <VStack backgroundColor="white" borderRadius={10} mt={5}>
                <VStack px={5} py={5}>
                  <Text bold>Valor total do documento</Text>
                  <Text>{quote.franchise_price}</Text>
                </VStack>
              </VStack>

              <VStack backgroundColor="white" borderRadius={10} mt={5}>
                <VStack px={5} py={5}>
                  <Text bold>Documento de orcamento</Text>
                  {}
                </VStack>
              </VStack>
            </>
          )}

          {quote.status !== 3 && (
            <VStack mt={5}>
              <Button
                title="Cancelar orçamento"
                onPress={handleCancelQuote}
                isLoading={isLoading}
              />
            </VStack>
          )}

          {quote.status === 3 && (
            <VStack backgroundColor="white" borderRadius={10} mt={5}>
              <VStack px={5} py={5}>
                <Text bold>Deixe a sua opniao sobre o profissional</Text>
                <TextArea mt={1} />
                <VStack>
                  <Button title="Enviar" />
                </VStack>
              </VStack>
            </VStack>
          )}
        </ScrollView>
      </VStack>
    </VStack>
  );
}
