import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import UserPhoto from '@components/UserPhoto';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import {
  ScrollView,
  VStack,
  Text,
  Center,
  Switch,
  HStack,
  useToast,
  Modal,
} from 'native-base';
import { useCallback, useState } from 'react';

export default function MyAccountInformation() {
  const [showModal, setShowModal] = useState(false);
  const { user, updateUserAuth, signOut } = useAuth();
  const { profile } = useProfile();

  const toast = useToast();

  const navigation = user.isPartner
    ? useNavigation<PartnerNavigatorRoutesProps>()
    : useNavigation<AppNavigatorRoutesProps>();

  const handleChangeUserType = useCallback(async () => {
    user.isPartner = !user.isPartner;

    const response = await api.patch(
      `/user`,
      {
        isPartner: user.isPartner,
      },
      {
        headers: {
          id: user.id,
        },
      }
    );

    if (response.data.isPartner === user.isPartner) {
      toast.show({
        title: 'Tipo de usuario alterado com sucesso!',
        placement: 'bottom',
        bgColor: 'green.500',
      });

      updateUserAuth(user);

      setShowModal(true);
    }
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader
          title="Minha conta"
          navigation={navigation}
          screen={'profile'}
        />
      </VStack>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth={400}>
            <Modal.CloseButton />
            <Modal.Body>
              <Modal.Header>
                <Text fontSize={'xl'}>Atencao!</Text>
              </Modal.Header>
              <Text p={3}>
                Para que as alteracoes tenham efeito, e necessario que voce saia
                da aplicacao e faca login novamente.
              </Text>
              <Button
                title="Sair"
                onPress={() => {
                  signOut();
                  setShowModal(false);
                }}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}

      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <VStack px={5} py={3}>
          <Center>
            <UserPhoto
              source={{
                uri: user.avatar
                  ? `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`
                  : `https://ui-avatars.com/api/?format=png&name=${user.name}+${profile.last_name}&size=512`,
              }}
              alt="Foto de perfil"
              size={33}
            />
          </Center>
        </VStack>
        <VStack>
          <Center>
            <Text fontSize={'xl'}>Informacoes pessoais</Text>
          </Center>
        </VStack>

        <VStack px={5} py={3}>
          <VStack backgroundColor="white" borderRadius={10} px={3} py={3}>
            <VStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text bold>Tipo de usuario</Text>
                <Switch
                  defaultIsChecked={user.isPartner}
                  onChange={handleChangeUserType}
                  colorScheme="purple"
                ></Switch>
              </HStack>
            </VStack>
            <VStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text>{user.isPartner ? 'Parceiro' : 'Cliente'}</Text>
              </HStack>
            </VStack>
          </VStack>

          <VStack backgroundColor="white" p={3} borderRadius={10} mt={3}>
            <Text bold>Numero de indentificacao</Text>
            <Text color="gray.400">{user.id}</Text>
          </VStack>

          <VStack backgroundColor="white" p={3} borderRadius={10} mt={3}>
            <Text bold>Nome</Text>
            <Text color="gray.400">{user.name}</Text>
          </VStack>

          <VStack backgroundColor="white" p={3} borderRadius={10} mt={3}>
            <Text bold>Sobrenome</Text>
            <Text color="gray.400">{profile.last_name}</Text>
          </VStack>

          <VStack backgroundColor="white" p={3} borderRadius={10} mt={3}>
            <Text bold>CPF</Text>
            <Text color="gray.400">{profile.cpf}</Text>
          </VStack>

          <VStack backgroundColor="white" p={3} borderRadius={10} mt={3}>
            <Text bold>Telefone</Text>
            <Text color="gray.400">{profile.phone}</Text>
          </VStack>

          <VStack backgroundColor="white" p={3} borderRadius={10} mt={3}>
            <Text bold>E-mail</Text>
            <Text color="gray.400">{user.email}</Text>
          </VStack>

          <VStack backgroundColor="white" p={3} borderRadius={10} mt={3}>
            <Text bold>Usuario</Text>
            <Text color="gray.400">{user.username}</Text>
          </VStack>

          <VStack backgroundColor="white" p={3} borderRadius={10} mt={3}>
            <Text bold>Data de nascimento</Text>
            <Text color="gray.400">
              {profile?.birth_date
                ? profile.birth_date
                    .toString()
                    .split('T')[0]
                    .split('-')
                    .reverse()
                    .join('/') || 'Nao informado'
                : 'Nao informado'}
            </Text>
          </VStack>

          <VStack backgroundColor="white" p={3} borderRadius={10} mt={3}>
            <Text bold>Sexo</Text>
            <Text color="gray.400">
              {profile.genderId === 1 && 'Masculino'}
              {profile.genderId === 2 && 'Feminino'}
              {profile.genderId === 3 && 'Transgenero'}
              {profile.genderId === 4 && 'Nao-binario'}
              {profile.genderId === 5 && 'Outro'}
              {!profile.genderId && 'Nao informado'}
            </Text>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
