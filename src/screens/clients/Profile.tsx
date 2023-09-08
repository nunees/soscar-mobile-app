import ProfilePicture from '@assets/profile.png';
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LineDivider } from '@components/LineDivider';
import { LoadingModal } from '@components/LoadingModal';
import { UserPhoto } from '@components/UserPhoto';
import { Entypo } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  Text,
  ScrollView,
  VStack,
  Center,
  Skeleton,
  Icon,
  Pressable,
  Heading,
  useToast,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  lastName: string;
  phone: string;
  username: string;
};

const profileSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  lastName: yup.string().required('Sobrenome é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  username: yup.string().required('Nome de usuário é obrigatório'),
});

export function Profile() {
  const { user, signOut, updateUserAuth } = useAuth();
  const { profile, updateProfile } = useProfile();

  const [showModal, setShowModal] = useState(false);

  const [date, setDate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState('');

  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

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
    resolver: yupResolver(profileSchema),
  });

  function handleDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    setTempDate(`${day}/${month}/${year}`);
    const newDate = new Date(year, month - 1, day);
    setDate(newDate);
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
        userUpdated.avatar = avatarResponse.data.avatar;
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
          birth_date: date,
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
      user.avatar = response.data.avatar;
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
    if (!profile.last_name) {
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

  useEffect(() => {
    loadData();
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader title="Meu Perfil" />
      </VStack>

      <VStack px={10} py={10}>
        {showModal && (
          <LoadingModal
            showModal={showModal}
            setShowModal={setShowModal}
            message="Carregando dados..."
          />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <Center px={10}>
            {isPhotoLoading ? (
              <Skeleton
                w={PHOTO_SIZE}
                height={PHOTO_SIZE}
                rounded={'full'}
                startColor={'orange.400'}
                endColor={'orange.900'}
              />
            ) : (
              <UserPhoto
                defaultSource={ProfilePicture}
                source={{
                  uri: `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`,
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
              backgroundColor="orange.500"
              borderRadius="full"
              justifyContent="center"
              alignItems="center"
              shadow={3}
              onPress={handleUserProfilePictureSelect}
              _pressed={{ backgroundColor: 'orange.600' }}
            >
              <Icon as={Entypo} name="edit" size="lg" color="white" />
            </Pressable>
            <Heading>{user.name}</Heading>
            <Text>{user.username}</Text>
            <Pressable onPress={signOut} _pressed={{ opacity: 0.5 }}>
              <Text color="orange.500" bold>
                Sair
              </Text>
            </Pressable>
          </Center>

          <LineDivider />

          <VStack>
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
              value={profile.cpf}
              caretHidden={true}
              backgroundColor="gray.700"
              borderBottomColor={'gray.700'}
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
              caretHidden={true}
              backgroundColor="gray.700"
              borderBottomColor={'gray.700'}
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
              value={tempDate}
              caretHidden
              onPressIn={() => {
                DateTimePickerAndroid.open({
                  mode: 'date',
                  value: new Date(),
                  onChange: (event, date) => handleDate(date as Date),
                });
              }}
            />

            <Button
              isLoading={showModal}
              title="Atualizar informações"
              mt={10}
              onPress={handleSubmit(handleSubmitProfile)}
            />
            <Button
              isLoading={showModal}
              title="Alterar senha"
              mt={10}
              onPress={() => navigation.navigate('changePassword')}
            />
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
