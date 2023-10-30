/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHeader } from '@components/AppHeader';
import { ILegalQuote } from '@dtos/ILegalQuote';
import { IQuoteList } from '@dtos/IQuoteList';
import { ISchedules } from '@dtos/ISchedules';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
import React, { useCallback, useEffect, useState } from 'react';
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Orders() {
  const [buttonToggled, setButtonToggled] = useState(false);

  const [isJuridical, setIsJuridical] = useState(false);
  const [isCommon, setIsCommon] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);

  const [schedules, setSchedules] = useState<{ [key: string]: ISchedules[] }>(
    {}
  );

  const [quotes, setQuotes] = useState<{ [key: string]: IQuoteList[] }>({});
  const [legalQuotes, setLegalQuotes] = useState<{
    [key: string]: ILegalQuote[];
  }>({});

  const { user } = useAuth();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const toast = useToast();

  async function fetchLegalQuotes() {
    const juridicalQuotes = await api.get(`/legal/partner/${user.id}`, {
      headers: {
        id: user.id,
      },
    });

    const legalQuotes: ILegalQuote[] = juridicalQuotes.data;

    const reducedLegalQuotes = legalQuotes.reduce(
      (acc: { [key: string]: ILegalQuote[] }, item) => {
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

    setLegalQuotes(reducedLegalQuotes);
  }

  async function fetchQuotes() {
    const regularQuotes = await api.get('/quotes/partner', {
      headers: {
        id: user.id,
      },
    });

    const quotes: IQuoteList[] = regularQuotes.data;

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

    setQuotes(reducedQuotes);
  }

  async function fetchSchedules() {
    try {
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
    }
  }

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
            <Badge colorScheme="purple" borderRadius={10} mt={1}>
              <Text
                bold
                color={
                  item.status === 1
                    ? 'purple.700'
                    : item.status === 2
                    ? 'yellow.700'
                    : item.status === 3
                    ? 'green.700'
                    : 'gray.700'
                }
              >
                {item.status === 1 && 'Agendado'}
                {item.status === 2 && 'Aguardando'}
                {item.status === 3 && 'Em processo'}
                {item.status === 4 && 'Finalizado'}
              </Text>
            </Badge>
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

            <HStack w={200}>
              <Text noOfLines={1}>{item.user_notes}</Text>
            </HStack>

            <HStack mt={3}>
              <Badge
                colorScheme={
                  item.status === 1
                    ? 'purple'
                    : item.status === 2
                    ? 'yellow'
                    : item.status === 3
                    ? 'green'
                    : 'red'
                }
                borderRadius={10}
                mt={1}
              >
                <Text
                  bold
                  color={
                    item.status === 1
                      ? 'purple.700'
                      : item.status === 2
                      ? 'yellow.700'
                      : item.status === 3
                      ? 'green.700'
                      : 'red.700'
                  }
                >
                  {item.status === 1 && 'Solicitado'}
                  {item.status === 2 && 'Em processo'}
                  {item.status === 3 && 'Finalizado'}
                  {item.status === 4 && 'Cancelado'}
                </Text>
              </Badge>

              {item.is_juridical && (
                <Badge
                  colorScheme="info"
                  borderRadius={10}
                  ml={3}
                  variant={'solid'}
                >
                  <Text fontSize={'xs'} color="white" bold>
                    juridico
                  </Text>
                </Badge>
              )}

              {!item.is_juridical && (
                <Badge
                  colorScheme="info"
                  borderRadius={10}
                  ml={3}
                  variant={'solid'}
                >
                  <Text fontSize={'xs'} color="white" bold>
                    comum
                  </Text>
                </Badge>
              )}
            </HStack>
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
          </VStack>
        </HStack>
      </Pressable>
    );
  }

  function renderLegalQuotes(item: ILegalQuote) {
    return (
      <Pressable
        backgroundColor={'white'}
        margin={5}
        borderRadius={6}
        justifyContent={'flex-start'}
        flex={1}
        p={5}
        onPress={() =>
          navigation.navigate('legalQuoteDetail', {
            legalQuoteId: item.id,
            locationId: item.location_id,
          })
        }
      >
        <HStack justifyContent={'space-between'}>
          <VStack>
            <Text bold>{item.users?.name}</Text>

            <Text>{item.users?.mobile_phone}</Text>

            <HStack w={200}>
              <Text noOfLines={1}>{item.user_notes}</Text>
            </HStack>

            <HStack mt={2}>
              <Badge
                colorScheme={
                  item.status === 1
                    ? 'purple'
                    : item.status === 2
                    ? 'yellow'
                    : item.status === 3
                    ? 'green'
                    : 'red'
                }
                borderRadius={10}
                mt={1}
              >
                <Text
                  bold
                  color={
                    item.status === 1
                      ? 'purple.700'
                      : item.status === 2
                      ? 'yellow.700'
                      : item.status === 3
                      ? 'green.700'
                      : 'red.700'
                  }
                >
                  {item.status === 1 && 'Solicitado'}
                  {item.status === 2 && 'Em processo'}
                  {item.status === 3 && 'Finalizado'}
                  {item.status === 4 && 'Cancelado'}
                </Text>
              </Badge>

              {item.is_juridical && (
                <Badge
                  colorScheme="info"
                  borderRadius={10}
                  ml={3}
                  variant={'solid'}
                >
                  <Text fontSize={'xs'} color="white" bold>
                    juridico
                  </Text>
                </Badge>
              )}

              {!item.is_juridical && (
                <Badge
                  colorScheme="info"
                  borderRadius={10}
                  ml={3}
                  variant={'solid'}
                >
                  <Text fontSize={'xs'} color="white" bold>
                    comum
                  </Text>
                </Badge>
              )}
            </HStack>
          </VStack>
          <VStack alignItems={'center'}>
            <Avatar
              borderWidth={3}
              borderColor={'purple.700'}
              source={{
                uri:
                  item.users?.avatar &&
                  `${api.defaults.baseURL}/user/avatar/${item.users.id}/${item.users.avatar}`,
              }}
              size="lg"
            />
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
            Não existe atividiade para o dia selecionado
          </Text>
        </Center>
      </VStack>
    );
  }

  function renderScheduleAgenda() {
    return (
      <Agenda
        items={schedules as any}
        renderItem={renderSchedules as any}
        renderEmptyData={renderEmptyData}
      />
    );
  }

  function renderQuotesAgenda() {
    return (
      <Agenda
        items={quotes as any}
        renderItem={renderQuotes as any}
        renderEmptyData={renderEmptyData}
      />
    );
  }

  function renderLegalQuotesAgenda() {
    return (
      <Agenda
        items={legalQuotes as any}
        renderItem={renderLegalQuotes as any}
        renderEmptyData={renderEmptyData}
      />
    );
  }

  async function handleToggledButtons(statusName: string) {
    if (statusName === 'schedule') {
      setIsSchedule(true);
      setIsCommon(false);
      setIsJuridical(false);
      setButtonToggled(false);
      await fetchSchedules();
    } else if (statusName === 'common') {
      setIsCommon(true);
      setIsSchedule(false);
      setIsJuridical(false);
      setButtonToggled(false);
      await fetchQuotes();
    } else if (statusName === 'juridical') {
      setIsJuridical(true);
      setIsSchedule(false);
      setIsCommon(false);
      setButtonToggled(false);
      await fetchLegalQuotes();
    } else {
      setIsSchedule(false);
      setIsCommon(false);
      setIsJuridical(false);
      setButtonToggled(true);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <VStack>
        <AppHeader title={'Agenda'} navigation={navigation} screen="home" />
      </VStack>

      {isJuridical && renderLegalQuotesAgenda()}
      {isCommon && renderQuotesAgenda()}
      {isSchedule && renderScheduleAgenda()}

      {buttonToggled && (
        <VStack mb={20} position={'absolute'} bottom={0} right={1}>
          <Fab
            renderInPortal={false}
            shadow={2}
            colorScheme={'purple'}
            onPress={() => handleToggledButtons('juridical')}
            icon={<Icon color="white" as={Feather} name="briefcase" size="4" />}
            mb={40}
            label={'Orçamentos jurídicos'}
          />

          <Fab
            renderInPortal={false}
            shadow={2}
            colorScheme={'purple'}
            onPress={() => handleToggledButtons('common')}
            icon={<Icon color="white" as={Feather} name="layers" size="4" />}
            label={'Orçamentos comuns'}
          />

          <Fab
            renderInPortal={false}
            shadow={2}
            colorScheme={'purple'}
            onPress={() => handleToggledButtons('schedule')}
            icon={<Icon color="white" as={Feather} name="calendar" size="4" />}
            mb={20}
            label={'Agendamentos'}
          />
        </VStack>
      )}

      <Fab
        renderInPortal={false}
        shadow={2}
        colorScheme={'purple'}
        onPress={() => setButtonToggled(!buttonToggled)}
        icon={<Icon color="white" as={Feather} name="search" size="4" />}
        label={'O que procura?'}
      />
    </SafeAreaView>
  );
}
