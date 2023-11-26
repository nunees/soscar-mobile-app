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
import { ScrollView, VStack } from 'native-base';

export function Schedules() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack>
      <VStack>
        <AppHeader
          title="Agendamento"
          navigation={navigation}
          screen={'services'}
        />
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <VStack px={5} pt={3}>
          <ListServices
            image={EngineService}
            alt={'Mecânico'}
            title={'Mecânico'}
            content={
              'Resolva problemas com motores, injeção eletrônica e problemas relacionados'
            }
            onPress={() =>
              navigation.navigate('searchSchedule', { serviceId: '7' })
            }
          />

          <ListServices
            image={EletricService}
            alt={'Elétrica'}
            title={'Elétrica'}
            content={
              'Resolva problemas com instalações elétricas, baterias e problemas relacionados'
            }
            onPress={() =>
              navigation.navigate('searchSchedule', { serviceId: '3' })
            }
          />

          <ListServices
            image={PaintService}
            alt={'Funilaria'}
            title={'Funilaria e Pintura'}
            content={
              'Resolva problemas com funilaria, pintura e problemas relacionados'
            }
            onPress={() =>
              navigation.navigate('searchSchedule', { serviceId: '5' })
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
              navigation.navigate('searchSchedule', { serviceId: '6' })
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
              navigation.navigate('searchSchedule', { serviceId: '10' })
            }
          />

          <ListServices
            image={OilService}
            alt={'Troca de fluidos'}
            title={'Troca de fluidos'}
            content={
              'Troca de fluidos, óleo, freios e outros, com profissionais qualificados'
            }
            onPress={() =>
              navigation.navigate('searchSchedule', { serviceId: '4' })
            }
          />

          <ListServices
            image={WhellService}
            alt={'Borracharia'}
            title={'Borracharia'}
            content={
              'Resolva problemas com pneus, troca e reparos de pneus automotivos'
            }
            onPress={() =>
              navigation.navigate('searchSchedule', { serviceId: '8' })
            }
          />

          <ListServices
            image={AccessoriesService}
            alt={'Acessórios'}
            title={'Acessórios'}
            content={'Instalação de acessórios automotivos em geral'}
            onPress={() =>
              navigation.navigate('searchSchedule', { serviceId: '1' })
            }
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
