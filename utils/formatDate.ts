import dayjs from 'dayjs';

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};

export const formatDate = (date: Date): string => {
  return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join('-');
};

export const formatDateDayJS = (date: string | Date) => dayjs(date).format('YYYY-MM-DD');
