import EletricProblemImage from '@assets/services/eletric-problem.png';
import KeyMakerImage from '@assets/services/keymaker.png';
import NoFuelImage from '@assets/services/nofuel.png';
import TowCarImage from '@assets/services/tow-car.png';
import TireImage from '@assets/services/wheel.png';
import { AppHeader } from '@components/AppHeader';
import { ListServices } from '@components/ListServices';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { api } from '@services/api';
import { VStack, Text, ScrollView } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function Assistance() {
  const navigation = useNavigation();

  const { user } = useAuth();

  async function createAssistance(serviceId: string) {
    try {
      const response = await api.post(
        `/assistances/${serviceId}`,
        {
          milesFee: 0,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaProvider>
      <VStack>
        <AppHeader
          title={'Assistência'}
          navigation={navigation}
          screen={'home'}
        />
      </VStack>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <VStack px={3}>
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
            onPress={() => undefined}
          />

          <ListServices
            image={KeyMakerImage}
            alt={'Chaveiro'}
            title={'Chaveiro'}
            content={'Problema com a chave do veiculo? '}
            onPress={() => undefined}
          />

          <ListServices
            image={TowCarImage}
            alt={'Guinchos'}
            title={'Guinchos'}
            content={'O carro quebrou?'}
            onPress={() => undefined}
          />

          <ListServices
            image={EletricProblemImage}
            alt={'Pane Eletrica'}
            title={'Pane Eletrica'}
            content={'Problema com a bateria? '}
            onPress={() => undefined}
          />

          <ListServices
            image={NoFuelImage}
            alt={'Pane Seca'}
            title={'Pane Seca'}
            content={'Acabou a combustivel?'}
            onPress={() => undefined}
          />
        </VStack>
      </ScrollView>
    </SafeAreaProvider>
  );
}
