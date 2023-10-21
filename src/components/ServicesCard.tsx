import {
  VStack,
  IIconProps,
  Image,
  IImageProps,
  Text,
  HStack,
} from 'native-base';
import { ImageSourcePropType, TouchableOpacity } from 'react-native';

type Props = IIconProps &
  IImageProps & {
    image: ImageSourcePropType;
    alt: string;
    title: string;
  };

export function ServicesCard({ image, alt, title, ...rest }: Props) {
  return (
    <HStack
      mr={2}
      w={150}
      h={150}
      alignItems={'center'}
      justifyContent={'center'}
      borderRadius={5}
      backgroundColor="white"
    >
      <VStack shadow={1} justifyItems="center">
        <TouchableOpacity {...rest}>
          <VStack bg={'transparent'}>
            <Image source={image} alt={alt} w={60} h={60} {...rest} />
          </VStack>
        </TouchableOpacity>
        <Text mt={2} textAlign={'center'} bold>
          {title}
        </Text>
      </VStack>
    </HStack>
  );
}
