import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { HStack, useToast, Image, VStack } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  fileType: 'image' | 'video' | 'all';
  remoteFieldName: string;
};

export function UploadFile({ fileType, remoteFieldName }: Props) {
  const [files, setfiles] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const toast = useToast();
  const { user } = useAuth();
  const userPhotoUploadForm = new FormData();

  async function handleUserProfilePictureSelect() {
    try {
      let media;

      if (fileType === 'image') {
        media = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          aspect: [4, 4],
          allowsEditing: true,
        });
      } else if (fileType === 'video') {
        media = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          quality: 1,
          aspect: [4, 4],
        });
      } else {
        media = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        });
      }

      if (media.canceled) {
        return;
      }

      if (media.assets[0].uri) {
        const mediaInfo = (await FileSystem.getInfoAsync(
          media.assets[0].uri
        )) as IFileInfo;

        if (mediaInfo?.size && mediaInfo.size / 1021 / 1024 > 5) {
          toast.show({
            title: 'O arquivo deve ter no máximo 5MB',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        const fileExtension = media.assets[0].uri.split('.').pop();
        if (
          fileExtension !== 'jpg' &&
          fileExtension !== 'jpeg' &&
          fileExtension !== 'png' &&
          fileExtension !== 'mp4'
        ) {
          toast.show({
            title: 'Formato de arquivo não suportado',
            placement: 'top',
            bgColor: 'red.500',
          });
          return;
        }

        const file = {
          name: `${user.username}.${fileExtension}`.toLowerCase(),
          uri: media.assets[0].uri,
          type: `${media.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        userPhotoUploadForm.append(remoteFieldName, file);

        setfiles([...files, media.assets[0]]);

        toast.show({
          title: 'Arquivo anexado',
          placement: 'top',
          bgColor: 'green.500',
        });
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro na atualização';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function handleSubmit(url: string) {
    await api.post(url, userPhotoUploadForm, {
      headers: {
        id: user.id,
        'Content-Type': 'multipart/form-data',
      },
    });

    userPhotoUploadForm.delete(remoteFieldName);
  }

  return (
    <VStack maxW={400} flexWrap="wrap">
      {files.map((item) => (
        <HStack>
          <TouchableOpacity>
            <HStack mb={5}>
              <Image
                w={'full'}
                height={200}
                source={item}
                alt="Some thing in the way"
                resizeMode="cover"
              />
            </HStack>
          </TouchableOpacity>
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
