import { PatientDocument } from "./PatientDocument.type";

export type OnboardingStep = {
  type: string;
  id: string;
  onboardingId: string;
  status: string;
  patientDocument: PatientDocument;
  name: string;
  description: string;
  videoUrl: string;
  order: number;
};

export enum OnboardingStepType {
  DocumentSigningStep = 'DocumentSigningStep',
  StoragePlanSelectionStep = 'StoragePlanSelectionStep',
  ServiceGuaranteeStep = 'ServiceGuaranteeStep',
  EppAddonStep = 'EppAddonStep',
  PaymentMethodAssignmentStep = 'PaymentMethodAssignmentStep',
}