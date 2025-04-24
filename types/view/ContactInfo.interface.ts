export interface ContactInfo {
  disabled?: boolean;
  patientContactInfo?: {
    address: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  contactInfo: {
    email: string;
    alternativeEmail: string;
    phoneNumber: string;
    address: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  changeInfo: (value: string, name: string) => void;
}
