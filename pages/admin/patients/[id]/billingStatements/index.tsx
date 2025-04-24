import { AdminPatientBillingStatements } from '@/features/PatientOverview/components/BillingStatements/BillingStatements';
import { PatientChildrenProps, PatientProfilePageLayout } from '../index';

function PatientBillingByCyclePageLayout(props: PatientChildrenProps) {
  const { patient } = props;

  return <AdminPatientBillingStatements patient={patient} />;
}

PatientBillingByCyclePageLayout.getLayout = PatientProfilePageLayout;

export default PatientBillingByCyclePageLayout;
