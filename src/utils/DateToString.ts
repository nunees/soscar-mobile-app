export function DateToString(date: Date) {
  return date.toString().split('T')[0].split('-').reverse().join('/');
}
