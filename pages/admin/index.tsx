import { AdminRoute } from '@/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push(AdminRoute.Overview);
  }, [router]);

  return <></>;
}
