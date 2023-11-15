import { AppHeader } from '@components/AppHeader';
import { SERVICES_LIST } from '@data/ServicesList';
import { ILegalQuote } from '@dtos/ILegalQuote';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { numberToMonth } from '@utils/DayjsDateProvider';
import { VStack, Text, FlatList, HStack, Center, Badge } from 'native-base';
import { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';

export function LegalQuotesList() {
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [quotes, setQuotes] = useState<ILegalQuote[]>([]);

  async function getLegalQuotes() {
    try {
      const response = await api.get(`/legal/${user.id}`, {
        headers: {
          id: user.id,
        },
      });

      console.log(response.data);
      setQuotes(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getLegalQuotes();
    }, [])
  );

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader
          title="Orcamentos Juridicos"
          navigation={navigation}
          screen="services"
        />
      </VStack>

      {/* {quotes.state.isLoading && (
        <LoadingModal
          showModal={quotes.state.isLoading}
          message={'Carregando orçamentos...'}
        />
      )} */}

      <FlatList
        data={quotes}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('legalQuoteDetails', {
                hashId: item.hashId,
              })
            }
          >
            <VStack px={2} my={2} mx={3}>
              <VStack backgroundColor={'white'} borderRadius={5} h={110}>
                <HStack>
                  <VStack
                    w={100}
                    h={110}
                    backgroundColor={'purple.700'}
                    borderRadius={5}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <Text
                      color={'white'}
                      textAlign={'center'}
                      fontSize={'3xl'}
                      bold
                    >
                      {item.created_at?.toString().split('T')[0].split('-')[2]}
                    </Text>
                    <Text color={'white'} textAlign={'center'} fontSize={'lg'}>
                      {numberToMonth(
                        item.created_at?.toString().split('T')[0].split('-')[1]
                      )}
                    </Text>
                  </VStack>

                  <VStack ml={3} mt={3}>
                    <HStack>
                      <Text bold>Categoria: </Text>
                      <Text color="gray.600">
                        {SERVICES_LIST.map((service) =>
                          service.id === item.service_type_id
                            ? service.name
                            : ''
                        )}
                      </Text>
                    </HStack>

                    <HStack>
                      {item.status === 1 && (
                        <Badge
                          colorScheme={'info'}
                          mt={2}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text fontSize={'xs'} color="white">
                            Aguardando
                          </Text>
                        </Badge>
                      )}

                      {item.status === 2 && (
                        <Badge
                          colorScheme={'blue'}
                          mt={2}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text fontSize={'xs'} color={'white'}>
                            Analise
                          </Text>
                        </Badge>
                      )}

                      {item.status === 3 && (
                        <Badge
                          colorScheme={'green'}
                          mt={2}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text fontSize={'xs'} color={'black'}>
                            Aprovado
                          </Text>
                        </Badge>
                      )}

                      {item.status === 4 && (
                        <Badge
                          colorScheme={'red'}
                          mt={2}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text fontSize={'xs'} color={'white'}>
                            Recusado
                          </Text>
                        </Badge>
                      )}

                      {item.is_juridical && (
                        <Badge
                          colorScheme={'purple'}
                          mt={2}
                          ml={3}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text fontSize={'xs'} color={'white'}>
                            juridico
                          </Text>
                        </Badge>
                      )}

                      {!item.is_juridical && (
                        <Badge
                          colorScheme={'purple'}
                          mt={2}
                          ml={3}
                          borderRadius={10}
                          variant={'solid'}
                        >
                          <Text
                            fontSize={'xs'}
                            color={'white'}
                            borderRadius={10}
                            variant={'solid'}
                          >
                            comum
                          </Text>
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Center>
            <Text bold color="gray.400">
              Nao exitem orcamentos registrados
            </Text>
          </Center>
        )}
      />
    </VStack>
  );
}
