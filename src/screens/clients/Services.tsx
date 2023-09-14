import CalendarImage from '@assets/services/calendar.png';
import CompliantImage from '@assets/services/compliant.png';
import FindImage from '@assets/services/find.png';
import PaperImage from '@assets/services/paper.png';
import TimeImage from '@assets/services/time.png';
import { AppHeader } from '@components/AppHeader';
import { ServiceCardTypes } from '@components/ServiceCardTypes';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack } from 'native-base';

export function Services() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader title="Serviços" />
      </VStack>

      <ServiceCardTypes
        icon="calendar"
        title={'Agendamento de  serviços'}
        text={'Agende seus serviços sem sair de casa'}
        onPress={() => navigation.navigate('schedules')}
        image={CalendarImage}
        alt="Agendar serviços"
      />
      <ServiceCardTypes
        icon="file-text"
        title={'Orçamento de  serviços'}
        text={'Realize orcamentos sem sair de casa'}
        onPress={() => navigation.navigate('quotes')}
        image={PaperImage}
        alt="Orçamento de serviços"
      />
      <ServiceCardTypes
        icon="briefcase"
        title={'Orçamentos judiciais'}
        text={'Realize orçamentos judiciais sem sair de casa'}
        image={CompliantImage}
        alt="Orçamento judiciais de serviços"
      />
      <ServiceCardTypes
        icon="save"
        title={'Histórico de orçamentos'}
        text={'Acompanhe seus orçamentos realizados'}
        image={TimeImage}
        alt="Acompanhe seus orçamentos realizados"
      />
      <ServiceCardTypes
        icon="compass"
        title={'Encontre um profissional'}
        text={'Encontre um profissional para realizar seu serviço'}
        image={FindImage}
        alt="Encontre um profissional para realizar seu serviço"
      />
    </VStack>
  );
}
