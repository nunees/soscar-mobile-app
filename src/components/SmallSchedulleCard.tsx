// import { ISchedules } from '@dtos/ISchedules';
// import { useNavigation } from '@react-navigation/native';
// import { AppNavigatorRoutesProps } from '@routes/app.routes';
// import { countDaysBetweenDates, numberToMonth } from '@utils/DayjsDateProvider';
// import { VStack, Text, HStack, Badge, Center } from 'native-base';
// import { useCallback } from 'react';
// import { FlatList, TouchableOpacity } from 'react-native';

// type Props = {
//   data: ISchedules;
// };

// export function SmallSchedulleCard({ data }: Props) {
//   const navigation = useNavigation<AppNavigatorRoutesProps>();

//   const remainingDays = useCallback((item: ISchedules) => {
//     const todayDate = new Date();
//     return countDaysBetweenDates(todayDate, item.date);
//   }, []);

//   return (
//     <FlatList
//       data={data}
//       horizontal={true}
//       showsHorizontalScrollIndicator={false}
//       snapToAlignment="start"
//       pagingEnabled
//       keyExtractor={(item) => item.id!}
//       renderItem={({ item }) => {
//         return (
//           <VStack mb={3} borderRadius={5} shadow={0.8}>
//             <TouchableOpacity
//               onPress={() =>
//                 navigation.navigate('schedulesDetails', {
//                   scheduleId: String(item.id),
//                 })
//               }
//             >
//               <HStack
//                 w={400}
//                 h={100}
//                 backgroundColor={'purple.100'}
//                 variant="subtle"
//                 borderRadius={6}
//                 justifyContent={'flex-start'}
//               >
//                 <HStack>
//                   <VStack
//                     w={100}
//                     backgroundColor={'purple.700'}
//                     p={1}
//                     borderRadius={6}
//                   >
//                     <VStack alignItems={'center'}>
//                       <Text color={'white'} fontSize={'4xl'} bold>
//                         {item.date.toString().split('T')[0].split('-')[2]}
//                       </Text>
//                       <Text color="white">
//                         {numberToMonth(item.date.toString().split('-')[1])}
//                       </Text>
//                     </VStack>
//                   </VStack>
//                 </HStack>

//                 <HStack ml={5} py={2}>
//                   <VStack>
//                     <Text color={'gray.700'} fontSize={'lg'} bold>
//                       {item.location?.business_name}
//                     </Text>
//                     <Text color={'gray.700'} fontSize={'lg'}>
//                       {item.time}
//                     </Text>
//                     <Text>Tipo de servico: {item.service_type_id}</Text>
//                   </VStack>
//                 </HStack>

//                 <VStack position={'relative'} right={-20} top={2}>
//                   {remainingDays(item) > 0 && (
//                     <Badge colorScheme="purple" variant="subtle">
//                       <Text color="gray.500" bold>
//                         Em {remainingDays(item)} dias
//                       </Text>
//                     </Badge>
//                   )}

//                   {remainingDays(item) === 0 && (
//                     <Badge colorScheme="red" variant="solid" borderRadius={6}>
//                       <Text color="white" bold>
//                         Vencido
//                       </Text>
//                     </Badge>
//                   )}

//                   {remainingDays(item) < 0 && (
//                     <Badge colorScheme="red" variant="subtle">
//                       <Text color="gray.500" bold>
//                         {Math.abs(remainingDays(item))} dias atrasado
//                       </Text>
//                     </Badge>
//                   )}
//                 </VStack>
//               </HStack>
//             </TouchableOpacity>
//           </VStack>
//         );
//       }}
//       ListEmptyComponent={() => (
//         <HStack
//           backgroundColor="white"
//           w={350}
//           borderRadius={10}
//           p={3}
//           justifyContent={'space-around'}
//         >
//           <VStack w={20} h={20}>
//             <VStack
//               backgroundColor={'purple.700'}
//               borderRadius={10}
//               alignItems={'center'}
//             >
//               <Text bold fontSize={'4xl'} p={3} color="white">
//                 {new Date().getDate().toString()}
//               </Text>
//             </VStack>
//           </VStack>
//           <VStack pt={5}>
//             <Center>
//               <Text color="green.600">Tudo certo! 👍</Text>
//               <Text color="green.600" bold>
//                 Você não possui agendamentos
//               </Text>
//             </Center>
//           </VStack>
//         </HStack>
//       )}
//     />
//   );
// }

import { SERVICES_TYPES } from '@data/ServicesTypes';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { countDaysBetweenDates, numberToMonth } from '@utils/DayjsDateProvider';
import { VStack, Text, HStack, Badge } from 'native-base';
import { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  id: string | undefined;
  client?: string | undefined;
  date: Date | undefined;
  business_name?: string | undefined;
  service_type: number | undefined;
  time: string | undefined;
};

export function SmallSchedulleCard({
  id,
  date,
  business_name,
  client,
  service_type,
  time,
}: Props) {
  const { user } = useAuth();

  const partnerNavigation = useNavigation<PartnerNavigatorRoutesProps>();
  const userNavigation = useNavigation<AppNavigatorRoutesProps>();

  const remainingDays = useCallback((date: Date | undefined) => {
    if (date) {
      const todayDate = new Date();
      return countDaysBetweenDates(todayDate, date);
    }
    return 0;
  }, []);

  return (
    <VStack mb={3} borderRadius={5} shadow={0.8}>
      <TouchableOpacity
        onPress={() =>
          user.isPartner
            ? partnerNavigation.navigate('scheduleDetail', {
                scheduleId: String(id),
              })
            : userNavigation.navigate('schedulesDetails', {
                scheduleId: String(id),
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
                  {date?.toString().split('T')[0].split('-')[2]}
                </Text>
                <Text color="white">
                  {numberToMonth(date?.toString().split('-')[1])}
                </Text>
              </VStack>
            </VStack>
          </HStack>

          <HStack ml={5} py={2}>
            <VStack>
              {client && (
                <Text color={'gray.700'} fontSize={'lg'} bold>
                  {client}
                </Text>
              )}

              {business_name && (
                <Text color={'gray.700'} fontSize={'lg'} bold>
                  {business_name}
                </Text>
              )}
              <Text color={'gray.700'} fontSize={'lg'}>
                {time}
              </Text>
              <Text>
                {SERVICES_TYPES.find((item) => item.id === service_type)?.name}
              </Text>
            </VStack>
          </HStack>

          <VStack position={'absolute'} right={10} top={2}>
            {remainingDays(date) > 0 && (
              <Badge colorScheme="purple" variant="subtle">
                <Text color="gray.500">Em {remainingDays(date)} dias</Text>
              </Badge>
            )}

            {remainingDays(date) === 0 && (
              <Badge colorScheme="red" variant="solid" borderRadius={6}>
                <Text color="white" bold>
                  Vencido
                </Text>
              </Badge>
            )}

            {remainingDays(date) < 0 && (
              <Badge colorScheme="red" variant="subtle">
                <Text color="gray.500" bold>
                  {Math.abs(remainingDays(date))} dias atrasado
                </Text>
              </Badge>
            )}
          </VStack>
        </HStack>
      </TouchableOpacity>
    </VStack>
  );
}
