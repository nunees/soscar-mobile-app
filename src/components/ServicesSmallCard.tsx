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

export function ServicesSmallCard({ image, alt, title, ...rest }: Props) {
  return (
    <HStack
      mr={2}
      w={120}
      h={100}
      alignItems={'center'}
      justifyContent={'center'}
      borderWidth={1}
      borderRadius={10}
      borderColor={'gray.700'}
      backgroundColor="white"
    >
      <VStack shadow={1} justifyItems="center">
        <TouchableOpacity {...rest}>
          <VStack bg={'transparent'}>
            <Image source={image} alt={alt} w={50} h={50} {...rest} />
          </VStack>
        </TouchableOpacity>
        <Text mt={2} textAlign={'center'} bold>
          {title}
        </Text>
      </VStack>
    </HStack>
  );
}
