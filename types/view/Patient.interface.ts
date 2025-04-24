import { OnboardingStatusResponse, PatientStatus } from '../Patients.enum';

export interface Patient {
  specimenTypes: any;
  clinicName: string | null;
  clinicId: string | null;
  facilityName: string | null;
  firstName: string | null;
  freezeDate: string | null;
  lastName: string | null;
  middleName: string | null;
  paymentType: string | null;
  rfid: string | null;
  specimen: string | null;
  onboardingStatus: OnboardingStatusResponse;
  patientStatus: PatientStatus;
  id: string;
  firstAndLast?: string | null;
  facilityId: string | null;
  email?: string | null;
  fullName: string | null;
}
