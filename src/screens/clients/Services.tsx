import { AppHeader } from '@components/AppHeader';
import { ServiceCardTypes } from '@components/ServiceCardTypes';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack } from 'native-base';

export function Services() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack pb={10}>
      <VStack mb={10}>
        <AppHeader title="Serviços" />
      </VStack>

      <ServiceCardTypes
        icon="calendar"
        title={'Agendamento de  serviços'}
        text={'Agende seus serviços sem sair de casa'}
        onPress={() => navigation.navigate('schedules')}
      />
      <ServiceCardTypes
        icon="file-text"
        title={'Orçamento de  serviços'}
        text={'Agende seus serviços sem sair de casa'}
      />
      <ServiceCardTypes
        icon="briefcase"
        title={'Orçamentos judiciais'}
        text={'Realize orçamentos judiciais sem sair de casa'}
      />
      <ServiceCardTypes
        icon="save"
        title={'Histórico de orçamentos'}
        text={'Acompanhe seus orçamentos realizados'}
      />
      <ServiceCardTypes
        icon="compass"
        title={'Encontre um profissional'}
        text={'Encontre um profissional para realizar seu serviço'}
      />
    </VStack>
  );
}
