import { Icon, IIconProps } from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = IIconProps & {};

export function ReminderBell({ ...rest }: Props) {
  return (
    <TouchableOpacity>
      <Icon as={Feather} name="bell" size={6} color={"gray.400"} {...rest} />
    </TouchableOpacity>
  );
}
