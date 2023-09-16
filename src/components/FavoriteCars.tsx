import getLogoImage from '@components/LogosImages';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack, Text, HStack, Image } from 'native-base';
import { TouchableOpacity } from 'react-native';

type QuickVehicleCardProps = {
  vehicle: IVehicleDTO;
};

export function FavoriteCars({ vehicle }: QuickVehicleCardProps) {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack w={370} h={138}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('vehicleDetails', { vehicleId: vehicle.id })
        }
      >
        <VStack py={3}>
          <HStack
            px={5}
            justifyContent="space-between"
            backgroundColor="white"
            borderRadius={10}
          >
            <VStack mt={5}>
              <Text bold fontSize={'lg'}>
                {vehicle.brand.name}
              </Text>
              <Text fontSize={'md'}>{vehicle.name.name}</Text>
              <Text fontSize={'xs'}>{vehicle.year}</Text>
            </VStack>
            <VStack>
              <Image
                source={getLogoImage(vehicle.brand.icon)}
                alt={'Carro'}
                mt={3}
              />
            </VStack>
          </HStack>
        </VStack>
      </TouchableOpacity>
    </VStack>
  );
}
