import { Icon, VStack, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";

export function SmallSchedulleCard() {
  return (
    <TouchableOpacity>
      <VStack
        w={346}
        h={76}
        rounded={5}
        py={5}
        px={3}
        mb={2}
        bg={"gray.700"}
        flexDir={"row"}
        justifyContent={"space-between"}
        alignContent={"baseline"}
      >
        <Icon as={Feather} name="calendar" size={10} color={"gray.400"} />
        <VStack mr={10}>
          <Text bold>13/05/2023</Text>
          <Text>13:15</Text>
        </VStack>

        <VStack ml={10}>
          <Text bold>Auto car</Text>
          <Text>Renato</Text>
        </VStack>

        <Icon as={Entypo} name="location-pin" size={10} color={"gray.400"} />
      </VStack>
    </TouchableOpacity>
  );
}
