import TimeImage from '@assets/services/time.png';
import { AppHeader } from '@components/AppHeader';
import { ServiceCardTypes } from '@components/ServiceCardTypes';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Archives() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <SafeAreaView>
      <VStack>
        <AppHeader
          title={'Historico'}
          navigation={navigation}
          screen={'services'}
        />
      </VStack>

      <VStack px={3} mt={3}>
        <ServiceCardTypes
          icon="save"
          title={'Histórico de agendamentos'}
          text={'Acompanhe seus orçamentos realizados'}
          image={TimeImage}
          alt="Acompanhe seus orçamentos realizados"
          onPress={() => navigation.navigate('schedulesList')}
        />
        <ServiceCardTypes
          icon="save"
          title={'Histórico de orçamentos'}
          text={'Acompanhe seus orçamentos realizados'}
          image={TimeImage}
          alt="Acompanhe seus orçamentos realizados"
          onPress={() => navigation.navigate('quotesList')}
        />

        <ServiceCardTypes
          icon="save"
          title={'Histórico de orçamentos judiciais'}
          text={'Acompanhe seus orçamentos judiciais realizados'}
          image={TimeImage}
          alt="Acompanhe seus orçamentos realizados"
          onPress={() => navigation.navigate('legalQuotesList')}
        />
      </VStack>
    </SafeAreaView>
  );
}
