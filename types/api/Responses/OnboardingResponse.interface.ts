import { OnboardingType } from "@/types/view/OnBoardingType.type";
import { OnboardingStep } from "../../view/OnboardingStep.type";

export interface OnboardingResponse {
  patientId: string;
  clinicId: string;
  status: string;
  currentStep: OnboardingStep;
  steps: OnboardingStep[];
  welcomeScreen: {
    title: string;
    description: string;
    videoUrl: string;
  }
  paymentScreen: {
    title: string;
    description: string;
    videoUrl: string;
  }
  thankYouScreen: {
    title: "string",
    description: "string",
    videoUrl: "string"
  },
  supportContact: {
    email: string,
    phoneNumber: string
  }
  paymentSetupStatus: "string",
  isPreTreatment: boolean;
  onboardingType: OnboardingType;
  showPlanSelection: boolean;
}
