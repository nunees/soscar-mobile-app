import UserPhoto from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { Feather } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import { api } from '@services/api';
import { CalculatePositionDistance } from '@utils/CalculatePositionDistance';
import {
  VStack,
  HStack,
  Text,
  IImageProps,
  IIconProps,
  Icon,
  Badge,
  Button,
  Divider,
} from 'native-base';
import { Linking, Platform, TouchableOpacity } from 'react-native';

type Props = IImageProps &
  IIconProps & {
    location: ILocation;
  };

export function PartnerCard({ location, ...rest }: Props) {
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

  const distance = Number(
    getDistanceFromLatLonInKm(
      [Number(profile.latitude), Number(profile.longitude)],
      [Number(location?.latitude), Number(location?.longitude)]
    ).toPrecision(3)
  );

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
        <HStack>
          <UserPhoto
            source={{
              uri: location.users?.avatar
                ? `${api.defaults.baseURL}/user/avatar/${location.user_id}/${location.users.avatar}`
                : `https://ui-avatars.com/api/?format=png&name=${location.users?.name}+${location.users?.email}&size=512`,
            }}
            alt="Foto de perfil"
            size={100}
          />
          <VStack ml={2} mb={3}>
            <HStack justifyContent="space-between" mb={1}>
              <Text bold fontSize="md">
                {location?.business_name}{' '}
              </Text>
            </HStack>

            <VStack>
              <HStack mb={1}>
                <Icon name="map-pin" as={Feather} size={4} color="purple.400" />
                <Text>
                  {' '}
                  {distance < 1
                    ? 'bem proximo a voce'
                    : ` ${distance} km de voce`}
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
        <Divider my={2} />
        <HStack justifyContent={'space-between'}>
          <HStack>
            <Badge
              colorScheme={isPartnerOpen() ? 'success' : 'danger'}
              variant="solid"
              rounded={5}
            >
              {isPartnerOpen() ? 'aberto' : 'fechado'}
            </Badge>
          </HStack>
          <HStack>
            <Button
              width={70}
              height={8}
              colorScheme={'purple'}
              onPress={() => Linking.openURL(functionMapsNavigate() as string)}
            >
              <Icon name="navigation" as={Feather} size={5} color="white" />
            </Button>
          </HStack>
        </HStack>
      </TouchableOpacity>
    </VStack>
  );
}
