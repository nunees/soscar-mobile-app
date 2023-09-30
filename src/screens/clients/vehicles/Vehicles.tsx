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

async function fetchUserVehicles(user_id: string) {
  const response = await api.get('/vehicles/', {
    headers: {
      id: user_id,
    },
  });
  return response;
}

export function Vechicles() {
  const [vehicles, setVehicles] = useState<IVehicleDTO[]>([]);

  const { user } = useAuth();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  useFocusEffect(
    useCallback(() => {
      fetchUserVehicles(user.id).then((response) => setVehicles(response.data));

      return () => {
        setVehicles([]);
      };
    }, [fetchUserVehicles])
  );

  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader title="Meus Veículos" />
      </VStack>

      {/* Content */}
      <VStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        >
          <VStack px={5} py={5}>
            {vehicles.length > 0 ? (
              <VStack>
                {vehicles.map((vehicle) => (
                  <VStack
                    key={vehicle.id}
                    backgroundColor="white"
                    borderRadius={10}
                    mb={3}
                    shadow={1}
                  >
                    <QuickVehicleCard vehicle={vehicle} key={vehicle.id} />
                  </VStack>
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
        </ScrollView>
      </VStack>
      <Fab
        position="absolute"
        placement="bottom-right"
        renderInPortal={false}
        size="md"
        colorScheme="purple"
        onPress={() => navigation.navigate('addVehicle')}
        icon={<Icon as={Feather} name="plus" size={8} color="white" />}
      />
    </VStack>
  );
}
