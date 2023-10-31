import {
  VStack,
  Text,
  Image,
  IImageProps,
  HStack,
  IPressableProps,
  Pressable,
} from 'native-base';
import { ImageSourcePropType } from 'react-native';

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
        mb={2}
        backgroundColor="white"
        p={5}
        borderRadius={10}
        flexWrap={'nowrap'}
      >
        <Image source={image} alt={alt} size={20} {...rest} />
        <VStack pl={3} w={250}>
          <Text bold fontSize="md">
            {title}
          </Text>
          <Text
            fontSize="sm"
            fontFamily="body"
            textAlign="left"
            color="gray.400"
          >
            {content}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}
