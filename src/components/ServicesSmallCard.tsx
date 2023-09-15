import { VStack, IIconProps, Image, IImageProps, Box, Text } from 'native-base';
import { ImageSourcePropType, TouchableOpacity } from 'react-native';

type Props = IIconProps &
  IImageProps & {
    image: ImageSourcePropType;
    alt: string;
    title: string;
  };

export function ServicesSmallCard({ image, alt, title, ...rest }: Props) {
  return (
    <Box
      mr={2}
      w={100}
      h={100}
      alignItems={'center'}
      backgroundColor="white"
      borderRadius={5}
      p={3}
      shadow={1}
    >
      <TouchableOpacity {...rest}>
        <VStack bg={'transparent'}>
          <Image source={image} alt={alt} w={50} h={50} {...rest} />
        </VStack>
      </TouchableOpacity>
      <Text mt={2} textAlign={'center'} bold>
        {title}
      </Text>
    </Box>
  );
}
