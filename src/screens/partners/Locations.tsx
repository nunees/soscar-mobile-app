import { AppHeader } from '@components/AppHeader';
import { ILocation } from '@dtos/ILocation';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { ScrollView, VStack, Text, Fab, Icon } from 'native-base';
import { useEffect, useState } from 'react';

export function Locations() {
  const [locations, setLocations] = useState<ILocation[]>([]);

  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  async function loadData() {
    try {
      const response = await api.get('/locations');
      setLocations(response.data);
      console.log(locations);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader title="Meus Locais" />
      </VStack>

      <VStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <VStack flex={1}>
            <VStack py={10} px={19}>
              {locations.length > 0 ? (
                <Text>Existe locais</Text>
              ) : (
                <VStack mt={100} alignItems={'center'}>
                  <Text textAlign={'center'} color="gray.500">
                    Não há locais cadastrados.
                  </Text>
                </VStack>
              )}
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>

      <Fab
        position="absolute"
        placement="bottom-right"
        renderInPortal={false}
        size="md"
        colorScheme="orange"
        onPress={() => navigation.navigate('addLocation')}
        icon={<Icon as={Feather} name="plus" size={8} color="white" />}
      />
    </VStack>
  );
}
