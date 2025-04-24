import React, { createContext, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { getAccessToken } from '@/api/axiosConfig';

type PermissionsContextType = {
  userPermissions: string[];
  loading: boolean;
};

const PermissionsContext = createContext<PermissionsContextType>({
  userPermissions: [],
  loading: true,
});

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPermissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          const decodedToken: any = jwtDecode(accessToken);
          setPermissions(decodedToken.permissions || []);
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return <PermissionsContext.Provider value={{ userPermissions, loading }}>{children}</PermissionsContext.Provider>;
};

export const usePermissions = () => useContext(PermissionsContext);
