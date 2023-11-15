export function handleDate(date: Date | undefined) {
  if (date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return '';
}

export function handleTime(date: Date) {
  if (date) {
    const fullHours = date.toLocaleTimeString('pt-BR');
    const currentTime = fullHours.split(':');
    const minutes = '00';
    return `${currentTime[0]}:${minutes}`;
  }
  return '';
}
