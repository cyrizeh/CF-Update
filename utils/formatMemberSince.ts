export const formatMemberSince = (isoDate: string | undefined) => {
  if (!isoDate) {
    return null;
  }
  const date = new Date(isoDate);
  const timeZoneOffsetMinutes = date.getTimezoneOffset();

  const adjustedDate = new Date(date.getTime() + timeZoneOffsetMinutes * 60000);
  const year = adjustedDate.getFullYear().toString();
  const monthName = adjustedDate.toLocaleDateString('en-US', { month: 'long' });

  return `Member since ${monthName} ${year}`;
}
