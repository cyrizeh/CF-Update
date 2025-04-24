export const formatDateToLocal = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString();
};