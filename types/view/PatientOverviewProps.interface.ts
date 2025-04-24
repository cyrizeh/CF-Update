import { EPatientCreationStep, OnboardingStatusResponse, PatientStatus } from '../Patients.enum';
import { PaymentType } from '../PaymentType.enum';
import { BillingStartDateHistoryItem } from './BillingStartDateHistoryItem.type';
import { TNotes } from './Notes.type';
import { OnboardingType } from './OnBoardingType.type';
import { PatientDocumentInfo } from './PatientDocumentInfo.type';
import { PaymentDateSource } from './PatientPaymentDateSource.type';

export interface PatientOverviewProps {
  patient: PatientPersonalDetails;
  refetchPatientInfo?: (id: any, options?: any) => void;
  isReadonly?: boolean;
  isAccountAdmin?: boolean;
  userRole?: string;
  requests?: any[];
  terminationDocuments?: any[];
  terminationRequests?: any[];
}

export interface PatientPersonalDetails {
  billingStartDateHistory: BillingStartDateHistoryItem[];
  id: string;
  clinicId: string;
  firstName: string;
  clinicName: string;
  middleName: string;
  lastName: string;
  email: string;
  alternativeEmail: string;
  emergencyContact?: PatientEmergencyContact;
  dateOfBirth: string;
  phoneNumber: string;
  notes: TNotes[];
  address: PatientAddress;
  onboardingStatus: OnboardingStatusResponse;
  patientStatus: PatientStatus;
  patientCreationStep: EPatientCreationStep;
  partner: PatientPartnerDetails;
  locations: PatientLocation[];
  specimens: PatientSpecimen[];
  canes: PatientCane[];
  activities: PatientActivity[];
  documents: PatientDocumentInfo[];
  pastCharges: PatientCharge[];
  upcomingCharges: PatientCharge[];
  transportations?: PatientTransportation[];
  patientType: string;
  created?: string;
  billingStartDate?: string;
  paymentDateSource?: PaymentDateSource;
  specimenReceivedDate?: string;
  specimenTypes?: string[];
  numberOfCanes?: number;
  donorType?: string;
  isTheSameClinicWithPatient?: boolean;
  partnerClinicName?: string;
  witnessId?: string;
  witnessName?: string;
  onboardingType?: OnboardingType;
  accountStatus?: PatientAccountStatus;
  subscriptionType?: string;
  hasLoggedIn?: boolean;
  userId: string | null;
  isPrimaryPayer?: boolean;
  hasReactiveSpecimens?: boolean;
}

export interface PatientEmergencyContact {
  name: string;
  email: string;
  address: string;
}

export interface PatientAddress {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PatientPartnerDetails {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address: PatientAddress;
}

export interface PatientLocation {
  id: string;
  name: string;
  address: PatientAddress;
}

export interface PatientSpecimen {
  id: string;
  tissueType: string;
  numberOfStraws: number;
  numberOfCanes: number;
  freezeDate: string;
  idLabResult: string;
  clinicName: string;
  facilityName: string;
}

export interface PatientCane {
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

export interface PatientActivity {
  type: string;
  description: string;
  occurredDate: string;
}

export interface PatientCharge {
  name: string;
  serviseType: string;
  date: string;
  formattedAmount: string;
  status: string;
  type?: PaymentType;
  // todo add correct types
  specimenType?: string;
  billingCriteria?: string;
}

export interface PatientTransportation {
  orderNumber: string;
  created: string;
  sendingClinic: string;
  receivingClinic: string;
  payer: string;
  status: string;
}

export enum PatientAccountStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}
