import ClinicOverview from '@/features/Clinics/ClinicOverview/ClinicOverview';
import { useRouter } from 'next/router';

export default function ClinicGeneralPage() {
  const { query } = useRouter();

  return <ClinicOverview clinicId={query?.id as string} />;
}
