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
    <VStack>
      <Pressable {...rest}>
        <HStack w={'full'} p={5}>
          <Image source={image} alt={alt} w={20} h={20} {...rest} />
          <HStack flexDirection={'column'} pl={5}>
            <Text bold>{title}</Text>
            <Text width={300}>{text}</Text>
          </HStack>
        </HStack>
      </Pressable>
    </VStack>
  );
}
