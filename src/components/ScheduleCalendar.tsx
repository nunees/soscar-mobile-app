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

// const timeToString = (time: Date) => {
//   const date = new Date(time);
//   return date.toISOString().split('T')[0];
// };

type Props = {
  selectedDate: string;
  setSelectedDate: Dispatch<SetStateAction<string>>;
};

export function ScheduleCalendar({ selectedDate, setSelectedDate }: Props) {
  // const [items, setItems] = useState([]);

  // const loadItems = (day: any) => {
  //   setTimeout(() => {
  //     for (let i = -15; i < 85; i += 1) {
  //       const time = day.timestamp + i * 24 * 60 * 60 * 1000;
  //       const strTime = timeToString(time);

  //       if (!items[strTime]) {
  //         items[strTime] = [];
  //         const numItems = Math.floor(Math.random() * 3 + 1);

  //         for (let j = 0; j < numItems; j += 1) {
  //           items[strTime].push({
  //             name: `Item for ${strTime} #${j}`,
  //             height: Math.max(50, Math.floor(Math.random() * 150)),
  //           });
  //         }
  //       }
  //     }

  //     const newItems = {};
  //     Object.keys(items).forEach((key) => {
  //       newItems[key] = items[key];
  //     });

  //     setItems(newItems);
  //   }, 1000);
  // };

  // const renderItem = (day) => {
  //   return <Text>{day.name}</Text>;
  // };

  console.log(selectedDate);

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
