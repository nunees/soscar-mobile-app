import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import { ILocation } from '@dtos/ILocation';
import { IQuoteList } from '@dtos/IQuoteList';
import { useAuth } from '@hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { Center, VStack, Text } from 'native-base';
import { useEffect, useState } from 'react';

type RouteParamsProps = {
  quoteId: string;
  hashId: string;
};

export function QuoteDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState('');
  const [quote, setQuote] = useState<IQuoteList>();
  const [location, setLocation] = useState<ILocation>();

  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { quoteId, hashId } = route.params as RouteParamsProps;

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

      console.log(quote);

      const location = await api.get(`/locations/${quote.id}`, {
        headers: {
          id: user.id,
        },
      });

      console.log(location.data);

      setLocation(location.data);

      setIsLoading(false);
      setIsLoadingMessage('');
    } catch (error) {
      throw new AppError(error.message);
    } finally {
      setIsLoadingMessage('');
      setIsLoading(false);
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

      <VStack alignSelf="center" mb={3}>
        <VStack w={350} backgroundColor="white" borderRadius={10} py={5}>
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
      </VStack>
    </VStack>
  );
}
