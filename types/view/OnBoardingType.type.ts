export enum OnboardingType {
  FullOnboard = 'FullOnboard',
  PaymentsOnboardPlusLogin = 'PaymentsOnboardPlusLogin',
  JustPatientLogin = 'JustPatientLogin',
  NoLoginOnboarding = 'NoLoginOnboarding',
  ExistingPatient ='ExistingPatient'
}

export const onboardingDescriptions: Record<OnboardingType, string> = {
  [OnboardingType.FullOnboard]: "Full onboard (documents, payments, login)",
  [OnboardingType.PaymentsOnboardPlusLogin]: "Payments onboard + login",
  [OnboardingType.JustPatientLogin]: "Just patient login",
  [OnboardingType.NoLoginOnboarding]: "No patient login",
  [OnboardingType.ExistingPatient]: "Existing patient", 

};

export const OnboardingStep = {
  DataConfirmation: 'DataConfirmationStep',
  StoragePlanSelection: 'StoragePlanSelectionStep',
  EppAddon: 'EppAddonStep',
  PaymentMethodAssignment: 'PaymentMethodAssignmentStep',
};