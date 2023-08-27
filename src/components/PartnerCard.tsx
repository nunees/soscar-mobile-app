import { Feather } from '@expo/vector-icons';
import {
  Image,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  IImageProps,
  IIconProps,
} from 'native-base';
import { ImageSourcePropType, Pressable } from 'react-native';

type Props = IImageProps &
  IIconProps & {
    image: ImageSourcePropType;
    alt: string;
    name: string;
    last_name: string;
    address: string;
    distance: string;
    specialty: string[];
    reviews: number;
  };

export function PartnerCard({
  image,
  alt,
  name,
  last_name,
  address,
  distance,
  specialty,
  reviews,
  ...rest
}: Props) {
  return (
    <VStack px={10} w={400} borderWidth={1} rounded={10} alignSelf="center">
      <Pressable {...rest}>
        <HStack pt={5}>
          <Image
            source={image}
            h={10}
            w={10}
            rounded={'full'}
            borderWidth={1}
            alt={alt}
            mt={1}
          />
          <VStack ml={2} mb={3}>
            <Heading>{`${name} ${last_name}`}</Heading>
            <Text>{reviews} Avaliações</Text>
          </VStack>
          <VStack position="relative" left={160}>
            <Icon as={Feather} name="heart" size={5} />
          </VStack>
        </HStack>

        <HStack mb={3}>
          <Icon as={Feather} name="map-pin" size={5} ml={3} />
          <VStack ml={4}>
            <Text>{address}</Text>
            <Text>{distance}km de voce</Text>
          </VStack>
        </HStack>

        <HStack mb={3}>
          <Icon as={Feather} name="tool" size={5} ml={3} />
          <VStack ml={4}>
            <Text>Especialista em {specialty}</Text>
          </VStack>
        </HStack>
      </Pressable>
    </VStack>
  );
}
