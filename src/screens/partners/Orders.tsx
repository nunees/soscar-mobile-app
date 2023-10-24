/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { ISchedules } from '@dtos/ISchedules';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { VStack, Text, HStack, Avatar, Divider } from 'native-base';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Orders() {
  const [items, setItems] = useState<{ [key: string]: ISchedules[] }>({});

  const [toggleSchedules, setToggleSchedules] = useState(true);
  const [toggleQuotes, setToggleQuotes] = useState(false);

  const { user } = useAuth();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  useEffect(() => {
    async function getData() {
      const response = await api.get('/schedules/partner', {
        headers: {
          id: user.id,
        },
      });

      const schedules: ISchedules[] = response.data;

      const reducedSchedules = schedules.reduce(
        (acc: { [key: string]: ISchedules[] }, item) => {
          // Extract date from item
          const { date } = item;

          // Format date to string
          const dateFormatted = date.toString().split('T')[0];

          // Check if date is already in acc
          if (acc[dateFormatted]) {
            // If it is, push item to acc[dateFormatted]
            acc[dateFormatted].push(item);
          } else {
            // If it isn't, create acc[dateFormatted] and push item to it
            acc[dateFormatted] = [item];
          }

          // Return acc
          return acc;
        },
        {}
      );

      setItems(reducedSchedules);
    }

    getData();
  }, []);

  function renderItem(item: ISchedules) {
    return (
      <VStack
        backgroundColor={'white'}
        margin={5}
        borderRadius={6}
        justifyContent={'flex-start'}
        flex={1}
        p={5}
      >
        <HStack justifyContent={'space-between'}>
          <VStack>
            <Text bold color="gray.600">
              Cliente:{' '}
              <Text fontWeight={'normal'} color="gray.900">
                {item.users?.name} {item.users?.last_name}
              </Text>
            </Text>
            <Text bold color="gray.600">
              Telefone:{' '}
              <Text fontWeight={'normal'} color="gray.900">
                {item.users?.mobile_phone}
              </Text>
            </Text>
            <Text bold color="gray.600">
              Hora:{' '}
              <Text fontWeight={'normal'} color="gray.900">
                {' '}
                {item.time}
              </Text>
            </Text>
          </VStack>
          <VStack>
            <Avatar
              borderWidth={3}
              borderColor={'purple.700'}
              source={{
                uri:
                  user.avatar &&
                  `${api.defaults.baseURL}/user/avatar/${user.id}/${item.users?.avatar}`,
              }}
              size="lg"
            />
          </VStack>
        </HStack>
      </VStack>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <VStack>
        <AppHeader title="Minha Agenda" navigation={navigation} screen="home" />
      </VStack>

      <HStack justifyContent={'space-between'} px={10} py={5}>
        <VStack>
          <TouchableOpacity
            onPress={() => {
              setToggleQuotes(false);
              setToggleSchedules(true);
            }}
          >
            <Text bold fontSize={'md'}>
              Agendamentos
            </Text>
            {toggleSchedules && (
              <Divider mt={1} borderColor="purple.900" borderWidth={1} />
            )}
          </TouchableOpacity>
        </VStack>
        <Divider orientation="vertical" />
        <VStack>
          <TouchableOpacity
            onPress={() => {
              setToggleSchedules(false);
              setToggleQuotes(true);
            }}
          >
            <Text bold fontSize={'md'}>
              Orcamentos
            </Text>
            {toggleQuotes && (
              <Divider mt={1} borderColor="purple.900" borderWidth={1} />
            )}
          </TouchableOpacity>
        </VStack>
      </HStack>

      <Agenda items={items as any} renderItem={renderItem as any} />
    </SafeAreaView>
  );
}
