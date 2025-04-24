import dayjs from 'dayjs';

export function formatDateWithSlashSeparator(inputDate: string): string {
  const formattedDate = dayjs(inputDate).format('MM/DD/YYYY');
  return formattedDate;
}
