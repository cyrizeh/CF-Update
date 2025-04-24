import ClinicBilling from '@/features/Clinics/ClinicBiling/ClinicBiling';
import { ClinicPageLayout } from '../index';

function ClinicBillingPage(props: any) {
  return <ClinicBilling {...props} />;
}

ClinicBillingPage.getLayout = ClinicPageLayout;

export default ClinicBillingPage;
