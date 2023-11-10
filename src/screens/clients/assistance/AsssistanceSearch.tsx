import { AppHeader } from '@components/AppHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

type RouteParams = {
  serviceId: string;
};

export function AssistanceSearch() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParams;

  return (
    <SafeAreaView>
      <VStack>
        <AppHeader
          title="Profissionais Disponiveis"
          navigation={navigation}
          screen={'services'}
        />
      </VStack>
    </SafeAreaView>
  );
}
