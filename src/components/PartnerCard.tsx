import { ILocation } from '@dtos/ILocation';
import { Feather } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import { CalculatePositionDistance } from '@utils/CalculatePositionDistance';
import {
  Image,
  VStack,
  HStack,
  Heading,
  Text,
  IImageProps,
  IIconProps,
  Icon,
  Badge,
  Button,
} from 'native-base';
import {
  ImageSourcePropType,
  Linking,
  Platform,
  TouchableOpacity,
} from 'react-native';

type Props = IImageProps &
  IIconProps & {
    image: ImageSourcePropType;
    location: ILocation;
  };

export function PartnerCard({ image, location, ...rest }: Props) {
  const { profile } = useProfile();

  function functionMapsNavigate() {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${location?.latitude},${location?.longitude}`;
    const label = location?.business_name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    return url;
  }

  function getDistanceFromLatLonInKm(
    [lat1, lon1]: number[],
    [lat2, lon2]: number[]
  ) {
    return CalculatePositionDistance([lat1, lon1], [lat2, lon2]);
  }

  function isPartnerOpen() {
    const open = location?.open_hours.split('-')[0].split(':')[0];
    const close = location?.open_hours.split('-')[1].split(':')[0];
    const now = new Date().getHours();
    return now >= Number(open) && now <= Number(close);
  }

  return (
    <VStack
      w={380}
      p={5}
      alignSelf="center"
      mb={5}
      background="white"
      borderRadius={10}
      shadow={1}
    >
      <TouchableOpacity {...rest}>
        <HStack position="absolute" right={0} top={0}>
          <Badge
            ml={2}
            colorScheme={isPartnerOpen() ? 'success' : 'danger'}
            variant="solid"
            rounded={5}
          >
            {isPartnerOpen() ? 'aberto' : 'fechado'}
          </Badge>
        </HStack>
        <HStack>
          <Image
            source={image}
            h={20}
            w={20}
            rounded={'full'}
            borderWidth={1}
            alt={''}
            mt={1}
          />
          <VStack ml={2} mb={3}>
            <HStack justifyContent="space-between" mb={1}>
              <Heading>{location?.business_name} </Heading>
            </HStack>

            <VStack>
              <HStack mb={1}>
                <Icon name="map-pin" as={Feather} size={4} color="purple.400" />
                <Text>
                  {' '}
                  {getDistanceFromLatLonInKm(
                    [Number(profile.latitude), Number(profile.longitude)],
                    [Number(location?.latitude), Number(location?.longitude)]
                  ).toPrecision(3)}{' '}
                  km de voce
                </Text>
              </HStack>
              <HStack mb={1}>
                <Icon name="clock" as={Feather} size={4} color="purple.400" />
                <Text> {location?.open_hours}</Text>
              </HStack>
              <HStack mb={1}>
                <Icon name="phone" as={Feather} size={4} color="purple.400" />
                <Text> {location?.business_phone}</Text>
              </HStack>
            </VStack>
          </VStack>
        </HStack>
      </TouchableOpacity>
      <Button
        position={'absolute'}
        top={100}
        right={5}
        width={70}
        height={8}
        colorScheme={'purple'}
        onPress={() => Linking.openURL(functionMapsNavigate() as string)}
      >
        <Icon name="navigation" as={Feather} size={5} color="white" />
      </Button>
    </VStack>
  );
}
