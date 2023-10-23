import UserPhoto from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { useGPS } from '@hooks/useGPS';
import { api } from '@services/api';
import { CalculatePositionDistance } from '@utils/CalculatePositionDistance';
import {
  VStack,
  HStack,
  Text,
  IImageProps,
  IIconProps,
  Badge,
} from 'native-base';
import { TouchableOpacity } from 'react-native';

type Props = IImageProps &
  IIconProps & {
    location: ILocation;
  };

export function PartnerCard({ location, ...rest }: Props) {
  // function functionMapsNavigate() {
  //   const scheme = Platform.select({
  //     ios: 'maps:0,0?q=',
  //     android: 'geo:0,0?q=',
  //   });
  //   const latLng = `${location?.latitude},${location?.longitude}`;
  //   const label = location?.business_name;
  //   const url = Platform.select({
  //     ios: `${scheme}${label}@${latLng}`,
  //     android: `${scheme}${latLng}(${label})`,
  //   });
  //   return url;
  // }

  const { coords } = useGPS();

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

  const distance = Number(
    getDistanceFromLatLonInKm(
      [Number(coords.latitude), Number(coords.longitude)],
      [Number(location?.latitude), Number(location?.longitude)]
    ).toPrecision(3)
  );

  return (
    <VStack
      w={380}
      p={5}
      alignSelf="center"
      mb={3}
      background="white"
      borderRadius={10}
      shadow={1}
    >
      <TouchableOpacity {...rest}>
        <HStack justifyContent={'space-between'}>
          <HStack>
            <UserPhoto
              source={{
                uri: location.users?.avatar
                  ? `${api.defaults.baseURL}/user/avatar/${location.user_id}/${location.users.avatar}`
                  : `https://ui-avatars.com/api/?format=png&name=${location.users?.name}+${location.users?.email}&size=512`,
              }}
              alt="Foto de perfil"
              size={50}
              borderWidth={2}
              borderColor={'purple.300'}
            />
          </HStack>

          <HStack justifyContent="space-between" mb={1}>
            <VStack>
              <Text bold fontSize="sm">
                {location?.business_name}
              </Text>
              <Text>
                {distance && distance < 1
                  ? 'bem proximo a voce'
                  : ` ${distance} km de voce`}
              </Text>
            </VStack>
          </HStack>

          <HStack>
            <VStack>
              <Badge
                colorScheme={isPartnerOpen() ? 'success' : 'danger'}
                variant="subtle"
                h={8}
                borderRadius={6}
              >
                {isPartnerOpen() ? 'Aberto' : 'Fechado'}
              </Badge>
            </VStack>
          </HStack>
        </HStack>

        {/* <HStack>
            <Button
              width={70}
              height={8}
              colorScheme={'purple'}
              onPress={() => Linking.openURL(functionMapsNavigate() as string)}
            >
              <Icon name="navigation" as={Feather} size={5} color="white" />
            </Button>
          </HStack> */}
      </TouchableOpacity>
    </VStack>
  );
}
