/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
import { AppHeader } from '@components/AppHeader';
import { ILegalQuote } from '@dtos/ILegalQuote';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useDownload } from '@hooks/useDownload';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { formatDateAndTime } from '@utils/DayjsDateProvider';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import {
  HStack,
  VStack,
  Text,
  Center,
  FlatList,
  Badge,
  ScrollView,
  Icon,
  useToast,
} from 'native-base';
import { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type RouteParams = {
  hashId: string;
};

export function LegalQuoteDetails() {
  const [legal, setLegal] = useState<ILegalQuote[]>([]);

  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const toast = useToast();
  const { hashId } = route.params as RouteParams;
  const { download } = useDownload();

  function calc(first: number | undefined, second: number | undefined) {
    if (!first || !second) return '0';
    const temp = first - second;
    return String(temp);
  }

  async function downloadFile(filename: string, item: ILegalQuote) {
    try {
      const response = await api.get(`/legal/documents/${hashId}`, {
        headers: {
          id: user.id,
        },
      });

      const partnerDocumentFiles = response.data.filter(
        (partner: any) => partner.isPartnerDocument === true
      );

      const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (perm.status !== 'granted') {
        throw new AppError(
          'Permissão negada, não foi possível baixar o arquivo'
        );
      }

      partnerDocumentFiles.map(async (file: any) => {
        try {
          const downloadedFile = await download(
            `${process.env.SERVER_ADDRESS}/legal/documents/get/${file.id}/${file.hash_id}`,
            file.document_url
          );

          if (downloadedFile?.uri) {
            // open the image in the default viewer
            const asset = await MediaLibrary.createAssetAsync(
              downloadedFile.uri
            );

            const folder = await MediaLibrary.getAlbumAsync('Downloads');
            if (folder == null) {
              await MediaLibrary.createAlbumAsync('Download', asset, false);
            } else {
              await MediaLibrary.addAssetsToAlbumAsync(
                [asset],
                folder.id,
                false
              );
            }
          }
        } catch (error) {
          throw new AppError('Ocorreu um erro ao baixar o arquivo');
        }
      });

      toast.show({
        title: 'Arquivo baixado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
        color: 'white',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'Ocorreu um erro ao baixar o arquivo';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
        color: 'white',
      });
    }
  }

  async function getLegalQuote() {
    try {
      const response = await api.get(`/legal/hash/${hashId}`, {
        headers: {
          id: user.id,
        },
      });

      setLegal(response.data);
    } catch (error) {
      toast.show({
        title: 'Ocorreu um erro ao buscar o orçamento',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      getLegalQuote();

      return () => {
        setLegal([]);
      };
    }, [hashId])
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
              variant={'solid'}
              borderRadius={5}
            >
              <Text bold color="white">
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
                  <Text>Valor do serviço:</Text>
                  <Text> R$ {item.service_price}</Text>
                </HStack>

                <HStack justifyContent={'space-between'}>
                  <Text>Valor total do documento:</Text>
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
            Atualizado em:{' '}
            {item.updated_at
              ? formatDateAndTime(new Date(item.updated_at))
              : formatDateAndTime(new Date(item.created_at))}
          </Text>
          {item.status === 3 && (
            <TouchableOpacity onPress={() => downloadFile('ok', item)}>
              <VStack alignItems={'center'}>
                <Icon
                  as={Feather}
                  name="download"
                  size={8}
                  color={'purple.500'}
                />
                <Text fontSize={'xxs'}>Download</Text>
              </VStack>
            </TouchableOpacity>
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
          screen="legalQuotesList"
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
                <QRCode value={hashId} size={200} />
                <Text
                  fontSize={'xxs'}
                  color="gray.400"
                  textAlign={'center'}
                  mt={3}
                >
                  Esta chave permite a validação e garante a autenticidade do
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
