import getLogoImage from '@components/LogosImages';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack, Text, HStack, Image, Icon } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import { TouchableOpacity } from 'react-native';

type QuickVehicleCardProps = IVStackProps & {
  vehicle: IVehicleDTO;
};

export function QuickVehicleCard({ vehicle, ...rest }: QuickVehicleCardProps) {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack px={19} mb={5}>
      {vehicle && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('vehicleDetails', { vehicleId: vehicle.id })
          }
        >
          <VStack shadow={1} h={130} {...rest}>
            <HStack
              style={{
                position: 'absolute',
                top: -5,
                left: 300,
                zIndex: 1,
              }}
            >
              <Icon
                as={Entypo}
                name={vehicle.isPrimary ? 'heart' : 'heart-outlined'}
                size={5}
                mt={5}
                mr={5}
                color={vehicle.isPrimary ? 'red.500' : 'gray.500'}
              />
            </HStack>
            <HStack px={5} justifyContent="space-between">
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
      )}
    </VStack>
  );
}
