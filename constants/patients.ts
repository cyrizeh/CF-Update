export const DonorType = [
  { value: 'Donor', label: 'Donor' },
  { value: 'Autologous', label: 'Autologous' },
];
// Todo: Check if we need to update this list
export const PatientSpecimenTypes = [
  { value: 'Sperm', label: 'Sperm' },
  { value: 'Oocyte', label: 'Oocyte' },
  { value: 'Embryos', label: 'Embryos' },
  { value: 'OvarianTissue', label: 'Ovarian Tissue' },
  { value: 'TesticularTissue', label: 'Testicular Tissue' },
  { value: 'DonorEmbryos', label: 'Donor Embryos' },
  { value: 'DonorEggs', label: 'Donor Eggs' },
  { value: 'DonorSperm', label: 'Donor Sperm' },
  { value: 'Other', label: 'Other' },
];

export const TissueType = [
  { value: 'Sperm', label: 'Sperm' },
  { value: 'OocytesEggs', label: 'Oocytes/Eggs' },
  { value: 'Embryos', label: 'Embryos' },
  { value: 'OvarianTissue', label: 'Ovarian Tissue' },
  { value: 'TesticularTissue', label: 'Testicular Tissue' },
  { value: 'DonorEmbryos', label: 'Donor Embryos' },
  { value: 'DonorOocytesEggs', label: 'Donor Oocytes/Eggs' },
  { value: 'DonorSperm', label: 'Donor Sperm' },
  { value: 'Other', label: 'Other' },
];

export const OnboardingStatus = [
  { value: 'NotStarted', label: 'Not Started' },
  { value: 'Onboarding', label: 'Onboarding' },
  { value: 'DocumentsSigned', label: 'Documents Signed' },
  { value: 'PlanSelected', label: 'Plan Selected' },
  { value: 'Onboarded', label: 'Onboarded' },
];

export const BilledTo = [
  { value: 'Patient', label: 'Patient' },
  { value: 'Clinic', label: 'Clinic' },
];

export const BillingStatus = [
  { value: 'Unpaid', label: 'Unpaid' },
  { value: 'Paid', label: 'Paid' },
];

export const IdLabType = [
  { value: 'NonReactive', label: 'Non Reactive' },
  { value: 'Reactive', label: 'Reactive' },
  { value: 'Incomplete Testing', label: 'Incomplete Testing' },
];

export const ShipmentTypes = [
  { value: 'LocalCfRoad', label: 'Local CF Road' },
  { value: 'ThirdPartyCourierRoad', label: '3rd Party Courier Road' },
  { value: 'ThirdPartyAirCourier', label: '3rd Party Air Courier' },
  { value: 'Other', label: 'Other' },
];

export const TransportationMethod = [
  { label: 'Air', value: 'Air' },
  { label: 'Road', value: 'Road' },
];
