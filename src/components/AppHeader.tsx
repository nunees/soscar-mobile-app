import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Icon, VStack, IIconProps, HStack, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';

type Props = IIconProps & {
  title: string;
  icon?: string;
  isPartner?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  screen: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: object;
};

export function AppHeader({
  title,
  icon,
  navigation,
  screen,
  payload,
  isPartner = false,
}: Props) {
  const handleGoBack = () => {
    if (payload) {
      navigation.navigate(screen, payload);
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <VStack px={5} w="full" h={50} backgroundColor="#340554" shadow={2}>
      <HStack pt={2} justifyContent="space-between" alignItems="center">
        <VStack>
          <TouchableOpacity onPress={handleGoBack}>
            <Icon
              as={Feather}
              name={icon || 'arrow-left'}
              size={8}
              color="gray.100"
            />
          </TouchableOpacity>
        </VStack>

        <VStack>
          <Text
            bold
            ml={5}
            mt={1}
            textAlign="center"
            fontSize="md"
            color="gray.100"
          >
            {title}
          </Text>
        </VStack>

        <VStack>
          <HStack>
            {isPartner && (
              <TouchableOpacity
                onPress={() => navigation.navigate('assistanceMap')}
                style={{
                  marginRight: 15,
                }}
              >
                <Icon
                  as={FontAwesome5}
                  name="hands-helping"
                  size={5}
                  color="white"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('home')}>
              <Icon as={FontAwesome5} name="home" size={5} color="white" />
            </TouchableOpacity>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
}
