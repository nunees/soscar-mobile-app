import dayjs from 'dayjs';

dayjs.locale('pt-br');

export function compareDateIsBefore(start_date: Date, end_date: Date): boolean {
  return dayjs(start_date).isBefore(end_date);
}

export function compareDateIsAfter(start_date: Date, end_date: Date): boolean {
  return dayjs(start_date).isAfter(end_date);
}

export function compareDateIsSame(start_date: Date, end_date: Date): boolean {
  return dayjs(start_date).isSame(end_date);
}

export function countDaysBetweenDates(
  start_date: Date,
  end_date: Date
): number {
  return dayjs(end_date).diff(start_date, 'days');
}

export function addDays(days: number): Date {
  return dayjs().add(days, 'days').toDate();
}

export function subtractDays(days: number): Date {
  return dayjs().subtract(days, 'days').toDate();
}

export function dateToMonthAndYear(date: Date): string {
  return dayjs(date).format('MM');
}

export function dateToDayMonthAndYear(date: Date): string {
  return dayjs(date).format('DD/MM/YYYY');
}

export function dateToFullDate(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function dateToMonthString(date: Date): string {
  return dayjs(date).format('MMMM');
}

export function formatDateAndTime(date: Date): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
}

export function numberToMonth(month: string | undefined) {
  switch (month) {
    case '01':
      return 'Janeiro';
    case '02':
      return 'Fevereiro';
    case '03':
      return 'Março';
    case '04':
      return 'Abril';
    case '05':
      return 'Maio';
    case '06':
      return 'Junho';
    case '07':
      return 'Julho';
    case '08':
      return 'Agosto';
    case '09':
      return 'Setembro';
    case '10':
      return 'Outubro';
    case '11':
      return 'Novembro';
    case '12':
      return 'Dezembro';
    default:
      return 'Mês';
  }
}
