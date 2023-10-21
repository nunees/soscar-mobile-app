import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import UserPhoto from '@components/UserPhoto';
import { Entypo } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  Center,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

type FormDataProps = {
  name: string;
  lastName: string;
  phone: string;
  username: string;
};

const PHOTO_SIZE = 33;

const profileSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  lastName: yup.string().required('Sobrenome é obrigatório'),
  phone: yup.string().optional(),
  username: yup.string().required('Nome de usuário é obrigatório'),
});

export default function EditProfileInformation() {
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const { user, updateUserAuth } = useAuth();
  const { profile, updateProfile } = useProfile();

  const [tempDate] = useState('');
  const [showModal, setShowModal] = useState(false);

  const toast = useToast();
  const navigation = user.isPartner
    ? useNavigation<PartnerNavigatorRoutesProps>()
    : useNavigation<AppNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: profile.name,
      lastName: profile.last_name,
      phone: profile.phone,
      username: user.username,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: yupResolver(profileSchema),
  });

  async function handleSubmitProfile(data: FormDataProps) {
    try {
      setShowModal(true);
      const response = await api.patch(
        '/user',
        {
          name: data.name,
          last_name: data.lastName,
          username: data.username,
          mobile_phone: data.phone,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );

      const userUpdated = user;
      user.name = response.data.name;
      user.username = response.data.username;
      user.email = response.data.email;
      if (response.data.avatar) {
        user.avatar = response.data.avatar;
      }
      await updateUserAuth(userUpdated);

      await updateProfile({
        name: response.data.name,
        last_name: response.data.last_name,
        phone: response.data.mobile_phone,
        birth_date: response.data.birth_date,
        cpf: response.data.cpf,
        genderId: response.data.genderId,
      });

      toast.show({
        title: 'Perfil atualizado',
        placement: 'top',
        bgColor: 'green.500',
      });
    } catch (error) {
      setShowModal(false);
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError ? error.message : 'Erro ao obter dados',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setShowModal(false);
    }
  }

  async function loadData() {
    if (!profile.last_name || !profile.phone || !profile.birth_date) {
      const response = await api.get('/user/profile', {
        headers: {
          id: user.id,
        },
      });

      profile.name = response.data.name;
      profile.last_name = response.data.last_name;
      profile.phone = response.data.mobile_phone;
      profile.birth_date = response.data.birth_date;
      profile.cpf = response.data.cpf;
      await updateProfile(profile);
    }
  }

  async function handleUserProfilePictureSelect() {
    try {
      setIsPhotoLoading(true);
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )) as IFileInfo;

        if (photoInfo?.size && photoInfo.size / 1021 / 1024 > 5) {
          toast.show({
            title: 'A imagem deve ter no máximo 5MB',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${user.username}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('avatar', photoFile);

        const avatarResponse = await api.patch(
          '/user/avatar',
          userPhotoUploadForm,
          {
            headers: {
              id: user.id,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const userUpdated = user;
        if (avatarResponse.data.avatar) {
          userUpdated.avatar = avatarResponse.data.avatar;
        } else {
          userUpdated.avatar = '';
        }
        updateUserAuth(userUpdated);

        toast.show({
          title: 'Foto atualizada',
          placement: 'top',
          bgColor: 'green.500',
        });
        setIsPhotoLoading(false);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro na atualização';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsPhotoLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader
          title="Editar informacoes pessoais"
          navigation={navigation}
          screen="profile"
        />
      </VStack>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <VStack px={5} py={5}>
          <Center px={10}>
            {isPhotoLoading ? (
              <Skeleton
                w={PHOTO_SIZE}
                height={PHOTO_SIZE}
                rounded={'full'}
                startColor={'purple.400'}
                endColor={'purple.900'}
              />
            ) : (
              <UserPhoto
                source={{
                  uri: user.avatar
                    ? `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`
                    : `https://ui-avatars.com/api/?format=png&name=${user.name}+${profile.last_name}&size=512`,
                }}
                alt="Foto de perfil"
                size={PHOTO_SIZE}
              />
            )}

            <Pressable
              w={10}
              h={10}
              ml={20}
              mt={-10}
              backgroundColor="purple.500"
              borderRadius="full"
              justifyContent="center"
              alignItems="center"
              shadow={3}
              onPress={handleUserProfilePictureSelect}
              _pressed={{ backgroundColor: 'purple.600' }}
            >
              <Icon as={Entypo} name="edit" size="lg" color="white" />
            </Pressable>
            <Heading pb={1}>{user.name}</Heading>
            <Text pb={1}>{user.username}</Text>
          </Center>

          <VStack backgroundColor={'white'} p={5} borderRadius={10}>
            <Text bold fontSize="xs">
              Nome
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder={user.name}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Text bold fontSize="xs">
              Sobrenome
            </Text>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder={profile.last_name}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.lastName?.message}
                />
              )}
            />

            <Text bold fontSize="xs">
              CPF
            </Text>
            <Input
              placeholder={profile.cpf}
              editable={false}
              isDisabled={true}
              value={profile.cpf}
              caretHidden={true}
              helperText="Seu numero de CPF não pode ser alterado"
            />

            <Text bold fontSize="xs">
              Tel. Celular
            </Text>

            <Controller
              control={control}
              name="phone"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder={profile.phone}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.phone?.message}
                />
              )}
            />

            <Text bold fontSize="xs">
              Email
            </Text>
            <Input
              value={user.email}
              placeholder={user.email}
              editable={false}
              isDisabled={true}
              caretHidden={true}
              helperText="Seu email não pode ser alterado"
            />

            <Text bold fontSize="xs">
              Nome de usuário
            </Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder={user.username}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.username?.message}
                />
              )}
            />
            <Text bold fontSize="xs">
              Data de nascimento
            </Text>

            <Input
              placeholder={tempDate}
              editable={false}
              isDisabled={true}
              value={
                tempDate || profile?.birth_date
                  ? profile.birth_date
                      .toString()
                      .split('T')[0]
                      .split('-')
                      .reverse()
                      .join('/') || 'Nao informado'
                  : 'Nao informado'
              }
              caretHidden
            />
          </VStack>
          <Button
            mt={10}
            isLoading={showModal}
            title="Atualizar informações"
            onPress={handleSubmit(handleSubmitProfile)}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
