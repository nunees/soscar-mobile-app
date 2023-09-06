// eslint-disable-next-line import/no-extraneous-dependencies
import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { VStack, Text, HStack, Icon, Center } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

dayjs.locale('pt-br');

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function NativeCalendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs().get('month'));
  const [currentYear, setCurrentYear] = useState(dayjs().get('year'));

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function handlePreviousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  return (
    <VStack mt={10} borderWidth={1} w={350}>
      {/* Month and Year Header */}
      <HStack justifyContent="space-between">
        <VStack>
          <TouchableOpacity>
            <Icon
              as={Feather}
              color="gray.300"
              name="chevron-left"
              size={8}
              onPress={handlePreviousMonth}
            />
          </TouchableOpacity>
        </VStack>
        <VStack>
          <Text bold color="gray.300" fontSize="md">
            {monthNames[currentMonth]} - {currentYear}
          </Text>
        </VStack>
        <VStack>
          <TouchableOpacity>
            <Icon
              as={Feather}
              color="gray.300"
              name="chevron-right"
              size={8}
              onPress={handleNextMonth}
            />
          </TouchableOpacity>
        </VStack>
      </HStack>

      {/* Calendar Grid */}
      <VStack flexDir="row" flexWrap="wrap">
        {Array.from({ length: 30 }, (_, index) => {
          const date = new Date(currentYear, currentMonth, index + 1); // September is month 8 (0-indexed)

          return (
            <HStack borderWidth={1} w={10} h={10} justifyContent="center">
              <TouchableOpacity>
                <Text bold fontSize="xl" textAlign="center">
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}
