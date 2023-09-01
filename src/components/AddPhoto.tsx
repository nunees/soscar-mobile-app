import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { HStack, useToast, Image, VStack, Modal } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

export function AddPhoto() {
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [setIsPhotoLoading] = useState(false);

  const toast = useToast();

  const { user } = useAuth();

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

        setPhotos([...photos, photoSelected.assets[0]]);

        // const avatarResponse = await api.patch(
        //   '/user/avatar',
        //   userPhotoUploadForm,
        //   {
        //     headers: {
        //       id: user.id,
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   }
        // );

        // const userUpdated = user;
        // userUpdated.avatar = avatarResponse.data.avatar;
        // updateUserAuth(userUpdated);

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

  return (
    <VStack maxW={400} flexWrap="wrap">
      {photos.map((photo) => (
        <HStack>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <HStack mb={5}>
              <Image
                w={'full'}
                height={200}
                source={photo}
                alt="Some thing in the way"
                resizeMode="cover"
              />
            </HStack>
          </TouchableOpacity>

          <HStack>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content>
                <Modal.Body>
                  <Image source={photo} alt="Photo" resizeMode="contain" />
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </HStack>
        </HStack>
      ))}

      <Button
        title="Carregar foto"
        variant="outline"
        onPress={handleUserProfilePictureSelect}
      />
    </VStack>
  );
}
