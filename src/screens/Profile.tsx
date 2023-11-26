import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import UserPhoto from '@components/UserPhoto';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import {
  Text,
  VStack,
  Center,
  Icon,
  Pressable,
  Heading,
  HStack,
  ScrollView,
} from 'native-base';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PHOTO_SIZE = 33;

export function Profile() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      >
        <VStack>
          <AppHeader title="Meu Perfil" navigation={navigation} screen="home" />
        </VStack>

        <VStack px={10} py={5}>
          <Center>
            <UserPhoto
              source={{
                uri: user.avatar
                  ? `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`
                  : `https://ui-avatars.com/api/?format=png&name=${user.name}+${profile.last_name}&size=512`,
              }}
              alt="Foto de perfil"
              size={PHOTO_SIZE}
              borderWidth={5}
              borderColor={'purple.700'}
            />
            <Heading color="gray.600">{user.name}</Heading>
            <Text pb={1} color="gray.300">
              @{user.username}
            </Text>

            <Button onPress={signOut} title="Sair" w={100} />
          </Center>

          <VStack px={5}>
            <Pressable
              p={3}
              mt={2}
              onPress={() => navigation.navigate('myaccountInformation')}
            >
              <HStack p={2}>
                <VStack>
                  <Icon
                    as={FontAwesome5}
                    name="user-alt"
                    size="md"
                    color="purple.500"
                  />
                </VStack>
                <VStack ml={5}>
                  <Text fontSize="md" color="gray.600">
                    Minha conta
                  </Text>
                </VStack>
              </HStack>
            </Pressable>

            <Pressable
              p={3}
              onPress={() => navigation.navigate('editProfileInformation')}
            >
              <HStack p={2}>
                <VStack>
                  <Icon
                    as={FontAwesome5}
                    name="pen"
                    size="md"
                    color="purple.500"
                  />
                </VStack>
                <VStack ml={5}>
                  <Text fontSize="md" color="gray.600">
                    Editar meus dados
                  </Text>
                </VStack>
              </HStack>
            </Pressable>

            <Pressable
              borderBottomColor="gray.600"
              p={3}
              onPress={() => navigation.navigate('changePassword')}
            >
              <HStack p={2}>
                <VStack>
                  <Icon
                    as={FontAwesome5}
                    name="key"
                    size="md"
                    color="purple.500"
                  />
                </VStack>
                <VStack ml={5}>
                  <Text fontSize="md" color="gray.600">
                    Alterar senha
                  </Text>
                </VStack>
              </HStack>
            </Pressable>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
