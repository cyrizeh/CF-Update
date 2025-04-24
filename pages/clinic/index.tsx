import { ClinicRoute } from '@/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ClinicAdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push(ClinicRoute.Overview);
  }, [router]);

  return <></>;
}
