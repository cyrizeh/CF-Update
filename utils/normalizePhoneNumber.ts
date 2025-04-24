export function convertPhoneNumberWithOutCode(phoneNumber: string | null): string {
  if (!phoneNumber) return '';
  // Remove all non-numeric characters from the phone number
  const normalizedNumber = phoneNumber.replace(/\D/g, '');

  // If the result is empty, return empty string
  if (normalizedNumber.length === 0) {
    return '';
  }

  let phoneNumberDigits = normalizedNumber;

  // Check if the number starts with "+1"
  if (phoneNumberDigits.length > 10 && phoneNumberDigits.startsWith('+1')) {
    phoneNumberDigits = phoneNumberDigits.slice(2);
  } // Check if the number starts with "1"
  else if (phoneNumberDigits.length > 10 && phoneNumberDigits.startsWith('1')) {
    phoneNumberDigits = phoneNumberDigits.slice(1);
  }

  // Return the normalized phone number (last 10 digits) with out code to set PatternFormat a value
  return phoneNumberDigits.slice(-10);
}

export function addUSCountryCodeWithOutPlus(phoneNumber: string | null): string {
  if (!phoneNumber) return '';
  return `1${phoneNumber}`;
}
