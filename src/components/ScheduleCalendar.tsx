/* eslint-disable import/no-extraneous-dependencies */

import { VStack } from 'native-base';
import { Dispatch, SetStateAction } from 'react';
import { LocaleConfig, Calendar } from 'react-native-calendars';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho ',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro ',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta ',
    'Sexta',
    'Sábado',
  ],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
  today: 'Hoje',
};

LocaleConfig.defaultLocale = 'pt-br';

type Props = {
  selectedDate: string;
  setSelectedDate: Dispatch<SetStateAction<string>>;
};

export function ScheduleCalendar({ selectedDate, setSelectedDate }: Props) {
  return (
    <VStack>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#5A4BB7',
          },
        }}
        theme={{
          todayTextColor: '#5A4BB7',
        }}
      />
    </VStack>
  );
}
