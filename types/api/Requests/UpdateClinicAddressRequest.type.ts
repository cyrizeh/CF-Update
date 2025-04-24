export type UpdateClinicAddressRequest = {
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  billingAddress: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  clinicId: string;
};
