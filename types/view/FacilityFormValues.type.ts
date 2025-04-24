export type FacilityFormValues = {
  id?: string;
  name: string;
  address: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
  };
};
