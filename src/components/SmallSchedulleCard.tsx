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
    <VStack mb={3} shadow={0.8} backgroundColor={'white'}>
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
                <Text color={'white'} fontSize={'5xl'} bold>
                  {date?.toString().split('T')[0].split('-')[2]}
                </Text>
                <Text color="white" fontSize={'md'}>
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
              <Badge
                colorScheme="success"
                variant="solid"
                borderLeftRadius={10}
              >
                <Text color="white" bold pr={2}>
                  Em {remainingDays(date)} dias
                </Text>
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
