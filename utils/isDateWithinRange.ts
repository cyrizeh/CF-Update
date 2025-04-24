export function isDateWithinRange(dateString: string, rangeInDays: number): boolean {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const rangeEndDate = new Date();
  rangeEndDate.setDate(currentDate.getDate() + rangeInDays);

  return inputDate <= rangeEndDate;
}