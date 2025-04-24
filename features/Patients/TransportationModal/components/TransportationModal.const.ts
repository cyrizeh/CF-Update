import { ViewTypes } from '@/types';

export const defaultTransportationFormValues: ViewTypes.TransportationFormValues = {
  transportation: {
    patientId: '',
    firstName: '',
    lastName: '',
    email: '',
    note: '',
    phoneNumber: '',
    hasPartner: false,
  },
  shipment: {
    typeOfSpecimen: '',
    requestingClinic: '',
    payer: '',
    witness: '',
    expeditedDelivery: false,
    isRequestinClinicValid: true,
  },
  partner: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  },
  clinicInfo: {
    sending: {
      clinic: '',
      transportationRequestId: '',
      address: {
        clinicName: '',
        address1: '',
        address2: '',
        state: '',
        city: '',
        zipCode: '',
        isValid: true
      },
    },
    receiving: {
      clinic: '',
      address: {
        clinicName: '',
        address1: '',
        address2: '',
        state: '',
        city: '',
        zipCode: '',
        isValid: true
      },
    },
    facility: {
      id: '',
      name: '',
    },
    distance: {
      cryoToSending: 0,
      sendingToRecieving: 0,
      recievingToCryo: 0,
    },
  },
};
