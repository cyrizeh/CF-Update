import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { UserRole } from "@/types";

const useRole = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const roles = user['.roles'];
      if (Array.isArray(roles)) {
        setRoles(roles);
      }
    }
  }, [user]);

  return { roles };
};

export default useRole;
