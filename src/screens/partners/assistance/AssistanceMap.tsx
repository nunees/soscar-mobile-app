import { AppHeader } from '@components/AppHeader';
import { VStack } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AssistanceMap() {
  return (
    <SafeAreaView>
      <VStack>
        <AppHeader title={'Mapa'} navigation={undefined} screen={''} />
      </VStack>
    </SafeAreaView>
  );
}
