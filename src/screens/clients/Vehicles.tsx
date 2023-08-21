import { AppHeader } from "@components/AppHeader";
import { Button } from "@components/Button";
import { QuickVehicleCard } from "@components/QuickVehicleCard";
import { VehicleDTO } from "@dtos/VechicleDTO";
import { useAuth } from "@hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  ScrollView,
  VStack,
  Heading,
  Center,
  HStack,
  Box,
  Icon,
  Fab,
} from "native-base";
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
                      <QuickVehicleCard
                        id={vehicle.id}
                        brand={vehicle.brand.name}
                        model={vehicle.name.name}
                        year={vehicle.year}
                        key={vehicle.id}
                      />
                    ))}
                  </VStack>
                ) : (
                  <Center>
                    <Text textAlign={"center"} py={200} color="gray.500">
                      Não há veiculos cadastrados
                    </Text>
                  </Center>
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
        onPress={() => navigation.navigate("addVehicle")}
        icon={<Icon as={Feather} name="plus" size={8} color="white" />}
      />
    </VStack>
  );
}
