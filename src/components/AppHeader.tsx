import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Icon, VStack, IIconProps, HStack, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';

type Props = IIconProps & {
  title: string;
  icon?: string;
};

export function AppHeader({ title, icon }: Props) {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack mt={10} px={5} w="full">
      <HStack justifyContent={'flex-start'}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            as={Feather}
            name={icon || 'arrow-left'}
            size={8}
            color="gray.100"
          />
        </TouchableOpacity>

        <Text bold ml={5} mt={1} textAlign="center" fontSize="md">
          {title}
        </Text>
      </HStack>
    </VStack>
  );
}
