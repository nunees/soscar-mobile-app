import { Heading, VStack, Text, Box, Center } from "native-base";
import { TouchableOpacity } from "react-native";
import { Button } from "./Button";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

type QuickVehicleCardProps = {
  id: string;
  brand: string;
  model: string;
  year: number;
};

export function QuickVehicleCard({
  brand,
  model,
  year,
  id,
}: QuickVehicleCardProps) {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack px={19} mb={5}>
      <VStack borderWidth={1} borderColor={"gray.600"} rounded={5} h={150}>
        <Box px={4} py={2}>
          <Text bold fontSize={"lg"}>
            {brand}
          </Text>
          <Text fontSize={"md"}>{model}</Text>
          <Text fontSize={"xs"}>{year}</Text>
        </Box>
        <Center>
          <Button
            variant={"outline"}
            title={"Mais detalhes"}
            w={308}
            h={10}
            onPress={() =>
              navigation.navigate("vehicleDetails", {
                vehicleId: id,
              })
            }
          />
        </Center>
      </VStack>
    </VStack>
  );
}
