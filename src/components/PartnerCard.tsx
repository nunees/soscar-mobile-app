import {
  Image,
  VStack,
  HStack,
  Heading,
  Text,
  IImageProps,
  IIconProps,
} from 'native-base';
import { ImageSourcePropType, TouchableOpacity } from 'react-native';

type Props = IImageProps &
  IIconProps & {
    image: ImageSourcePropType;
    alt: string;
    name: string;
    last_name: string;
    address: string;
    distance: number;
  };

export function PartnerCard({
  image,
  alt,
  name,
  last_name,
  address,
  distance,

  ...rest
}: Props) {
  return (
    <VStack w={400} alignSelf="center">
      <TouchableOpacity {...rest}>
        <HStack>
          <Image
            source={image}
            h={20}
            w={20}
            rounded={'full'}
            borderWidth={1}
            alt={alt}
            mt={1}
          />
          <VStack ml={2} mb={3}>
            <Heading textTransform="uppercase">{`${name} ${last_name}`}</Heading>
            <VStack>
              <Text>{address}</Text>
              <Text>{distance || 0} km de voce</Text>
            </VStack>
          </VStack>
        </HStack>
      </TouchableOpacity>
    </VStack>
  );
}
