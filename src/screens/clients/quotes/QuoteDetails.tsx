import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import getLogoImage from '@components/LogosImages';
import { ILocation } from '@dtos/ILocation';
import { IQuotesDocumentDTO } from '@dtos/IQuoteDocumentDTO';
import { IQuoteList } from '@dtos/IQuoteList';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useAuth } from '@hooks/useAuth';
import { useMapsLinking } from '@hooks/useMapsLinking';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ResizeMode, Video } from 'expo-av';
import { Center, VStack, Text, useToast, ScrollView, Image } from 'native-base';
import { useEffect, useState } from 'react';
import { set } from 'react-hook-form';
import { ImageSourcePropType } from 'react-native';

type RouteParamsProps = {
  quoteId: string;
  hashId: string;
};

export function QuoteDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState('');

  const [quote, setQuote] = useState<IQuoteList>();
  const [location, setLocation] = useState<ILocation>();
  const [vehicle, setVehicle] = useState<IVehicleDTO>();
  const [userFiles, setUserFiles] = useState<IQuotesDocumentDTO[]>();

  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();
  const { quoteId, hashId } = route.params as RouteParamsProps;
  const { deviceMapNavigation } = useMapsLinking();

  async function fetchData() {
    try {
      setIsLoading(true);
      setIsLoadingMessage('Buscando dados do orçamento');
      const response = await api.get(`/quotes/${quoteId}`, {
        headers: {
          id: user.id,
        },
      });

      setQuote(response.data);

      const location = await api.get(`/locations/${quote?.location_id}`, {
        headers: {
          id: user.id,
        },
      });

      setLocation(location.data);

      const vehicle = await api.get(`/vehicles/${quote?.vehicle_id}`, {
        headers: {
          id: user.id,
        },
      });

      setVehicle(vehicle.data);

      setIsLoading(false);
      setIsLoadingMessage('');
    } catch (error) {
      setIsLoading(false);
      setIsLoadingMessage('');
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError ? error.message : 'Erro ao buscar orçamento',
        placement: 'top',
        bg: 'red.500',
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMessage('');
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader title="Detalhes do orçamento" />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={setIsLoading}
          message={isLoadingMessage}
        />
      )}

      <VStack px={5}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 200,
          }}
        >
          <VStack backgroundColor="white" borderRadius={10} py={5}>
            <Center>
              <Text bold fontSize="md" textTransform="uppercase">
                {location?.business_name}
              </Text>
              <Text fontSize="xs">{location?.address_line}</Text>
              <Text fontSize="xs">
                {location?.city} - {location?.state}
              </Text>

              <Text fontSize="xs">{location?.business_phone}</Text>
            </Center>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Status</Text>
              <Text>{quote?.hashId}</Text>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Chave de verificacao</Text>
              <Text>{quote?.hashId}</Text>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Descrição</Text>
              <Text>{quote?.user_notes}</Text>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Veiculo</Text>
              <Text>{vehicle?.brand.name}</Text>
              <Text>{vehicle?.name.name}</Text>
              <Text>{vehicle?.year}</Text>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold mb={2}>
                Arquivos enviados pelo usuario
              </Text>
              <VStack>
                {quote?.UserQuotesDocuments.map((file) => {
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
                        mb={5}
                      />
                    );
                  }
                })}
              </VStack>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Observacoes do profissional</Text>
              <Text>{quote?.partner_notes || 'Sem registro'}</Text>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Valor do orcamento</Text>
              <Text>{quote?.service_price || 'Aguardando'}</Text>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Valor aceito pela franquia</Text>
              <Text>{quote?.franchise_price || 'Aguardando'}</Text>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Valor total do documento</Text>
              <Text>{quote?.franchise_price || 'Aguardando'}</Text>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Text bold>Documento de orcamento</Text>
              <Text>{quote?.franchise_price || 'Aguardando'}</Text>
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
