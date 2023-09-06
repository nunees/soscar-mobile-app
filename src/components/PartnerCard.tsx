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
  Divider,
} from 'native-base';
import { ImageSourcePropType, TouchableOpacity } from 'react-native';

type Props = IImageProps &
  IIconProps & {
    image: ImageSourcePropType;
    alt: string;
    name: string;
    last_name: string;
    address: string;
    distance: string;
    specialty: number[];
    reviews: number;
  };

const servicesCategories = [
  { id: 1, name: 'Acessorios' },
  { id: 2, name: 'Cambio' },
  { id: 3, name: 'Eletrica' },
  { id: 4, name: 'Fluidos' },
  { id: 5, name: 'Funilaria e Pintura' },
  { id: 6, name: 'Lavagem' },
  { id: 7, name: 'Mecanica' },
  { id: 8, name: 'Pneus' },
  { id: 9, name: 'Suspensão' },
  { id: 10, name: 'Vidros' },
  { id: 11, name: 'Outros' },
];

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
    <VStack px={10} w={400} alignSelf="center">
      <TouchableOpacity {...rest}>
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
          <Icon
            as={Feather}
            name="map-pin"
            size={5}
            ml={3}
            color="orange.600"
          />
          <VStack ml={4}>
            <Text>{address}</Text>
            <Text>{distance}km de voce</Text>
          </VStack>
        </HStack>

        <HStack mb={3}>
          <Icon as={Feather} name="tool" size={5} ml={3} color="orange.600" />
          <VStack ml={4}>
            <Text>
              Especialista em:{' '}
              {specialty.map((specialty) => {
                return (
                  <Text>
                    {servicesCategories.map((category) =>
                      category.id === specialty ? category.name : ''
                    )}
                    {', '}
                  </Text>
                );
              })}
            </Text>
          </VStack>
        </HStack>
      </TouchableOpacity>
      <Divider />
    </VStack>
  );
}
