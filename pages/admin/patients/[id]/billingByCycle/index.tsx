import BillingByCycle from '@/features/PatientOverview/components/BillingByCycle/BillingByCycle';
import { PatientChildrenProps, PatientProfilePageLayout } from '../index';

function PatientBillingByCyclePageLayout(props: PatientChildrenProps) {
  const { patient } = props;

  return <BillingByCycle patient={patient} />;
}

PatientBillingByCyclePageLayout.getLayout = PatientProfilePageLayout;

export default PatientBillingByCyclePageLayout;
