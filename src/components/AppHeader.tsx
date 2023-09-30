import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { Icon, VStack, IIconProps, HStack, Text } from 'native-base';
import { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = IIconProps & {
  title: string;
  icon?: string;
};

export function AppHeader({ title, icon }: Props) {
  const { user } = useAuth();
  const userNavigation = useNavigation<AppNavigatorRoutesProps>();
  const partnerNavigation = useNavigation<PartnerNavigatorRoutesProps>();

  const handleGoBack = useCallback(() => {
    if (user.isPartner) {
      partnerNavigation.goBack();
    } else {
      userNavigation.goBack();
    }
  }, []);

  const handleGoHome = useCallback(() => {
    if (user.isPartner) {
      partnerNavigation.navigate('home');
    } else {
      userNavigation.navigate('home');
    }
  }, []);

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
          <TouchableOpacity onPress={handleGoHome}>
            <Icon as={FontAwesome5} name="home" size={5} color="white" />
          </TouchableOpacity>
        </VStack>
      </HStack>
    </VStack>
  );
}
