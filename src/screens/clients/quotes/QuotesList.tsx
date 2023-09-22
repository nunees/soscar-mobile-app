import { AppHeader } from '@components/AppHeader';
import { Loading } from '@components/Loading';
import { LoadingModal } from '@components/LoadingModal';
import { IQuoteList } from '@dtos/IQuoteList';
import { Entypo, Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { VStack, Text, FlatList, HStack, Icon, Pressable } from 'native-base';
import { useEffect, useState } from 'react';

const serviceTypes = [
  // Acessórios
  { id: 1, category_id: 1, name: 'Calotas' },
  { id: 2, category_id: 1, name: 'Carregadores' },
  { id: 3, category_id: 1, name: 'Suportes' },
  { id: 4, category_id: 1, name: 'Outros' },

  // Câmbio
  { id: 5, category_id: 2, name: 'Retifica' },
  { id: 6, category_id: 2, name: 'Revisão' },
  { id: 7, category_id: 2, name: 'Troca de fluido' },
  { id: 8, category_id: 2, name: 'Outros' },

  // Elétrico
  { id: 9, category_id: 3, name: 'Bateria' },
  { id: 10, category_id: 3, name: 'Lâmpadas' },
  { id: 11, category_id: 3, name: 'Revisão' },
  { id: 12, category_id: 3, name: 'Vidros' },
  { id: 13, category_id: 3, name: 'Outros' },

  // Fluidos
  { id: 14, category_id: 4, name: 'Arrefecimento' },
  { id: 15, category_id: 4, name: 'Freio' },
  { id: 16, category_id: 4, name: 'Óleo' },
  { id: 17, category_id: 4, name: 'Outros' },

  // Funilaria e Pintura
  { id: 18, category_id: 5, name: 'Funilaria' },
  { id: 19, category_id: 5, name: 'Pintura' },
  { id: 20, category_id: 5, name: 'Outros' },

  // Lavagem
  { id: 21, category_id: 6, name: 'Completa' },
  { id: 22, category_id: 6, name: 'Simples' },
  { id: 23, category_id: 6, name: 'Outros' },

  // Mecânico
  { id: 24, category_id: 7, name: 'Alinhamento' },
  { id: 25, category_id: 7, name: 'Balanceamento' },
  { id: 26, category_id: 7, name: 'Correia dentada' },
  { id: 27, category_id: 7, name: 'Embreagem' },
  { id: 28, category_id: 7, name: 'Escapamento' },
  { id: 29, category_id: 7, name: 'Freio' },
  { id: 30, category_id: 7, name: 'Injeção eletrônica' },
  { id: 31, category_id: 7, name: 'Motor' },
  { id: 32, category_id: 7, name: 'Revisão' },
  { id: 33, category_id: 7, name: 'Suspensão' },
  { id: 34, category_id: 7, name: 'Outros' },

  // Pneus
  { id: 35, category_id: 8, name: 'Alinhamento' },
  { id: 36, category_id: 8, name: 'Balanceamento' },
  { id: 37, category_id: 8, name: 'Troca' },
  { id: 38, category_id: 8, name: 'Reparos' },
  { id: 39, category_id: 8, name: 'Outros' },

  // Suspensão
  { id: 40, category_id: 9, name: 'Amortecedor' },
  { id: 41, category_id: 9, name: 'Molas' },
  { id: 42, category_id: 9, name: 'Outros' },

  // Vidros
  { id: 43, category_id: 10, name: 'Reparo' },
  { id: 44, category_id: 10, name: 'Troca' },
  { id: 45, category_id: 10, name: 'Outros' },

  // Outros
  { id: 46, category_id: 11, name: 'Outros' },
];

export function QuotesList() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState('');
  const [quotes, setQuotes] = useState<IQuoteList[]>([]);

  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  async function fetchData() {
    try {
      setIsLoading(true);
      setIsLoadingMessage('Buscando orçamentos...');
      const response = await api.get('/quotes/', {
        headers: {
          id: user.id,
        },
      });

      setQuotes(response.data);
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
        <AppHeader title="Orcamentos" />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={() => setIsLoading(false)}
          message={isLoadingMessage}
        />
      )}

      <FlatList
        data={quotes}
        renderItem={({ item }) => (
          <Pressable
            alignSelf="center"
            onPress={() =>
              navigation.navigate('quoteDetails', {
                hashId: item.hashId,
                quoteId: item.id,
              })
            }
          >
            <VStack
              w={350}
              backgroundColor="white"
              borderRadius={5}
              py={5}
              px={5}
              shadow={1}
            >
              <HStack>
                <VStack>
                  <HStack>
                    <Icon
                      as={Feather}
                      name="calendar"
                      size={5}
                      color="purple.500"
                    />
                    <Text pl={2}>
                      {item.created_at
                        ?.toString()
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/')}
                    </Text>
                  </HStack>
                </VStack>
                <VStack pl={5}>
                  <HStack>
                    <Icon
                      as={Feather}
                      name="clock"
                      size={5}
                      color="purple.500"
                    />
                    <Text pl={1}>
                      {item.created_at
                        ?.toString()
                        .split('T')[1]
                        .split(':')
                        .slice(0, 2)
                        .join(':')}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <HStack pt={3}>
                <VStack>
                  <HStack>
                    <Icon
                      as={Feather}
                      name="tool"
                      size={5}
                      color="purple.400"
                    />
                    <Text fontWeight={'normal'} pl={2}>
                      {
                        serviceTypes.find(
                          (service) => service.id === item.service_type_id
                        )?.name
                      }
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <HStack pt={3}>
                <VStack>
                  <HStack>
                    <Icon
                      as={Feather}
                      name="life-buoy"
                      size={5}
                      color="purple.400"
                    />
                    <Text fontWeight={'normal'} pl={2}>
                      {item.insurance_company.name}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <HStack mt={5}>
                <Text fontSize="xs" color="gray.600">
                  key: {item.hashId}
                </Text>
              </HStack>
            </VStack>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text>Nao exitem orcamentos registrados</Text>
        )}
      />
    </VStack>
  );
}
