import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack, Text, HStack } from 'native-base';
import { TouchableOpacity } from 'react-native';

type SchedulesType = {
  date: string | undefined | null;
  id: string | undefined | null;
  business_name: string | undefined | null;
  time: string | undefined | null;
  service: string | undefined | null;
};

type Props = {
  data: SchedulesType;
};

function numberToMonth(month: string) {
  switch (month) {
    case '01':
      return 'Janeiro';
    case '02':
      return 'Fevereiro';
    case '03':
      return 'Março';
    case '04':
      return 'Abril';
    case '05':
      return 'Maio';
    case '06':
      return 'Junho';
    case '07':
      return 'Julho';
    case '08':
      return 'Agosto';
    case '09':
      return 'Setembro';
    case '10':
      return 'Outubro';
    case '11':
      return 'Novembro';
    case '12':
      return 'Dezembro';
    default:
      return 'Mês';
  }
}

/**
 * 4 - Cancelado
 * 1 - Agendado
 * 2 - Em andamento
 * 3 - Finalizado
 */

const todayDate = new Date().toISOString().slice(0, 10).split('-')[2];
const todayMonth = new Date().toISOString().slice(0, 10).split('-')[1];

export function SmallSchedulleCard({ data }: Props) {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <>
      {data?.date!.toString().split('-')[1] >= todayMonth &&
        data?.date!.toString().split('-')[2] > todayDate && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('schedulesDetails', {
                scheduleId: String(data!.id),
              })
            }
          >
            <HStack
              w={400}
              h={100}
              backgroundColor={'purple.100'}
              variant="subtle"
              borderRadius={6}
              justifyContent={'flex-start'}
            >
              <HStack>
                <VStack
                  w={100}
                  backgroundColor={'purple.700'}
                  p={1}
                  borderRadius={6}
                >
                  <VStack alignItems={'center'}>
                    <Text color={'white'} fontSize={'4xl'} bold>
                      {data.date?.split('T')[0].split('-')[2]}
                    </Text>
                    <Text color="white">
                      {numberToMonth(data?.date!.split('T')[0].split('-')[1])}
                    </Text>
                  </VStack>
                </VStack>
              </HStack>

              <HStack ml={5} py={2}>
                <VStack>
                  <Text color={'gray.700'} fontSize={'lg'} bold>
                    {data.business_name}
                  </Text>
                  <Text color={'gray.700'} fontSize={'lg'}>
                    {data.time}h
                  </Text>
                  <Text>Tipo de servico: {data.service}</Text>
                </VStack>
              </HStack>
            </HStack>
          </TouchableOpacity>
        )}
    </>
  );
}
