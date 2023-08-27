import CarSVG from '@assets//car.svg';
import { AppHeader } from '@components/AppHeader';
import { QuickVehicleCard } from '@components/QuickVehicleCard';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { Text, ScrollView, VStack, Icon, Fab } from 'native-base';
import { useCallback, useState } from 'react';

export function Vechicles() {
  const [vehicles, setVehicles] = useState<IVehicleDTO[]>([]);

  const { user } = useAuth();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  async function fetchUserVehicles() {
    try {
      const response = await api.get('/vehicles/', {
        headers: {
          id: user.id,
        },
      });
      setVehicles(response.data);

      console.log(vehicles);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUserVehicles();
    }, [vehicles])
  );

  return (
    // Will Hold all the content
    <VStack flex={1}>
      {/* Header */}
      <VStack flex={1}>
        <VStack>
          <AppHeader title="Meus Veículos" />
        </VStack>

        {/* Content */}
        <VStack>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <VStack flex={1}>
              <VStack py={10} px={19}>
                {vehicles.length > 0 ? (
                  <VStack>
                    {vehicles.map((vehicle) => (
                      <QuickVehicleCard vehicle={vehicle} />
                    ))}
                  </VStack>
                ) : (
                  <VStack mt={100} alignItems={'center'}>
                    <Text textAlign={'center'} color="gray.500">
                      Não há veiculos cadastrados.
                    </Text>
                    <CarSVG width={300} opacity={0.5} />
                  </VStack>
                )}
              </VStack>
            </VStack>
          </ScrollView>
        </VStack>
      </VStack>

      <Fab
        position="absolute"
        placement="bottom-right"
        renderInPortal={false}
        size="md"
        colorScheme="orange"
        onPress={() => navigation.navigate('addVehicle')}
        icon={<Icon as={Feather} name="plus" size={8} color="white" />}
      />
    </VStack>
  );
}
