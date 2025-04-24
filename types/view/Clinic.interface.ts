import { ClinicDocument } from './ClinicDocument.type';

export interface Clinic {
  isFavorite: boolean;
  id: string;
  name: string;
  parentCompany: string;
  type: string;
  status: string;
  contactDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    jobTitle: string;
  };
  secondaryContactDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    jobTitle: string;
  };
  affiliateDetails: ClinicAffiliateDetails | null;
  address: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  billingAddress: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  patientsCount: number;
  contractsCount: number;
  hasBillingForCurrentYear: boolean;
  documents: ClinicDocument[];
  onboardingConfiguration: {
    isPreTreatmentEnabled: boolean;
    paymentDateSource: string;
  };
  accountId: string;
  accountName: string;
  pricingPlanId: string;
  specimensCount: number;
}

export interface ClinicAffiliateDetails {
  affiliateStoragePrices: [AffiliateStoragePricesElement];
  transportPerPatient: number;
}

export interface AffiliateStoragePricesElement {
  price: number;
  storageDuration: string;
}

export interface ClinicAddress {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
}
