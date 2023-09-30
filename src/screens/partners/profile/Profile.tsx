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
} from 'native-base';

const PHOTO_SIZE = 33;

export function Profile() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack>
      <VStack>
        <AppHeader title="Meu Perfil" />
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
          <Heading>{user.name}</Heading>
          <Text pb={1} color="gray.400">
            @{user.username}
          </Text>
        </Center>

        <VStack px={10}>
          <Pressable
            p={3}
            mt={5}
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

          <Pressable borderBottomColor="gray.600" p={3}>
            <HStack p={2}>
              <VStack>
                <Icon
                  as={FontAwesome5}
                  name="cog"
                  size="md"
                  color="purple.500"
                />
              </VStack>
              <VStack ml={5}>
                <Text fontSize="md" color="gray.600">
                  Configuracoes do sistema
                </Text>
              </VStack>
            </HStack>
          </Pressable>

          <Pressable borderBottomColor="gray.600" p={3}>
            <HStack p={2}>
              <VStack>
                <Icon
                  as={FontAwesome5}
                  name="question-circle"
                  size="md"
                  color="purple.500"
                />
              </VStack>
              <VStack ml={5}>
                <Text fontSize="md" color="gray.600">
                  Ajuda
                </Text>
              </VStack>
            </HStack>
          </Pressable>

          <Pressable borderBottomColor="gray.600" p={3}>
            <HStack p={2}>
              <VStack>
                <Icon
                  as={FontAwesome5}
                  name="info-circle"
                  size="md"
                  color="purple.500"
                />
              </VStack>
              <VStack ml={5}>
                <Text fontSize="md" color="gray.600">
                  Politica de privacidade
                </Text>
              </VStack>
            </HStack>
          </Pressable>
        </VStack>

        <VStack py={5}>
          <Button fontSize="lg" title="Sair do aplicativo" onPress={signOut} />
        </VStack>
      </VStack>
    </VStack>
  );
}
