import EletricProblemImage from '@assets/services/eletric-problem.png';
import KeyMakerImage from '@assets/services/keymaker.png';
import NoFuelImage from '@assets/services/nofuel.png';
import TowCarImage from '@assets/services/tow-car.png';
import TireImage from '@assets/services/wheel.png';
import { AppHeader } from '@components/AppHeader';
import { ListServices } from '@components/ListServices';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { ScrollView, VStack } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AssistancesList() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <SafeAreaView>
      <VStack>
        <AppHeader
          title="Tipos de assistência"
          navigation={navigation}
          screen={'services'}
        />
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        marginBottom={100}
        mb={5}
      >
        <VStack px={3} mt={3}>
          <ListServices
            image={TireImage}
            alt={'Borracheiro'}
            title={'Borracheiro'}
            content={'Problema com os pneus do veiculo?'}
            onPress={() =>
              navigation.navigate('assistanceArchive', { serviceId: 3 })
            }
          />

          <ListServices
            image={KeyMakerImage}
            alt={'Chaveiro'}
            title={'Chaveiro'}
            content={'Problema com a chave do veiculo? '}
            onPress={() =>
              navigation.navigate('assistanceArchive', { serviceId: 4 })
            }
          />

          <ListServices
            image={TowCarImage}
            alt={'Guinchos'}
            title={'Guinchos'}
            content={'O carro quebrou?'}
            onPress={() =>
              navigation.navigate('assistanceArchive', { serviceId: 1 })
            }
          />

          <ListServices
            image={EletricProblemImage}
            alt={'Pane Elétrica'}
            title={'Pane Elétrica'}
            content={'Problema com a bateria? '}
            onPress={() =>
              navigation.navigate('assistanceArchive', { serviceId: 2 })
            }
          />

          <ListServices
            image={NoFuelImage}
            alt={'Pane Seca'}
            title={'Pane Seca'}
            content={'Acabou a combustível?'}
            onPress={() =>
              navigation.navigate('assistanceArchive', { serviceId: 5 })
            }
          />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
