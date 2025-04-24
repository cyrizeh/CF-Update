import { EPatientCreationStep, OnboardingStatusResponse, PatientStatus } from '@/types/Patients.enum';
import { BillingStartDateHistoryItem, PatientDocumentInfo } from '@/types/view';
import { TNotes } from '@/types/view/Notes.type';
import { OnboardingType } from '@/types/view/OnBoardingType.type';
import { PatientPartnerDetails } from '@/types/view/PatientOverviewProps.interface';

export type PatientResponse = {
  id: string;
  clinicId: string;
  clinicName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  alternativeEmail: string;
  dateOfBirth: string;
  phoneNumber: string;
  notes: TNotes[];
  address: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onboardingStatus: OnboardingStatusResponse;
  patientStatus: PatientStatus;
  patientCreationStep: EPatientCreationStep;
  partner: PatientPartnerDetails;
  locations: [
    {
      id: string;
      name: string;
      address: {
        street1: string;
        street2: string;
        city: string;
        state: string;
        zipCode: string;
      };
    }
  ];
  specimens: [
    {
      id: string;
      tissueType: string;
      numberOfStraws: number;
      numberOfCanes: number;
      freezeDate: string;
      idLabResult: string;
      clinicName: string;
      facilityName: string;
    }
  ];
  canes: [
    {
      id: string;
      vault: string;
      tank: number;
      pie: number;
      canister: string;
      rfid: string;
      clinicName: string;
      facilityName: string;
      numberOfStrawVials: string;
      caneSlot: string;
    }
  ];
  activities: [
    {
      type: string;
      description: string;
      occurredDate: string;
    }
  ];
  documents: PatientDocumentInfo[];
  pastCharges: [
    {
      name: string;
      serviseType: string;
      date: string;
      formattedAmount: string;
      status: string;
    }
  ];
  upcomingCharges: [
    {
      name: string;
      serviseType: string;
      date: string;
      formattedAmount: string;
      status: string;
    }
  ];
  patientType: string;
  transportations: any;
  subscriptionType?: string;
  billingStartDateHistory: BillingStartDateHistoryItem[];
  isSignup: boolean;
  onboardingType?: OnboardingType;
  hasLoggedIn?: boolean;
  userId: string | null;
};

export interface PatientBillingByCycleItem {
  id: string;
  patientId: string;
  status: BillingByCycleStatus;
  billingDate: Date | null;
  specimenTypes: string[];
}

export enum BillingByCycleStatus {
  Draft = 'Draft',
  Finalized = 'Finalized',
  Pending = 'Pending',
}

export enum PatientSubscriptionType {
  PerCycle = 'PerCycle',
  Consolidated = 'Consolidated',
}
