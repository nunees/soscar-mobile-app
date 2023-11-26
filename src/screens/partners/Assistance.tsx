import EletricProblemImage from '@assets/services/eletric-problem.png';
import KeyMakerImage from '@assets/services/keymaker.png';
import NoFuelImage from '@assets/services/nofuel.png';
import TowCarImage from '@assets/services/tow-car.png';
import TireImage from '@assets/services/wheel.png';
import { AppHeader } from '@components/AppHeader';
import { Input } from '@components/Input';
import { ListServices } from '@components/ListServices';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { VStack, Text, ScrollView, useToast } from 'native-base';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

enum Services {
  TOW_CAR = 1,
  TIRE = 2,
  KEY_MAKER = 3,
  ELETRIC_PROBLEM = 4,
  NO_FUEL = 5,
}

export function Assistance() {
  const navigation = useNavigation();

  const [fee, setFee] = useState('');
  const [servicePrice, setServicePrice] = useState('');

  const { user } = useAuth();

  const toast = useToast();

  async function createAssistance(serviceId: number) {
    try {
      if (fee.length === 0 && servicePrice.length === 0) {
        throw new AppError('Informe os valores da assistência');
      }

      // Check if the user has already created an assistance
      const result = await api.get(`/assistance/status/all`, {
        headers: {
          id: user.id,
        },
      });

      if (!result.data.length) {
        await api.post(
          `/assistance/status/${serviceId}`,
          {
            serviceId,
            milesFee: Number(fee),
            price: Number(servicePrice),
          },
          {
            headers: {
              id: user.id,
            },
          }
        );
      } else {
        await api.put(
          `/assistance/status/update/${result.data.id}`,
          {
            serviceId,
            milesFee: fee.replace(',', '.'),
            price: servicePrice.replace(',', '.'),
          },
          {
            headers: {
              id: user.id,
            },
          }
        );
      }

      toast.show({
        title:
          'Tudo certo!, mude para o modo de assistência para receber chamados',
        placement: 'top',
        bgColor: 'green.500',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'Ocorreu um erro ao criar a assistência';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <SafeAreaProvider>
      <VStack>
        <AppHeader
          title={'Assistência'}
          navigation={navigation}
          screen={'home'}
          isPartner
        />
      </VStack>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <VStack px={3}>
          <VStack background={'white'} p={3} borderRadius={10} mt={3}>
            <VStack alignSelf={'center'} mb={2}>
              <Text bold textAlign={'center'} pb={1}>
                Taxa de deslocamento (por km)
              </Text>
              <Input
                placeholder="R$ xxx,xx"
                h={10}
                w={200}
                keyboardType="numeric"
                onChangeText={setFee}
                value={fee}
              />
            </VStack>
            <VStack alignSelf={'center'} mb={2}>
              <Text bold textAlign={'center'} pb={1}>
                Taxa de serviço
              </Text>
              <Input
                placeholder="R$ xxx,xx"
                h={10}
                w={200}
                keyboardType="numeric"
                value={servicePrice}
                onChangeText={setServicePrice}
              />
            </VStack>
          </VStack>

          <VStack background={'white'} p={3} borderRadius={10} mt={3}>
            <Text bold textAlign={'center'}>
              Qual tipo de serviço você quer prestar?
            </Text>
          </VStack>
        </VStack>

        <VStack px={3} py={3}>
          <ListServices
            image={TireImage}
            alt={'Borracheiro'}
            title={'Borracheiro'}
            content={'Problema com os pneus do veiculo?'}
            onPress={() => createAssistance(Services.TIRE)}
          />

          <ListServices
            image={KeyMakerImage}
            alt={'Chaveiro'}
            title={'Chaveiro'}
            content={'Problema com a chave do veiculo? '}
            onPress={() => createAssistance(Services.KEY_MAKER)}
          />

          <ListServices
            image={TowCarImage}
            alt={'Guinchos'}
            title={'Guinchos'}
            content={'O carro quebrou?'}
            onPress={() => createAssistance(Services.TOW_CAR)}
          />

          <ListServices
            image={EletricProblemImage}
            alt={'Pane Elétrica'}
            title={'Pane Elétrica'}
            content={'Problema com a bateria? '}
            onPress={() => createAssistance(Services.ELETRIC_PROBLEM)}
          />

          <ListServices
            image={NoFuelImage}
            alt={'Pane Seca'}
            title={'Pane Seca'}
            content={'Acabou a combustível?'}
            onPress={() => createAssistance(Services.NO_FUEL)}
          />
        </VStack>
      </ScrollView>
    </SafeAreaProvider>
  );
}
