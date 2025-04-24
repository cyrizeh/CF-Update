import useCryoGatVersion from '@/api/mutations/useCryoGatVersion';
import useRole from '@/hooks/useRole';
import { isUserAdmin, isUserGodAdmin } from '@/utils';
import { isNumber } from 'lodash';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type CryoGattContextType = {
  canUseScanner: boolean;
};

const CryoGattContext = createContext<CryoGattContextType>(undefined!);

export const CryoGattProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [canUseScanner, setCanUseScanner] = useState(false);
  const { roles } = useRole();

  const { getCryoGattVersion } = useCryoGatVersion();

  useEffect(() => {
    if (roles) {
      const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);

      if (isCryoAdmin) {
        getCryoGattVersion.trigger().then(res => {
          const CryoGattData = res?.data;
          if (CryoGattData) {
            const { Major, Minor } = CryoGattData;

            // Convert values to float for accurate comparison
            const majorFloat = isNumber(Major) ? parseFloat(Major.toFixed(1)) : 0;
            const minorFloat = isNumber(Minor) ? parseFloat(Minor.toFixed(1)) : 0;

            // Check if Major or Minor is equesl/greater than 2.0
            if (majorFloat >= 2.0 && minorFloat >= 2.0) {
              setCanUseScanner(true);
            } else {
              setCanUseScanner(false);
            }
          }
        });
      }
    }
  }, [roles]);

  return <CryoGattContext.Provider value={{ canUseScanner }}>{children}</CryoGattContext.Provider>;
};

export const useCryoGattContext = () => useContext(CryoGattContext);
