import {
  VStack,
  Icon,
  IIconProps,
  Image,
  IImageProps,
  Box,
  Text,
} from "native-base";
import { ImageSourcePropType, TouchableOpacity } from "react-native";

type Props = IIconProps &
  IImageProps & {
    image: ImageSourcePropType;
    alt: string;
    title: string;
  };

export function ServicesSmallCard({ image, alt, title, ...rest }: Props) {
  return (
    <Box mr={5} alignItems={"center"}>
      <TouchableOpacity {...rest}>
        <VStack w={70} h={70} bg={"transparent"} rounded={5}>
          <Image source={image} alt={alt} w={70} h={70} {...rest} />
        </VStack>
      </TouchableOpacity>
      <Text mt={2} textAlign={"center"}>
        {title}
      </Text>
    </Box>
  );
}
