import PatientOverview from '@/features/PatientOverview/PatientOverview';
import { PatientChildrenProps, PatientProfilePageLayout } from '../index';

function OverviewPatientGeneralPageLayout(props: PatientChildrenProps) {
  const { patient, refetchPatientInfo, isReadonly, terminationRequests: specimenTerminations } = props;
  return (
    <PatientOverview
      patient={patient}
      refetchPatientInfo={refetchPatientInfo}
      isReadonly={isReadonly}
      terminationRequests={specimenTerminations}
    />
  );
}

OverviewPatientGeneralPageLayout.getLayout = PatientProfilePageLayout;

export default OverviewPatientGeneralPageLayout;
