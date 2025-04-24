import dayjs from 'dayjs';

export function formatDateWithDotSeparator(inputDate: string): string {
  const formattedDate = dayjs(inputDate).format('DD.MM.YYYY');
  return formattedDate;
}
