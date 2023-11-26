/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import { SERVICES_LIST } from '@data/ServicesList';
import { ILegalQuote } from '@dtos/ILegalQuote';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import {
  VStack,
  Text,
  HStack,
  Badge,
  SectionList,
  useToast,
} from 'native-base';
import { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';

type IList = {
  hash: string;
  data: ILegalQuote[];
};

export function LegalQuotesList() {
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [quotes, setQuotes] = useState<IList[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  function sortQuotesByHashId(data: IList[]) {
    const grouped = data.reduce((r, a) => {
      // @ts-ignore
      r[a.hash] = [...(r[a.hash] || []), a.data];
      return r;
    }, {});

    const groupedArray = Object.keys(grouped).map((hash) => {
      return {
        hash,
        // @ts-ignore
        data: grouped[hash],
      };
    });

    return groupedArray;
  }

  async function getLegalQuotes() {
    try {
      setIsLoading(true);
      const response = await api.get(`/legal/${user.id}`, {
        headers: {
          id: user.id,
        },
      });

      const data = response.data.map((item: ILegalQuote) => {
        return {
          hash: item.hashId,
          data: item,
        };
      });

      const grouped = sortQuotesByHashId(data);

      setQuotes(grouped);
    } catch (error) {
      toast.show({
        title: 'Erro ao carregar orçamentos',
        placement: 'top',
        bg: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getLegalQuotes();

      return () => {
        setQuotes([]);
      };
    }, [])
  );

  function renderCard(item: ILegalQuote) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('legalQuoteDetails', {
            hashId: item.hashId,
          })
        }
      >
        <VStack px={2} my={2} mx={3}>
          <VStack backgroundColor={'white'} borderRadius={5} h={50}>
            <HStack p={3} justifyContent={'space-between'}>
              <HStack>
                <VStack>
                  <HStack>
                    <Text bold>Categoria: </Text>
                    <Text color="gray.600">
                      {SERVICES_LIST.map((service) =>
                        service.id === item.service_type_id ? service.name : ''
                      )}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <HStack>
                {item.status === 1 && (
                  <Badge
                    colorScheme={'info'}
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
                    ml={3}
                    borderRadius={10}
                    variant={'solid'}
                  >
                    <Text fontSize={'xs'} color={'white'}>
                      jurídico
                    </Text>
                  </Badge>
                )}

                {!item.is_juridical && (
                  <Badge
                    colorScheme={'purple'}
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
            </HStack>
          </VStack>
        </VStack>
      </TouchableOpacity>
    );
  }

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader
          title="Orçamentos Jurídicos"
          navigation={navigation}
          screen="services"
        />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          message={'Carregando orçamentos...'}
        />
      )}

      <SectionList
        sections={[...quotes]}
        renderItem={({ item }) => renderCard(item)}
        renderSectionHeader={({ section }) => (
          <VStack alignSelf={'center'}>
            <Text bold fontSize={'md'}>
              {section.data[0].created_at
                .split('T')[0]
                .split('-')
                .reverse()
                .join('/')}
            </Text>
          </VStack>
        )}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={true}
      />
    </VStack>
  );
}
