import { AccountRoute } from '@/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AccountAdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push(AccountRoute.Overview);
  }, [router]);

  return <></>;
}
