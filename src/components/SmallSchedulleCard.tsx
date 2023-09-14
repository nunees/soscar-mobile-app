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
 * 4 - Cancelado
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
      <HStack w={300} p={5} justifyContent="space-between">
        <VStack>
          <HStack>
            <HStack>
              <Icon
                as={Feather}
                name="calendar"
                size={6}
                color={'orange.800'}
              />

              <Text pl={2} pt={1}>
                {date}
              </Text>
            </HStack>
            <HStack ml={5}>
              <Icon as={Feather} name="clock" size={6} color={'orange.800'} />
              <Text pl={2} pt={1}>
                {data.time}
              </Text>
            </HStack>
            <HStack ml={5}>
              <Icon
                as={Feather}
                name="briefcase"
                size={6}
                color={'orange.800'}
              />
              <Text pl={2} pt={1}>
                {data.location?.business_name}
              </Text>
            </HStack>
          </HStack>
        </VStack>

        <VStack ml={5}>
          {data.status === 4 && (
            <Icon as={Feather} name="x" color="red.500" size={7} />
          )}
          {data.status === 1 && (
            <Icon as={Feather} name="file-text" color="blue.500" size={7} />
          )}
          {data.status === 2 && (
            <Icon as={Feather} name="tool" color="orange.500" size={7} />
          )}
          {data.status === 3 && (
            <Icon as={Feather} name="check" color="green.500" size={7} />
          )}
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
}
