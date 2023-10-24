/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { LoadingModal } from '@components/LoadingModal';
import { IQuoteList } from '@dtos/IQuoteList';
import { ISchedules } from '@dtos/ISchedules';
import { AntDesign, FontAwesome5, Octicons } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import {
  VStack,
  Text,
  HStack,
  Avatar,
  Fab,
  Center,
  Icon,
  Pressable,
  useToast,
  Badge,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Orders() {
  const [isLoading, setIsLoading] = useState(false);

  const [schedules, setSchedules] = useState<{ [key: string]: ISchedules[] }>(
    {}
  );
  const [quotes, setQuotes] = useState<{ [key: string]: IQuoteList[] }>({});

  const [isSchedulesToggled, setIsSchedulesToggled] = useState(true);
  const [isQuotesToggled, setIsQuotesToggled] = useState(false);

  const { user } = useAuth();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const toast = useToast();

  function handleToggleData() {
    setIsSchedulesToggled(!isSchedulesToggled);
    setIsQuotesToggled(!isQuotesToggled);
  }

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
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

        setSchedules(reducedSchedules);
      } catch (error) {
        const isAppError = error instanceof Error;
        const message = isAppError ? error.message : 'Erro ao carregar dados';
        toast.show({
          title: message,
          bg: 'red.500',
          placement: 'top',
        });
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, [isSchedulesToggled]);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await api.get('/quotes/partner', {
          headers: {
            id: user.id,
          },
        });

        const quotes: IQuoteList[] = response.data;

        const reducedQuotes = quotes.reduce(
          (acc: { [key: string]: IQuoteList[] }, item) => {
            // Extract date from item
            const { created_at } = item;
            const date = created_at!;

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

        console.log(reducedQuotes);
        setQuotes(reducedQuotes);
      } catch (error) {
        const isAppError = error instanceof Error;
        const message = isAppError ? error.message : 'Erro ao carregar dados';
        toast.show({
          title: message,
          bg: 'red.500',
          placement: 'top',
        });
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, [isQuotesToggled]);

  function renderSchedules(item: ISchedules) {
    return (
      <Pressable
        backgroundColor={'white'}
        margin={5}
        borderRadius={6}
        justifyContent={'flex-start'}
        flex={1}
        p={5}
        onPress={() =>
          navigation.navigate('scheduleDetail', { scheduleId: item.id })
        }
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
                  `${api.defaults.baseURL}/user/avatar/${item.users?.id}/${item.users?.avatar}`,
              }}
              size="lg"
            />
          </VStack>
        </HStack>
      </Pressable>
    );
  }

  function renderQuotes(item: IQuoteList) {
    return (
      <Pressable
        backgroundColor={'white'}
        margin={5}
        borderRadius={6}
        justifyContent={'flex-start'}
        flex={1}
        p={5}
        onPress={() =>
          navigation.navigate('quoteDetail', {
            quoteId: item.id,
            locationId: item.location_id,
          })
        }
      >
        <HStack justifyContent={'space-between'}>
          <VStack>
            <Text bold>
              {item.users.name} {item.users.last_name}
            </Text>

            <Text>{item.users?.mobile_phone}</Text>

            <HStack w={200} mt={5}>
              <Text noOfLines={1}>{item.user_notes}</Text>
            </HStack>

            {item.status === 1 && (
              <Badge mt={5} colorScheme="purple">
                Aguardando
              </Badge>
            )}

            {item.status === 2 && (
              <Badge mt={5} colorScheme="yellow">
                Em processo
              </Badge>
            )}

            {item.status === 3 && (
              <Badge mt={5} colorScheme="green">
                Aguardando
              </Badge>
            )}
          </VStack>
          <VStack alignItems={'center'}>
            <Avatar
              borderWidth={3}
              borderColor={'purple.700'}
              source={{
                uri:
                  item.users.avatar &&
                  `${api.defaults.baseURL}/user/avatar/${item.users.id}/${item.users.avatar}`,
              }}
              size="lg"
            />
            {item.is_juridical && (
              <Icon as={Octicons} name="law" size="4" mt={5} />
            )}
          </VStack>
        </HStack>
      </Pressable>
    );
  }

  function renderEmptyData() {
    return (
      <VStack margin={5} borderRadius={6} justifyContent={'flex-start'} p={5}>
        <Center>
          <Text color={'gray.400'}>
            Não há {isSchedulesToggled ? 'agendamentos' : 'orcamentos'} para
            hoje.
          </Text>
        </Center>
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
        <AppHeader
          title={`Agenda - ${
            isSchedulesToggled ? 'Agendamentos' : 'Orcamentos'
          }`}
          navigation={navigation}
          screen="home"
        />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={setIsLoading}
          message={
            isSchedulesToggled
              ? 'Carregando agendamentos'
              : 'Carregando orçamentos'
          }
        />
      )}

      {isSchedulesToggled && (
        <Agenda
          items={schedules as any}
          renderItem={renderSchedules as any}
          renderEmptyData={renderEmptyData}
        />
      )}

      {isQuotesToggled && (
        <Agenda
          items={quotes as any}
          renderItem={renderQuotes as any}
          renderEmptyData={renderEmptyData}
        />
      )}

      <Fab
        renderInPortal={false}
        shadow={2}
        size="sm"
        colorScheme={'purple'}
        onPress={handleToggleData}
        icon={
          isSchedulesToggled ? (
            <Icon
              color="white"
              as={FontAwesome5}
              name="calendar-alt"
              size="4"
            />
          ) : (
            <Icon color="white" as={AntDesign} name="switcher" size="4" />
          )
        }
      />
    </SafeAreaView>
  );
}
