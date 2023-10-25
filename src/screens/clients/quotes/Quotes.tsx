import EngineService from '@assets/services/car-engine.png';
import WashService from '@assets/services/car-service.png';
import GlassService from '@assets/services/glass.png';
import EletricService from '@assets/services/spark-plug.png';
import PaintService from '@assets/services/spray-gun.png';
import { AppHeader } from '@components/AppHeader';
import { ListServices } from '@components/ListServices';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack, ScrollView } from 'native-base';

export function Quotes() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  return (
    <VStack>
      <VStack>
        <AppHeader
          title="Tipos de orçamentos"
          navigation={navigation}
          screen="services"
        />
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        marginBottom={100}
        mb={5}
      >
        <VStack px={3} mt={3}>
          <ListServices
            image={EngineService}
            alt={'Mecânico'}
            title={'Mecânico'}
            content={
              'Resolva problemas com motores, injeção eletrônica e problemas relacionados'
            }
            onPress={() =>
              navigation.navigate('searchQuote', {
                serviceId: '7',
              })
            }
          />

          <ListServices
            image={EletricService}
            alt={'Elétrica'}
            title={'Elétrica'}
            content={
              'Resolva problemas instalações eletricas, baterias e problemas relacionados'
            }
            onPress={() =>
              navigation.navigate('searchQuote', {
                serviceId: '3',
              })
            }
          />

          <ListServices
            image={PaintService}
            alt={'Funilaria'}
            title={'Funilaria e Pintura'}
            content={
              'Resolva problemas funilaria, pintura e problemas relacionados'
            }
            onPress={() =>
              navigation.navigate('searchQuote', {
                serviceId: '5',
              })
            }
          />

          <ListServices
            image={WashService}
            alt={'Lavagem'}
            title={'Limpeza e lavagem'}
            content={
              'Limpeza e lavagem de veículos, interna e externa, com profissionais qualificados'
            }
            onPress={() =>
              navigation.navigate('searchQuote', {
                serviceId: '6',
              })
            }
          />

          <ListServices
            image={GlassService}
            alt={'Vidros'}
            title={'Vidros'}
            content={
              'Resolva problemas com vidros, troca e reparos de vidros automotivos'
            }
            onPress={() =>
              navigation.navigate('searchQuote', {
                serviceId: '10',
              })
            }
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
