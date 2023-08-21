import { AppHeader } from "@components/AppHeader";
import { Button } from "@components/Button";
import { QuickVehicleCard } from "@components/QuickVehicleCard";
import { VehicleDTO } from "@dtos/VechicleDTO";
import { useAuth } from "@hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { View, Text, ScrollView, VStack, Heading, Center } from "native-base";
import { useEffect, useState } from "react";

export function Vechicles() {
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);

  const { user } = useAuth();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  async function fetchUserVehicles() {
    try {
      const response = await api.get("/vehicles/", {
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

  useEffect(() => {
    fetchUserVehicles();
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader title="Meus Veículos" />
      </VStack>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VStack flex={1}>
          <VStack py={10} px={19}>
            <Heading textAlign={"center"}>Meus Veículos</Heading>
            <VStack>
              {vehicles.map((vehicle) => (
                <QuickVehicleCard
                  id={vehicle.id}
                  brand={vehicle.brand.name}
                  model={vehicle.name.name}
                  year={vehicle.year}
                  key={vehicle.id}
                />
              ))}
            </VStack>

            <VStack>
              <Center>
                <Button
                  title="Adicionar veículo"
                  onPress={() => navigation.navigate("addVehicle")}
                />
              </Center>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
