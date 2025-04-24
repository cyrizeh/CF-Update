import { ClinicPageLayout } from '../index';
import ClinicGeneral from '@/features/Clinics/ClinicGeneral/ClinicGeneral';

function ClinicGeneralPage(props: any) {
  return <ClinicGeneral {...props} />;
}

ClinicGeneralPage.getLayout = ClinicPageLayout;

export default ClinicGeneralPage;
