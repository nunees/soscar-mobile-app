import { useAuth } from '@hooks/useAuth';
import { View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';

export function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <View flex={1} mt={200}>
      <TouchableOpacity onPress={signOut}>
        <Text>HomeScreen</Text>
      </TouchableOpacity>
    </View>
  );
}
