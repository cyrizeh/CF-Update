export type EditPatientFormValues = {
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
