import QRCodeImage from '@assets/qrcode.png';
import ArchiveImage from '@assets/services/archive.png';
import CalendarImage from '@assets/services/calendar.png';
import CompliantImage from '@assets/services/compliant.png';
import PaperImage from '@assets/services/paper.png';
import TowCarImage from '@assets/services/tow-car.png';
import { AppHeader } from '@components/AppHeader';
import { ServiceCardTypes } from '@components/ServiceCardTypes';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { ScrollView, VStack } from 'native-base';

export function Services() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack>
      <VStack>
        <AppHeader title="Serviços" navigation={navigation} screen="home" />
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        px={3}
        py={3}
      >
        <ServiceCardTypes
          icon="calendar"
          title={'Agendamentos'}
          text={'Agende seus serviços sem sair de casa'}
          onPress={() => navigation.navigate('schedules')}
          image={CalendarImage}
          alt="Agendar serviços"
        />
        <ServiceCardTypes
          icon="file-text"
          title={'Orçamentos'}
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
          onPress={() => navigation.navigate('legalQuotes')}
        />
        <ServiceCardTypes
          icon="briefcase"
          title={'Assistência'}
          text={'Encontre profissionais que prestam assistência'}
          image={TowCarImage}
          alt="Orçamento judiciais de serviços"
          onPress={() => navigation.navigate('assistanceList')}
        />

        <ServiceCardTypes
          icon="save"
          title={'Históricos'}
          text={'Veja todos os seus históricos'}
          image={ArchiveImage}
          alt="Acompanhe seus orçamentos realizados"
          onPress={() => navigation.navigate('archives')}
        />

        <ServiceCardTypes
          icon="compass"
          title={'Validar documento'}
          text={'Valide a autenticidade do documento de orçamento'}
          image={QRCodeImage}
          alt="Valide a autenticidade do documento de orçamento"
          onPress={() => navigation.navigate('validateDocument')}
        />

        {/* <ServiceCardTypes
          icon="compass"
          title={'Encontre um profissional'}
          text={'Encontre um profissional para realizar seu serviço'}
          image={FindImage}
          alt="Encontre um profissional para realizar seu serviço"
        /> */}
      </ScrollView>
    </VStack>
  );
}
