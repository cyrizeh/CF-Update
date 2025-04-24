import { AccountRoute, AdminRoute, ClinicRoute } from '@/types';

// Cryo Admin

export const buildAdminCaneDetailsPageRoute = (id: string): string => `${AdminRoute.Inventory}/caneDetails/${id}`;
export const buildAdminCanesPageRoute = (): string => `${AdminRoute.Inventory}/canes`;
export const buildAdminDevicesPageRoute = (): string => `${AdminRoute.Inventory}/devices`;
export const buildAdminSpecimensPageRoute = (): string => `${AdminRoute.Inventory}/specimens`;

export const buildAdminClinicDetailsPageRoute = (id: string): string => `${AdminRoute.Clinics}/${id}/general`;
export const buildAdminFacilityDetailsPageRoute = (id: string): string => `${AdminRoute.Facilities}/${id}`;
export const buildAdminInitialTransferDetailsPageRoute = (id: string): string => `${AdminRoute.TransferIn}/${id}`;
export const buildAdminOverviewPatientPageRoute = (id: string): string => `${AdminRoute.Patients}/${id}`;
export const buildAdminGeneralPatientPageRoute = (id: string): string => `${AdminRoute.Patients}/${id}/general`;

export const buildAdminBillingPatientPageRoute = (id: string): string => `${AdminRoute.Patients}/${id}/billing`;
export const buildAdminBillingByCyclePatientPageRoute = (id: string): string =>
  `${AdminRoute.Patients}/${id}/billingByCycle`;
export const buildAdminBillingStatementsPatientPageRoute = (id: string): string =>
  `${AdminRoute.Patients}/${id}/billingStatements`;
  export const buildAdminOnboardingPatientPageRoute = (id: string): string =>
  `${AdminRoute.Patients}/${id}/onboarding/confirm-details`;
export const buildCommunicationsPageRoute = (id: string): string =>
  `${AdminRoute.Patients}/${id}/communications`;
export const buildAdminBillingStatementDownloadPatientPageRoute = (patientId: string, documentId: string): string =>
  `${AdminRoute.Patients}/${patientId}/billingStatements/${documentId}`;
export const buildAdminPickListDetailsPageRoute = (id: string): string => `${AdminRoute.PickList}/${id}`;
export const buildAdminPricingPlanDetailsPageRoute = (id: string): string => `${AdminRoute.PricingPlans}/${id}`;
export const buildAdminAddPricingPlanPageRoute = (): string => `${AdminRoute.PricingPlans}/create`;
// Clinic Admin

export const buildClinicAdminPatientDetailsPageRoute = (id: string): string => `${ClinicRoute.Patients}/${id}`;
export const buildClinicAdminInitialTransferDetailsPageRoute = (id: string): string =>
  `${ClinicRoute.TransferIn}/${id}`;
export const buildClinicAdminCaneDetailsPageRoute = (id: string): string =>
  `${ClinicRoute.Inventory}/caneDetails/${id}`;

export const buildClinicCanesPageRoute = (): string => `${ClinicRoute.Inventory}/canes`;
export const buildClinicDevicesPageRoute = (): string => `${ClinicRoute.Inventory}/devices`;
export const buildClinicSpecimensPageRoute = (): string => `${ClinicRoute.Inventory}/specimens`;
export const buildClinicPatientProfilePageRoute = (id: string): string => `${ClinicRoute.Patients}/${id}`;
export const buildClinicPickListDetailsPageRoute = (id: string): string => `${ClinicRoute.PickList}/${id}`;
export const buildClinicClinicPageRoute = (): string => `${ClinicRoute.Overview}`;

// Account Admin

export const buildAccountCanesPageRoute = (): string => `${AccountRoute.Inventory}/canes`;
export const buildAccountDevicesPageRoute = (): string => `${AccountRoute.Inventory}/devices`;
export const buildAccountSpecimensPageRoute = (): string => `${AccountRoute.Inventory}/specimens`;
export const buildAccountPatientProfilePageRoute = (id: string): string => `${AccountRoute.Patients}/${id}`;
export const buildAccountClinicProfilePageRoute = (id: string): string => `${AccountRoute.Clinics}/clinics/${id}`;
export const buildAccountPickListDetailsPageRoute = (id: string): string => `${AccountRoute.PickList}/${id}`;
export const buildNetworkAdminCaneDetailsPageRoute = (id: string): string =>
  `${AccountRoute.Inventory}/caneDetails/${id}`;

// Other
export const buildTransferServiceGuarantee = () => 'https://cryofuture.com/sg-terms/';
