import { useAuth } from "@hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { View, Text } from "native-base";
import { TouchableOpacity } from "react-native";

export function HomeScreen() {
  const navigation = useNavigation();

  const { signOut } = useAuth();

  return (
    <View flex={1} mt={200}>
      <TouchableOpacity onPress={signOut}>
        <Text>HomeScreen</Text>
      </TouchableOpacity>
    </View>
  );
}
