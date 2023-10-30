/* eslint-disable no-nested-ternary */
import { AppHeader } from '@components/AppHeader';
import { ILegalQuote } from '@dtos/ILegalQuote';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { formatDateAndTime } from '@utils/DayjsDateProvider';
import {
  HStack,
  VStack,
  Text,
  Center,
  FlatList,
  Heading,
  Badge,
  ScrollView,
  IconButton,
  Icon,
} from 'native-base';
import { useCallback, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';

type RouteParams = {
  hashId: string;
};

export function LegalQuoteDetails() {
  const [legal, setLegal] = useState<ILegalQuote[]>([]);

  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const { hashId } = route.params as RouteParams;

  function calc(first: number | undefined, second: number | undefined) {
    if (!first || !second) return '0';
    const temp = first - second;
    return String(temp);
  }

  async function getLegalQuote() {
    try {
      const response = await api.get(`/legal/hash/${hashId}`, {
        headers: {
          id: user.id,
        },
      });

      setLegal(response.data);
      console.log(legal);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getLegalQuote();
    }, [])
  );

  function renderItem(item: ILegalQuote) {
    return (
      <VStack backgroundColor="white" borderRadius={10} mt={5} p={5}>
        <HStack justifyContent={'space-between'}>
          <VStack w={200}>
            <Text bold>{item.location?.business_name}</Text>
            <Text>
              {item.location?.address_line},{item.location?.city}-
              {item.location?.state}
            </Text>
          </VStack>
          <VStack>
            <Badge
              colorScheme={
                item.status === 1
                  ? 'info'
                  : item.status === 2
                  ? 'yellow'
                  : item.status === 3
                  ? 'green'
                  : 'red'
              }
              variant={'subtle'}
              borderRadius={10}
            >
              <Text bold>
                {item.status === 1
                  ? 'Aguardando'
                  : item.status === 2
                  ? 'Em Processo'
                  : item.status === 3
                  ? 'Aprovado'
                  : 'Recusado'}
              </Text>
            </Badge>
          </VStack>
        </HStack>

        {item.status === 3 && (
          <VStack mt={3}>
            <HStack>
              <VStack>
                <HStack justifyContent={'space-between'}>
                  <Text marginRight={150}>Valor da franquia:</Text>
                  <Text> R$ {item.franchise_price}</Text>
                </HStack>

                <HStack justifyContent={'space-between'}>
                  <Text>Valor do servico:</Text>
                  <Text> R$ {item.service_price}</Text>
                </HStack>

                <HStack justifyContent={'space-between'}>
                  <Text>Valor total do document:</Text>
                  <Text>
                    R$ {calc(item.service_price, item.franchise_price)}
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            <HStack mt={5}>
              <VStack>
                <Text bold>Notas</Text>
                <Text>{item.partner_notes}</Text>
              </VStack>
            </HStack>
          </VStack>
        )}
        <HStack mt={5} alignItems={'center'} justifyContent={'space-between'}>
          <Text fontSize={'xs'} bold>
            Ult. Atualizacao:{' '}
            {item.updated_at
              ? formatDateAndTime(new Date(item.updated_at))
              : formatDateAndTime(new Date(item.created_at))}
          </Text>
          {item.status === 3 && (
            <IconButton
              ml={5}
              icon={<Icon as={Feather} name="download" />}
              _icon={{ color: 'purple.400' }}
            />
          )}
        </HStack>
      </VStack>
    );
  }

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader
          title="Detalhes do orçamento"
          navigation={navigation}
          screen="quotesList"
        />
      </VStack>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <VStack px={5}>
          <VStack backgroundColor="white" borderRadius={10} mt={5}>
            <VStack px={5} py={5}>
              <Center>
                <Heading bold>Resumo</Heading>
                <QRCode value={hashId} size={100} />
                <Text fontSize={'xs'} color="gray.400" textAlign={'center'}>
                  Esta chave permite a validacao e garante a autenticidade do
                  documento
                </Text>
              </Center>
            </VStack>
          </VStack>

          <FlatList data={legal} renderItem={({ item }) => renderItem(item)} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
