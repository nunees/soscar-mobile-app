import EngineService from '@assets/services/car-engine.png';
import WashService from '@assets/services/car-service.png';
import GlassService from '@assets/services/glass.png';
import OilService from '@assets/services/oil.png';
import EletricService from '@assets/services/spark-plug.png';
import PaintService from '@assets/services/spray-gun.png';
import AccessoriesService from '@assets/services/usb.png';
import WhellService from '@assets/services/wheel.png';
import { AppHeader } from '@components/AppHeader';
import { ListServices } from '@components/ListServices';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack, ScrollView } from 'native-base';

export function Quotes() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  return (
    <VStack pb={10}>
      <VStack mb={10}>
        <AppHeader title="Tipos de orçamentos" />
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false} marginBottom={100}>
        <VStack px={5}>
          <ListServices
            image={EngineService}
            alt={'Mecânico'}
            title={'Mecânico'}
            content={
              'Resolva problemas com motores, injeção eletrônica e problemas relacionados'
            }
            onPress={() =>
              navigation.navigate('searchSchedule', {
                serviceId: '1',
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
          />

          <ListServices
            image={PaintService}
            alt={'Funilaria'}
            title={'Funilaria e Pintura'}
            content={
              'Resolva problemas funilaria, pintura e problemas relacionados'
            }
          />

          <ListServices
            image={WashService}
            alt={'Lavagem'}
            title={'Limpeza e lavagem'}
            content={
              'Limpeza e lavagem de veículos, interna e externa, com profissionais qualificados'
            }
          />

          <ListServices
            image={GlassService}
            alt={'Vidros'}
            title={'Vidros'}
            content={
              'Resolva problemas com vidros, troca e reparos de vidros automotivos'
            }
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
