export type EditPatientProfileFormValues = {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string | null;
  email: string;
  phoneNumber: string;
  alternativeEmail: string;
  address: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zipCode: string;
  };
};