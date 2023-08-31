import { ReminderBell } from '@components/ReminderBell';
import { UserLocation } from '@components/UserLocation';
import { UserPhoto } from '@components/UserPhoto';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import {
  Text,
  ScrollView,
  VStack,
  HStack,
  Icon,
  Heading,
  Box,
} from 'native-base';
import { TouchableOpacity } from 'react-native';

export function HomeScreen() {
  const { signOut } = useAuth();

  const { user } = useAuth();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  function greeting() {
    const hours = new Date().getHours();
    if (hours >= 0 && hours < 12) {
      return 'Bom dia';
    }
    if (hours >= 12 && hours < 18) {
      return 'Boa tarde';
    }
    return 'Boa noite';
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack py={10} px={19}>
        <HStack mb={5} justifyContent={'center'}>
          <Icon as={Feather} name="map-pin" size={5} color={'gray.400'} />
          <UserLocation />
        </HStack>

        <HStack justifyContent={'space-between'}>
          <HStack justifyItems={'baseline'}>
            <TouchableOpacity onPress={() => navigation.navigate('home')}>
              <UserPhoto
                source={{
                  uri: `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`,
                }}
                alt="Foto de perfil"
                size={10}
              />
            </TouchableOpacity>
            <Box ml={2} pb={10}>
              <Heading color="gray.200" fontSize="lg">
                {`${greeting()},`}
              </Heading>
              <Text>{`${user.name}`}</Text>
            </Box>
          </HStack>
          <HStack mt={3}>
            <ReminderBell />
          </HStack>
        </HStack>

        <VStack>
          <Heading>Resumo</Heading>
          <Text>Agendamentos em aberto: </Text>
          <Text>Agendamentos em andamento: </Text>
          <Text>Agendamentos finalizados: </Text>
        </VStack>

        <VStack mt={10}>
          <Heading>Agendamentos</Heading>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
