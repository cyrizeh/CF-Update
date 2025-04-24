import PatientBilling from '@/features/PatientOverview/Billing/Billing';
import { PatientChildrenProps, PatientProfilePageLayout } from '../index';

function PatientBillingPageLayout(props: PatientChildrenProps) {
  const { patient, isReadonly, refetchPatientInfo } = props;
  return <PatientBilling patient={patient} isReadonly={isReadonly} refetchPatientInfo={refetchPatientInfo} />;
}

PatientBillingPageLayout.getLayout = PatientProfilePageLayout;

export default PatientBillingPageLayout;
