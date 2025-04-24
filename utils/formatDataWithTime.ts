export const formatDataWithTime = (isoDate: string) => {
  if(!isoDate) return null;
  const date = new Date(isoDate);
  const timeZoneOffsetMinutes = date.getTimezoneOffset();

  const adjustedDate = new Date(date.getTime() + timeZoneOffsetMinutes * 60000);
  const year = adjustedDate.getFullYear().toString();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
  const day = String(adjustedDate.getDate()).padStart(2, '0');
  const hours = String(adjustedDate.getHours()).padStart(2, '0');
  const minutes = String(adjustedDate.getMinutes()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes} `;
};
