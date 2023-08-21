import { Heading, Icon, VStack, IIconProps, HStack, Center } from "native-base";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

type Props = IIconProps & {
  title: string;
  icon?: string;
};

export function AppHeader({ title, icon }: Props) {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack mt={10} px={5}>
      <HStack justifyContent={"flex-start"}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            as={Feather}
            name={icon || "arrow-left"}
            size={8}
            color="gray.100"
          />
        </TouchableOpacity>

        <Heading fontSize={"lg"} mt={2} ml={5}>
          {title}
        </Heading>
      </HStack>
    </VStack>
  );
}
