import { ISchedules } from '@dtos/ISchedules';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Icon, VStack, Text, HStack } from 'native-base';
import { TouchableOpacity } from 'react-native';

type Props = {
  data: ISchedules;
};

/**
 * 0 - Cancelado
 * 1 - Agendado
 * 2 - Em andamento
 * 3 - Finalizado
 */

export function SmallSchedulleCard({ data }: Props) {
  const date = data.date
    .toString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join('/');

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('schedulesDetails', {
          scheduleId: String(data!.id),
        })
      }
    >
      <HStack w={300} py={5} justifyContent="space-between">
        <VStack ml={5}>
          <HStack>
            <Icon as={Feather} name="calendar" size={6} color={'orange.800'} />
            <VStack ml={3}>
              <Text bold fontSize="md">
                {date}
              </Text>
              <Text fontSize="md">{data.time}</Text>
            </VStack>
          </HStack>
        </VStack>

        <VStack ml={5}>
          <HStack>
            <Icon as={Feather} name="briefcase" size={6} color={'orange.800'} />
            <VStack ml={3}>
              <Text bold fontSize="md">
                {data.location?.business_name}
              </Text>
              {data.status === 0 && (
                <Text color="red.500" fontSize="md">
                  cancelado
                </Text>
              )}
              {data.status === 1 && (
                <Text color="yellow.600" fontSize="md">
                  agendado
                </Text>
              )}
              {data.status === 2 && (
                <Text fontSize="md" color="yellow.500">
                  em andamento
                </Text>
              )}
              {data.status === 3 && (
                <Text fontSize="md" color="green.500">
                  finalizado
                </Text>
              )}
            </VStack>
          </HStack>
        </VStack>
        <VStack pl={10}>
          <Icon as={Feather} name="info" size={10} color={'orange.800'} />
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
}
