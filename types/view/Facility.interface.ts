export interface Facility {
  id: string;
  name: string;
  address: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  vaultsCount: number;
  canesCount: number;
  devicesCount: number;
  specimensCount: number;
  reservedSlots: number;
}
