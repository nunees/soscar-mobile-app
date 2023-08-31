import { AppHeader } from '@components/AppHeader';
import { PartnerCard } from '@components/PartnerCard';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack, Text } from 'native-base';

export function SearchQuote() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader title="Parceiros disponiveis" />
      </VStack>

      <VStack alignSelf={'center'} mb={5}>
        <Text>Mostrando parceiros próximos a você</Text>
      </VStack>

      <PartnerCard
        onPress={() =>
          navigation.navigate('partnerDetails', {
            partnerId: '111',
            typeofService: 'quote',
          })
        }
        alt={''}
        name={''}
        image={0}
        last_name={''}
        address={''}
        distance={''}
        specialty={[]}
        reviews={0}
      />
    </VStack>
  );
}
