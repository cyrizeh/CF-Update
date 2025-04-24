import ClinicOverview from '@/features/Clinics/ClinicOverview/ClinicOverview';
import { useGetUsers } from '@/api/queries/user.queries';

export default function ClinicGeneralPage() {
  const { data: usersData } = useGetUsers();

  return <ClinicOverview clinicId={usersData?.clinicId} userRole={usersData?.role} />;
}
