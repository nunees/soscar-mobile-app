/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import { useIdGenerator } from './useIdGenerator';

type FormType = {
  data: FormData[] | FormData | null;
  isLoading: boolean;
  isSucess: boolean;
  isError: boolean;
  error: string;
  progress: number;
  files: any[];
};

export function useUploadFormData(field: string) {
  const [upload, setUpload] = useState<FormType>({
    data: null,
    isLoading: false,
    isSucess: false,
    isError: false,
    error: '',
    progress: 0,
    files: [],
  });

  const form = new FormData();
  const { generateId } = useIdGenerator();

  async function GetUploadImage() {
    try {
      setUpload((prevState) => ({
        ...prevState,
        isLoading: true,
        progress: 15,
      }));

      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      setUpload((prevState) => ({
        ...prevState,
        progress: 50,
      }));
      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )) as IFileInfo;

        if (photoInfo?.size && photoInfo.size / 1021 / 1024 > 5) {
          setUpload((prevState) => ({
            ...prevState,
            isError: true,
            isLoading: false,
            isSucess: false,
            error: 'A imagem deve ter no máximo 5MB',
          }));
        }

        setUpload((prevState) => ({
          ...prevState,
          progress: 75,
        }));
        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${generateId(128)}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        form.append(field, photoFile);

        setUpload((prevState) => ({
          ...prevState,
          data: [form],
          progress: 0,
          isSucess: true,
          isLoading: false,
          isError: false,
          files: [...prevState.files, photoFile],
        }));
      }
    } catch (error) {
      setUpload((prevState) => ({
        ...prevState,
        isError: true,
        error: 'Erro ao carregar a imagem',
      }));
    }
  }

  return { upload, GetUploadImage };
}
