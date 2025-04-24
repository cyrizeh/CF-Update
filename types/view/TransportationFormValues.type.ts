export type TransportationFormAddress = {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
};

export type TransportationFormFacility = {
  id: string;
  name: string;
};

export type TransportationFormPatient = {
  patientId?: string;
  firstName: string;
  lastName: string;
  email: string;
  note: string;
  phoneNumber: string;
  hasPartner: boolean;
};

export type TransportationFormPartner = {
  partnerId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isAutocomplete?: boolean;
};

export type TransportationFormShipment = {
  typeOfSpecimen: any;
  requestingClinic: any;
  expeditedDelivery: boolean;
  expeditedPrice?: number;
  isRequestinClinicValid: boolean;
  payer:string;
  witness: any;
};

export type TransportationFormContactDetails = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
};

export type TransportationFormClinicAddress = {
  clinicName: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  zipCode: string;
  isValid: boolean;
};

export type TransportationFormDistance = {
  cryoToSending: number;
  sendingToRecieving: number;
  recievingToCryo: number;
};

export type TransportationFormClinicInfo = {
  sending:
    | {
        clinic: any;
        transportationRequestId: string;
        address: TransportationFormClinicAddress | null;
      }
    | null
    | undefined;
  receiving:
    | {
        clinic: any;
        address: TransportationFormClinicAddress  | null;
      }
    | null
    | undefined;
  facility: TransportationFormFacility | null | undefined;
  distance: TransportationFormDistance | null | undefined;
};

export type TransportationFormValues = {
  transportation: TransportationFormPatient | null | undefined;
  partner: TransportationFormPartner | null | undefined;
  shipment: TransportationFormShipment | null | undefined;
  clinicInfo: TransportationFormClinicInfo;
};
