import PatientCanes from '@/features/PatientOverview/components/Inventory/PatientCanes';
import PatientDevices from '@/features/PatientOverview/components/Inventory/PatientDevices';
import PatientSpecimens from '@/features/PatientOverview/components/Inventory/PatientSpecimens';
import PatientComponentLayout from '@/features/PatientOverview/components/PatientComponentLayout';
import { UserRole } from '@/types';
import { isUserAccountAdmin, isUserAdmin, isUserClinicAdmin, isUserGodAdmin, isUserPatient } from '@/utils';
import { Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';

const TABS = {
  CANES: 'canes',
  DEVICES: 'devices',
  SPECIMENS: 'specimens',
} as const;

type TabName = (typeof TABS)[keyof typeof TABS];

const getTabClassName = (activeTab: TabName, tabName: TabName): string => {
  return activeTab === tabName
    ? 'border-blue-600 cursor-pointer border-b-[1px] text-transparent bg-clip-text bg-gradient-to-r from-cryo-blue to-cryo-cyan font-medium'
    : '';
};

const renderTabs = (tabName: TabName) => {
  const tabComponents: Record<TabName, JSX.Element> = {
    canes: <PatientCanes />,
    devices: <PatientDevices />,
    specimens: <PatientSpecimens />,
  };

  return tabComponents[tabName];
};

const getRole = (roles: UserRole[]): string | null => {
  if (isUserAdmin(roles) || isUserGodAdmin(roles)) return 'cryoAdmin';
  if (isUserClinicAdmin(roles)) return 'clinicAdmin';
  if (isUserAccountAdmin(roles)) return 'networkAdmin';
  if (isUserPatient(roles)) return 'patient';
  return null;
};

export const PatientInventories = () => {
  const { t } = useTranslation('specimens');
  const [activeTab, setActiveTab] = useState<TabName>(TABS.CANES);
  const [loading, setLoading] = useState<boolean>(false);
  const handleTabClick = (tabName: TabName) => {
    setLoading(true);
    setActiveTab(tabName);
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, activeTab]);

  return (
    <PatientComponentLayout col>
      <div>
        <div className="mb-4 flex h-6 flex-row gap-8 text-sm font-medium leading-[150%] text-[#F9FAFB]">
          {Object.values(TABS).map(tabName => (
            <div key={tabName} className={getTabClassName(activeTab, tabName)} onClick={() => handleTabClick(tabName)}>
              {t(tabName)}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex h-[385px] w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-sm text-white">
              <Spinner size="sm" className="mt-[-1px]" /> Loading...
            </div>
          </div>
        ) : (
          renderTabs(activeTab)
        )}
      </div>
    </PatientComponentLayout>
  );
};
