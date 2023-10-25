import { ISchedules } from '@dtos/ISchedules';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import {
  compareDateIsAfter,
  compareDateIsBefore,
  countDaysBetweenDates,
  numberToMonth,
} from '@utils/DayjsDateProvider';
import { VStack, Text, HStack, Badge, Center } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';

// type Props = {
//   data: {
//     date: Date;
//     id: string | undefined | null;
//     business_name: string | undefined | null;
//     time: string | undefined | null;
//     service: string | undefined | null;
//   };
// };

type Props = {
  data: ISchedules[];
};

export function SmallSchedulleCard({ data }: Props) {
  const [date, setDate] = useState<string>('');
  const [isDateAfter, setIsDateAfter] = useState(false);
  const [isDateBefore, setIsDateBefore] = useState(false);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // useEffect(() => {
  //   if (compareDateIsAfter(data.date, new Date())) {
  //     setIsDateAfter(true);
  //     setDate(data.date.toString().split('T')[0]);
  //   }

  //   if (compareDateIsBefore(data.date, new Date())) {
  //     setIsDateBefore(true);
  //     setDate(data.date.toString().split('T')[0]);
  //   }
  // }, [data]);

  const remainingDays = useCallback((item: ISchedules) => {
    const todayDate = new Date();
    return countDaysBetweenDates(todayDate, item.date);
  }, []);

  return (
    <FlatList
      data={data}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      pagingEnabled
      keyExtractor={(item) => item.id!}
      renderItem={({ item }) => {
        return (
          <VStack mb={3} borderRadius={5} shadow={0.8}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('schedulesDetails', {
                  scheduleId: String(item.id),
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
                        {item.date.toString().split('T')[0].split('-')[2]}
                      </Text>
                      <Text color="white">
                        {numberToMonth(item.date.toString().split('-')[1])}
                      </Text>
                    </VStack>
                  </VStack>
                </HStack>

                <HStack ml={5} py={2}>
                  <VStack>
                    <Text color={'gray.700'} fontSize={'lg'} bold>
                      {item.location?.business_name}
                    </Text>
                    <Text color={'gray.700'} fontSize={'lg'}>
                      {item.time}
                    </Text>
                    <Text>Tipo de servico: {item.service_type_id}</Text>
                  </VStack>
                </HStack>

                <VStack position={'relative'} right={-40} top={2}>
                  {remainingDays(item) > 0 && (
                    <Badge colorScheme="purple" variant="subtle">
                      <Text color="gray.500" bold>
                        Em {remainingDays(item)} dias
                      </Text>
                    </Badge>
                  )}

                  {remainingDays(item) === 0 && (
                    <Badge colorScheme="red" variant="solid" borderRadius={6}>
                      <Text color="white" bold>
                        Vencido
                      </Text>
                    </Badge>
                  )}

                  {remainingDays(item) < 0 && (
                    <Badge colorScheme="red" variant="subtle">
                      <Text color="gray.500" bold>
                        {Math.abs(remainingDays(item))} dias atrasado
                      </Text>
                    </Badge>
                  )}
                </VStack>
              </HStack>
            </TouchableOpacity>
          </VStack>
        );
      }}
      ListEmptyComponent={() => (
        <HStack
          backgroundColor="white"
          w={350}
          borderRadius={10}
          p={3}
          justifyContent={'space-around'}
        >
          <VStack w={20} h={20}>
            <VStack
              backgroundColor={'purple.700'}
              borderRadius={10}
              alignItems={'center'}
            >
              <Text bold fontSize={'4xl'} p={3} color="white">
                {new Date().getDate().toString()}
              </Text>
            </VStack>
          </VStack>
          <VStack pt={5}>
            <Center>
              <Text color="green.600">Tudo certo! 👍</Text>
              <Text color="green.600" bold>
                Você não possui agendamentos
              </Text>
            </Center>
          </VStack>
        </HStack>
      )}
    />
  );
}
