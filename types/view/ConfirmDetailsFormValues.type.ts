
export type ConfirmDetailsFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  middleName: string;
  dateOfBirth: string | null;
  address: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
  };
};
