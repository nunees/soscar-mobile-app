import { AppHeader } from "@components/AppHeader";
import { UserPhoto } from "@components/UserPhoto";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import {
  View,
  Text,
  ScrollView,
  VStack,
  Center,
  Skeleton,
  Icon,
  Box,
  Pressable,
  HStack,
  Heading,
  useToast,
  Modal,
  Spinner,
} from "native-base";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Input } from "@components/Input";
import { LineDivider } from "@components/LineDivider";
import { Button } from "@components/Button";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { FileInfo } from "expo-file-system";
import { Controller, FormState, set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import ProfilePicture from "@assets/profile.png";
import { AppError } from "@utils/AppError";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LoadingModal } from "@components/LoadingModal";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  lastName: string;
  phone: string;
  username: string;
};

const profileSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  lastName: yup.string().required("Sobrenome é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  username: yup.string().required("Nome de usuário é obrigatório"),
});

export function Profile() {
  const { user, signOut, updateUserProfile } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const [date, setDate] = useState("");
  const [serverDate, setServerDate] = useState<Date | null>(null);

  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");

  const [birth_date, setBirthDate] = useState("");

  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      lastName,
      phone: phone,
      username: user.username,
    },
    resolver: yupResolver(profileSchema),
  });

  function handleDate(date: Date) {
    setServerDate(date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    setDate(`${day}/${month}/${year}`);
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
        )) as FileInfo;

        if (photoInfo?.size && photoInfo.size / 1021 / 1024 > 5) {
          toast.show({
            title: "A imagem deve ter no máximo 5MB",
            placement: "top",
            bgColor: "red.500",
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split(".").pop();

        const photoFile = {
          name: `${user.username}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);

        const avatarResponse = await api.patch(
          "/user/avatar",
          userPhotoUploadForm,
          {
            headers: {
              id: user.id,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const userUpdated = user;
        userUpdated.avatar = avatarResponse.data.avatar;
        updateUserProfile(userUpdated);

        toast.show({
          title: "Foto atualizada",
          placement: "top-right",
          bgColor: "green.500",
        });
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro na atualização";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsPhotoLoading(false);
    }
  }

  async function fetchProfile() {
    setShowModal(true);
    try {
      const response = await api.get("/user/profile", {
        headers: {
          id: user.id,
        },
      });

      const { last_name, cpf, mobile_phone, email, birth_date } = response.data;

      setLastName(last_name);
      setCpf(cpf);
      setPhone(mobile_phone);
      setEmail(email);
      setBirthDate(
        new Date(birth_date.split("T")[0]).toLocaleDateString("pt-BR")
      );
    } catch (error) {
      setShowModal(false);
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError ? error.message : "Erro ao obter dados",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setShowModal(false);
    }
  }

  async function handleSubmitProfile(data: FormDataProps) {
    try {
      setShowModal(true);
      const userUpdated = user;
      userUpdated.name = data.name;
      userUpdated.username = data.username;

      await api.patch(
        "/user",
        {
          name: data.name,
          last_name: data.lastName,
          username: data.username,
          mobile_phone: data.phone,
          birth_date: serverDate,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );

      await updateUserProfile(userUpdated);
      toast.show({
        title: "Perfil atualizado",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      setShowModal(false);
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError ? error.message : "Erro ao obter dados",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setShowModal(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  return (
    <VStack>
      <VStack>
        <AppHeader title="Meu Perfil" />
      </VStack>

      <VStack px={10} py={10}>
        {showModal && (
          <LoadingModal showModal={showModal} setShowModal={setShowModal} />
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
                rounded={"full"}
                startColor={"orange.400"}
                endColor={"orange.900"}
              />
            ) : (
              <UserPhoto
                source={{
                  uri: `${api.defaults.baseURL}/user/avatar/${user.id}`,
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
              _pressed={{ backgroundColor: "orange.600" }}
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
                  placeholder={lastName}
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
              placeholder={cpf}
              editable={false}
              caretHidden={true}
              backgroundColor="gray.700"
              borderBottomColor={"gray.700"}
            />

            <Text bold fontSize="xs">
              Tel. Celular
            </Text>

            <Controller
              control={control}
              name="phone"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder={phone}
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
              placeholder={email}
              editable={false}
              caretHidden={true}
              backgroundColor="gray.700"
              borderBottomColor={"gray.700"}
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
              placeholder={birth_date}
              editable={false}
              value={date}
              caretHidden
              onPressIn={() => {
                DateTimePickerAndroid.open({
                  mode: "date",
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
              onPress={() => navigation.navigate("changePassword")}
            />
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
