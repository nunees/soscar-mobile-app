import ArchiveImage from '@assets/services/archive.png';
import AvailableImage from '@assets/services/available.png';
import { AppHeader } from '@components/AppHeader';
import { ListServices } from '@components/ListServices';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

type RouteProps = {
  serviceId: number;
};

export function AssistanceContactType() {
  const route = useRoute();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { serviceId } = route.params as RouteProps;

  return (
    <SafeAreaView>
      <VStack>
        <AppHeader
          title="Tipo de contato"
          screen={'assistanceList'}
          navigation={navigation}
        />
      </VStack>

      <VStack px={3} mt={3}>
        <ListServices
          alt={'Pesquisar on-line'}
          title={'Pesquisar on-line'}
          content={'Veja quais profissionais estao on-line e suas localizacoes'}
          image={AvailableImage}
          onPress={() => navigation.navigate('assistanceSearch', { serviceId })}
        />

        <ListServices
          alt={'Pesquisa off-line'}
          title={'Pesquisar off-line'}
          content={
            'Veja a lista de profissionais que estao indisponiveis no momento, mas que podem ser contactados por telefone'
          }
          image={ArchiveImage}
          onPress={() =>
            navigation.navigate('assistanceArchive', { serviceId })
          }
        />
      </VStack>
    </SafeAreaView>
  );
}
