/* eslint-disable no-unused-vars */
export enum OnboardingStatusResponse {
  NotStarted = 'NotStarted',
  Onboarding = 'Onboarding',
  Onboarded = 'Onboarded',
  DocumentsSigned = 'DocumentsSigned',
  PlanSelected = 'PlanSelected',
}
// Todo correct rename this enum
export enum OnboardingStatus {
  NotStarted = 'Not Started',
  Onboarding = 'Onboarding',
  Onboarded = 'Onboarded',
  DocumentsSigned = 'Documents Signed',
  PlanSelected = 'Plan Selected',
}

export enum PatientStatus {
  Draft = 'Draft',
  Created = 'Created',
}

export enum EPatientCreationStep {
  MainInfoAssigned = 'MainInfoAssigned',
  EmergencyContactAssigned = 'EmergencyContactAssigned',
  BillingInformationAssigned = 'BillingInformationAssigned',
  DonorInformationAssigned = 'DonorInformationAssigned',
}

export enum RequestCreationStep {
  PatientAssigned = 'PatientAssigned',
  PartnerAssigned = 'PartnerAssigned',
  FacilityAssigned = 'FacilityAssigned',
  SendingClinicAssigned = 'SendingClinicAssigned',
  ReceivingClinicAssigned = 'ReceivingClinicAssigned',
  DistanceUpdated = 'DistanceUpdated',
  SpecimenDetailsAssigned = 'SpecimenDetailsAssigned',
  TransportationDetailsAssigned = 'TransportationDetailsAssigned',
}

export const PatientOnboardingStatus: Record<OnboardingStatusResponse, OnboardingStatus> = {
  [OnboardingStatusResponse.NotStarted]: OnboardingStatus.NotStarted,
  [OnboardingStatus.Onboarded]: OnboardingStatus.Onboarded,
  [OnboardingStatus.Onboarding]: OnboardingStatus.Onboarding,
  [OnboardingStatusResponse.DocumentsSigned]: OnboardingStatus.DocumentsSigned,
  [OnboardingStatusResponse.PlanSelected]: OnboardingStatus.PlanSelected,
};

export const PatientOnboardingColor: Record<OnboardingStatusResponse, string> = {
  [OnboardingStatusResponse.NotStarted]: 'yellow-100',
  [OnboardingStatus.Onboarded]: 'violet-300',
  [OnboardingStatus.Onboarding]: 'green-300',
  [OnboardingStatusResponse.DocumentsSigned]: 'green-300',
  [OnboardingStatusResponse.PlanSelected]: 'green-300',
};
