import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';

interface UserInfo {
  userId: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  sid: string;
  sub: string;
  email_verified: boolean;
}

const useGetCurrentUser = () => {
  const [userData, setUserData] = useState<UserInfo | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const userData = {
        userId: user['.user-id'] as string,
        name: user?.['.name'] as string,
        email: user?.email as string,
        roles: user?.['.roles'] as string[],
        permissions: user?.['.permissions'] as string[],
        sid: user?.sid as string,
        sub: user?.sub as string,
        email_verified: user?.email_verified as boolean,
      };
      setUserData(userData);
    }
  }, [user]);

  return { userData };
};

export default useGetCurrentUser;
