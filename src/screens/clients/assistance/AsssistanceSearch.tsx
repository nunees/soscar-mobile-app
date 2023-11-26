import { AppHeader } from '@components/AppHeader';
import { IAssistanceStatusDTO } from '@dtos/IAssistanceStatusDTO';
import { useNotification } from '@hooks/notification/useNotification';
import { useAuth } from '@hooks/useAuth';
import { useGPS } from '@hooks/useGPS';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { CalculatePositionDistance } from '@utils/CalculatePositionDistance';
import { FlatList, VStack, Text, Avatar, HStack, Pressable } from 'native-base';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type RouteParams = {
  serviceId: string;
};

export function AssistanceSearch() {
  const [partnerAvailable, setPartnerAvailable] = useState<
    IAssistanceStatusDTO[]
  >([]);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParams;

  const { user } = useAuth();

  const { position } = useGPS();

  const { sendNotification } = useNotification();

  async function findAvailablePartners() {
    try {
      const response = await api.get(`/assistance/available/${serviceId}`, {
        headers: {
          id: user.id,
        },
      });

      setPartnerAvailable(response.data);
    } catch (error) {
      throw new AppError('Erro ao buscar profissionais disponíveis');
    }
  }

  function calculatePrices(
    longitude: string,
    latitude: string,
    price: number,
    milesFee: number
  ) {
    const distance = CalculatePositionDistance(
      [position.coords.latitude, position.coords.longitude],
      [Number(latitude), Number(longitude)]
    );

    const totalFee = milesFee * distance + price;
    return totalFee.toFixed(2);
  }

  async function makeRequest(partner: IAssistanceStatusDTO) {
    try {
      const total_price = calculatePrices(
        partner.latitude,
        partner.longitude,
        partner.milesFee,
        partner.price
      );

      const total_miles = Number(
        CalculatePositionDistance(
          [position.coords.latitude, position.coords.longitude],
          [Number(partner.latitude), Number(partner.longitude)]
        ).toFixed(2)
      );

      await api.get(`/assistance/status/all`, {
        headers: {
          id: user.id,
        },
      });

      const order = await api.post(
        '/assistance/order',
        {
          userId: user.id,
          assistance_status_id: partner.id,
          order_status: 1,
          total_price: Number(total_price.replace(',', '.')),
          total_miles: Number(total_miles.toFixed(2)),
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        },
        {
          headers: {
            id: user.id,
          },
        }
      );

      await sendNotification(
        partner.user_id,
        'Nova solicitação de assistência',
        `Você recebeu uma nova solicitação de assistência de ${user.name}`,
        'Assistência',
        user.id
      );

      navigation.navigate('assistanceMap', {
        latitude: partner.latitude,
        longitude: partner.longitude,
        orderId: order.data.id,
      });
    } catch (error) {
      throw new AppError('Erro ao solicitar assistência');
    }
  }

  useFocusEffect(
    useCallback(() => {
      findAvailablePartners();

      return () => {
        setPartnerAvailable([]);
      };
    }, [serviceId])
  );

  function renderItems(item: IAssistanceStatusDTO) {
    return (
      <Pressable px={5} py={5} onPress={() => makeRequest(item)}>
        <HStack
          backgroundColor={'white'}
          p={3}
          borderRadius={10}
          justifyContent={'flex-start'}
        >
          <VStack>
            <Avatar
              size={'lg'}
              source={{
                uri:
                  item.users?.avatar &&
                  `${api.defaults.baseURL}/user/avatar/${user.id}/${item.users?.avatar}`,
              }}
            />
          </VStack>
          <VStack ml={5}>
            <Text bold>
              {item.users?.name} {item.users?.last_name}
            </Text>
            <Text>
              Cobra R$ {item.milesFee.toFixed(2).replace('.', ',')}/km
            </Text>
            <Text>
              Taxa de serviço R$ {item.price.toFixed(2).replace('.', ',')}
            </Text>

            <Text bold color="purple.600">
              Total: R${' '}
              {calculatePrices(
                item.latitude,
                item.longitude,
                item.milesFee,
                item.price
              )}
            </Text>
          </VStack>

          <VStack>
            <Text
              bold
              textAlign={'center'}
              fontSize={'xs'}
              color={'gray.600'}
              ml={15}
            >
              {CalculatePositionDistance(
                [position.coords.latitude, position.coords.longitude],
                [Number(item.latitude), Number(item.longitude)]
              ).toFixed(0)}{' '}
              km
            </Text>
          </VStack>
        </HStack>
      </Pressable>
    );
  }

  return (
    <SafeAreaView>
      <VStack>
        <AppHeader
          title="Profissionais Disponíveis"
          navigation={navigation}
          screen={'services'}
        />
      </VStack>

      <FlatList
        data={partnerAvailable}
        renderItem={({ item }) => renderItems(item)}
        ListEmptyComponent={() => (
          <VStack px={5} py={5}>
            <VStack backgroundColor={'white'} p={3} borderRadius={10}>
              <Text textAlign={'center'} bold>
                Não há profissionais disponíveis
              </Text>
            </VStack>
          </VStack>
        )}
      />
    </SafeAreaView>
  );
}
