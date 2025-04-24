import { Communications } from '@/features/PatientOverview/components/Communications/Communications';
import { PatientChildrenProps, PatientProfilePageLayout } from '../index';

function PatientCommunicationsPageLayout(props: PatientChildrenProps) {
  const { patient } = props;

  return <Communications patient={patient} />;
}

PatientCommunicationsPageLayout.getLayout = PatientProfilePageLayout;

export default PatientCommunicationsPageLayout;
