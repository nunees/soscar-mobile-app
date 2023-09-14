import {
  VStack,
  Text,
  Image,
  IImageProps,
  Heading,
  HStack,
  IPressableProps,
} from 'native-base';
import { ImageSourcePropType, Pressable } from 'react-native';

type Props = IImageProps &
  IPressableProps & {
    title: string;
    content: string;
    image: ImageSourcePropType;
    alt: string;
  };

export function ListServices({ image, alt, title, content, ...rest }: Props) {
  return (
    <Pressable {...rest}>
      <HStack
        w={330}
        mb={10}
        pb={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
      >
        <Image source={image} alt={alt} w={20} h={20} {...rest} />
        <VStack px={5}>
          <Heading>{title}</Heading>
          <Text textAlign="justify">{content}</Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}
