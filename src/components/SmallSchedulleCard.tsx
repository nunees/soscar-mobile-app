import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import {
  compareDateIsAfter,
  compareDateIsBefore,
  countDaysBetweenDates,
  numberToMonth,
} from '@utils/DayjsDateProvider';
import { VStack, Text, HStack, Badge } from 'native-base';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  data: {
    date: Date;
    id: string | undefined | null;
    business_name: string | undefined | null;
    time: string | undefined | null;
    service: string | undefined | null;
  };
};

/**
 * 4 - Cancelado
 * 1 - Agendado
 * 2 - Em andamento
 * 3 - Finalizado
 */

export function SmallSchedulleCard({ data }: Props) {
  const [date, setDate] = useState<string>('');
  const [isDateAfter, setIsDateAfter] = useState(false);
  const [isDateBefore, setIsDateBefore] = useState(false);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  useEffect(() => {
    if (compareDateIsAfter(data.date, new Date())) {
      setIsDateAfter(true);
      setDate(data.date.toString().split('T')[0]);
    }

    if (compareDateIsBefore(data.date, new Date())) {
      setIsDateBefore(true);
      setDate(data.date.toString().split('T')[0]);
    }
  }, [data]);

  return (
    <>
      {isDateAfter && (
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
                    {date.split('-')[2]}
                  </Text>
                  <Text color="white">{numberToMonth(date.split('-')[1])}</Text>
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

            <VStack position={'relative'} right={10} top={2}>
              <Badge colorScheme="purple" variant="subtle">
                <Text color="gray.500" bold>
                  Em {countDaysBetweenDates(new Date(), data.date)} dias
                </Text>
              </Badge>
            </VStack>
          </HStack>
        </TouchableOpacity>
      )}

      {isDateBefore && (
        <HStack
          backgroundColor={'green.500'}
          w={400}
          h={100}
          variant={'subtle'}
          borderRadius={6}
          justifyContent={'center'}
        >
          <VStack>
            <Text>Tudo certo!</Text>
            <Text>Nao existem agendamentos programados</Text>
          </VStack>
        </HStack>
      )}
    </>
  );
}
