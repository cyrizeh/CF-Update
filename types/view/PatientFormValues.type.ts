import { OnboardingType } from './OnBoardingType.type';
import { PaymentDateSource } from './PatientPaymentDateSource.type';

export type PatientFormValues = {
  skipPartner: string | undefined;
  skipEmergency: string | undefined;
  hasPartner: boolean | undefined;
  patient:
    | {
        firstName: string;
        middleName: string;
        dateOfBirth: Date | null;
        lastName: string;
        email: string;
        note: string;
        phoneNumber: string;
        address: {
          street1: string;
          street2: string;
          city: string;
          state: string;
          zipCode: string;
        };
      }
    | null
    | undefined;
  partner:
    | {
        partnerId?: string;
        firstName: string;
        middleName: string;
        dateOfBirth: Date;
        lastName: string;
        email: string;
        note: string;
        phoneNumber: string;
        address: {
          street1: string;
          street2: string;
          city: string;
          state: string;
          zipCode: string;
        };
        temp: {
          address: {
            street1: string;
            street2: string;
            city: string;
            state: string;
            zipCode: string;
          };
        };
        isAutocomplete?:boolean;
        isValidPartner?:boolean;
      }
    | null
    | undefined;
  emergencyInfo:
    | {
        contactName: string;
        contactEmail: string;
        contactAddress: string;
      }
    | null
    | undefined;
  billingInfo:
    | {
        clinicId: { id: string; name: string; onboardingConfiguration: { isPreTreatmentEnabled: boolean } };
        facilityId: string;
        billingStartDate: Date | null | string;
      }
    | null
    | undefined;
  donorInfo:
    | {
        specimenTypes: Array<string>;
        freezeDate: Date;
        idLabResult: string;
        numberOfCanes: number;
        numberOfStraws: number;
        tissueType: string;
        witness: string;
        isPreTreatment: boolean;
        onBoardingType: OnboardingType
      }
    | null
    | undefined;
  usePatientAddress: boolean;
};
