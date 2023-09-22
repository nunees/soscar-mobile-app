import { AppHeader } from '@components/AppHeader';
import { Input } from '@components/Input';
import getLogoImage from '@components/LogosImages';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useAuth } from '@hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import { api } from '@services/api';
import { ScrollView, VStack, Text, useToast, Image, HStack } from 'native-base';
import { useEffect, useState } from 'react';

type RouteParamsProps = {
  vehicleId: string;
};

export function VehicleDetails() {
  const route = useRoute();
  const toast = useToast();

  const { user } = useAuth();

  const { vehicleId } = route.params as RouteParamsProps;

  const [vehicle, setVehicle] = useState<IVehicleDTO>({} as IVehicleDTO);

  async function fetchVehicleDetails() {
    try {
      const response = await api.get(`/vehicles/${vehicleId}`, {
        headers: {
          id: user.id,
        },
      });
      setVehicle(response.data as IVehicleDTO);
    } catch {
      toast.show({
        title: 'Erro ao buscar detalhes do veículo',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useEffect(() => {
    fetchVehicleDetails();
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader title="Detalhes do Veículo" />
      </VStack>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VStack px={5} py={5}>
          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <HStack>
              <VStack>
                <Text bold pb={2}>
                  Montadora
                </Text>
                <Text>{vehicle.brand?.name}</Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Modelo
            </Text>
            <Text>{vehicle.name?.name}</Text>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Cor
            </Text>
            <VStack>{vehicle.color}</VStack>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Ano de Fabricação
            </Text>
            <Text>{vehicle.year}</Text>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Placa
            </Text>
            <Text>{vehicle.plate}</Text>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Kilometragen
            </Text>
            <Text>{vehicle.engineMiles}</Text>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Total Gasto (R$)
            </Text>
            <Text>0</Text>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
