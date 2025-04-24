export function formatToUSAPhoneFormat(phoneNumber: string): string {
  if(!phoneNumber) {
   return '';
  }
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

  if (cleanedPhoneNumber.length === 10) {
    const areaCode = cleanedPhoneNumber.slice(0, 3);
    const exchangeCode = cleanedPhoneNumber.slice(3, 6);
    const lineNumber = cleanedPhoneNumber.slice(6);

    return `+1 (${areaCode}) ${exchangeCode}-${lineNumber}`;
  } else if (cleanedPhoneNumber.length === 11) {
    const countryCode = cleanedPhoneNumber.slice(0, 1);
    const areaCode = cleanedPhoneNumber.slice(1, 4);
    const exchangeCode = cleanedPhoneNumber.slice(4, 7);
    const lineNumber = cleanedPhoneNumber.slice(7);

    return `+${countryCode} (${areaCode}) ${exchangeCode}-${lineNumber}`;
  } else {
    return 'Invalid phone number format';
  }
}