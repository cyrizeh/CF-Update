import { Clinic } from "./Clinic.interface";

export type OnboardingDocuments = {
  clinic: Clinic;
  updateClinics: (data?: Clinic) => Promise<Clinic | undefined>;
}