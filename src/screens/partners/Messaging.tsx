import { AppHeader } from '@components/AppHeader';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { VStack, Text, HStack, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native';

export function Messaging() {
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  async function loadMessages() {
    // const response = await api.get('/schedules', {
    //   params: {
    //     partner_id: user.id,
    //   },
    // });
    // setSchedules(response.data);
  }

  return (
    <VStack>
      <VStack mt={10} px={5} w="full">
        <HStack justifyContent={'flex-start'}>
          <TouchableOpacity onPress={() => navigation.navigate('home')}>
            <Icon as={Feather} name={'arrow-left'} size={8} color="gray.100" />
          </TouchableOpacity>

          <Text bold ml={5} mt={1} textAlign="center" fontSize="md">
            Mensagens
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
}
