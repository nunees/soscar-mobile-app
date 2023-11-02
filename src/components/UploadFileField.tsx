/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { VStack, HStack, Text, Image, FlatList } from 'native-base';
import { TouchableOpacity } from 'react-native';

import { Button } from './Button';

type Props = {
  text?: string;
  upload: {
    data: FormData[] | FormData | null;
    files: any[];
    isLoading: boolean;
    isSucess: boolean;
    isError: boolean;
    error: string;
    progress: number;
  };
  GetUploadImage: () => void;
};

export function UploadFileField({ text, upload, GetUploadImage }: Props) {
  return (
    <VStack p={5} mb={5} backgroundColor="white" borderRadius={10}>
      {text && (
        <HStack mb={5}>
          <Text fontSize="sm" color="gray.900">
            {text}
          </Text>
        </HStack>
      )}
      <VStack>
        <FlatList
          horizontal
          data={upload.files}
          pagingEnabled
          indicatorStyle="white"
          snapToAlignment="start"
          decelerationRate={'fast'}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Image
                w={350}
                height={200}
                source={item}
                alt="User image"
                key={item.id}
              />
            </TouchableOpacity>
          )}
        />

        <Button
          title="Carregar foto"
          variant="light"
          fontSize={'sm'}
          fontWeight={'normal'}
          onPress={GetUploadImage}
          mt={5}
          isLoading={upload.isLoading}
          isLoadingText={`Carregando ${upload.progress}%`}
        />
      </VStack>
    </VStack>
  );
}
