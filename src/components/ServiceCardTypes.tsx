import {
  Text,
  VStack,
  Pressable,
  HStack,
  IPressableProps,
  IImageProps,
  Image,
} from 'native-base';
import { ImageSourcePropType } from 'react-native';

type Props = IPressableProps &
  IImageProps & {
    title: string;
    icon?: string;
    text: string;
    image: ImageSourcePropType;
    alt: string;
  };

export function ServiceCardTypes({ title, image, text, alt, ...rest }: Props) {
  return (
    <VStack width={390} backgroundColor="white" mb={3} borderRadius={10}>
      <Pressable {...rest}>
        <HStack w={'full'} p={5}>
          <Image source={image} alt={alt} w={20} h={20} {...rest} />
          <HStack flexDirection={'column'} pl={3}>
            <Text bold>{title}</Text>
            <Text width={250} color="gray.400">
              {text}
            </Text>
          </HStack>
        </HStack>
      </Pressable>
    </VStack>
  );
}
