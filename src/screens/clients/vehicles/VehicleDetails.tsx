import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { ScrollView, VStack, Text, useToast, HStack } from 'native-base';
import { useCallback, useEffect, useState } from 'react';

type RouteParamsProps = {
  vehicleId: string;
};

export function VehicleDetails() {
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [plate, setPlate] = useState<string>('');
  const [engineMiles, setEngineMiles] = useState('');
  const [totalSpent] = useState(0);

  const route = useRoute();
  const toast = useToast();

  const { user } = useAuth();
  const { vehicleId } = route.params as RouteParamsProps;

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const fetchVehicleDetails = useCallback(async () => {
    try {
      const response = await api.get(`/vehicles/${vehicleId}`, {
        headers: {
          id: user.id,
        },
      });
      setBrand(response.data.brand.name);
      setModel(response.data.name.name);
      setColor(response.data.color);

      setYear(response.data.year);
      setPlate(response.data.plate);
      setEngineMiles(response.data.engineMiles);
    } catch {
      toast.show({
        title: 'Erro ao buscar detalhes do veículo',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }, []);

  useEffect(() => {
    fetchVehicleDetails();
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader
          title="Detalhes do Veículo"
          navigation={navigation}
          screen="vehicles"
        />
      </VStack>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <VStack px={5} py={5}>
          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <HStack>
              <VStack>
                <Text bold pb={2}>
                  Montadora
                </Text>
                <Text>{brand}</Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Modelo
            </Text>
            <Text>{model}</Text>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Cor
            </Text>
            <Text>{color}</Text>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Ano de Fabricação
            </Text>
            <Text>{year}</Text>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Placa
            </Text>
            <Text>{plate}</Text>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Kilometragem
            </Text>
            <Text>{engineMiles}</Text>
          </VStack>

          <VStack mb={5} backgroundColor="white" p={5} borderRadius={10}>
            <Text bold pb={2}>
              Total Gasto (R$)
            </Text>
            <Text>{totalSpent}</Text>
          </VStack>
        </VStack>

        <VStack px={5} py={5}>
          <Button title="Alterar dados" />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
