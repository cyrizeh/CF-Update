import AccountCanes from '@/features/Specimens/AccountInventory/AccountCanes';
import AccountDevices from '@/features/Specimens/AccountInventory/AccountDevices';
import AccountSpecimens from '@/features/Specimens/AccountInventory/AccountSpecimens';
import ClinicCanes from '@/features/Specimens/ClinicInventory/ClinicCanes';
import ClinicDevices from '@/features/Specimens/ClinicInventory/ClinicDevices';
import ClinicSpecimens from '@/features/Specimens/ClinicInventory/ClinicSpecimens';
import useRole from '@/hooks/useRole';
import useToggleModal from '@/hooks/useToggleModal';
import PlusIcon from '@/public/icons/PlusIcon';
import { UserRole } from '@/types';
import { PatientStatus } from '@/types/Patients.enum';
import { PatientOverviewProps } from '@/types/view';
import {
  hasPermission,
  isUserAccountAdmin,
  isUserAdmin,
  isUserClinicAdmin,
  isUserGodAdmin,
  isUserPatient,
} from '@/utils';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';
import AddCaneDeviceModal from '../AddCaneDeviceModal/AddCaneDeviceModal';
import PatientCanes from '../Inventory/PatientCanes';
import PatientDevices from '../Inventory/PatientDevices';
import PatientSpecimens from '../Inventory/PatientSpecimens';
import PatientComponentLayout from '../PatientComponentLayout';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';
import AdminPatientsCanes from '@/features/Specimens/AdminPatientsCanes';
import AdminPatientsDevices from '@/features/Specimens/AdminPatientsDevices';
import AdminPatientsSpecimens from '@/features/Specimens/AdminPatientsSpecimens';

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

const renderTabs = (
  tabName: TabName,
  role: string,
  patientId: string,
  refetchPatientInfo: ((id: any, options?: any) => void) | undefined
) => {
  const tabComponents: Record<string, Record<TabName, JSX.Element>> = {
    cryoAdmin: {
      canes: (
        <AdminPatientsCanes withTransfers={false} patientIdProps={patientId} refetchPatientInfo={refetchPatientInfo} />
      ),
      devices: <AdminPatientsDevices withTransfers={false} patientIdProps={patientId} />,
      specimens: <AdminPatientsSpecimens patientIdProps={patientId} />,
    },
    clinicAdmin: {
      canes: <ClinicCanes withTransfers={false} patientIdProps={patientId} />,
      devices: <ClinicDevices withTransfers={false} patientIdProps={patientId} />,
      specimens: <ClinicSpecimens patientIdProps={patientId} />,
    },
    networkAdmin: {
      canes: <AccountCanes withTransfers={false} patientIdProps={patientId} />,
      devices: <AccountDevices patientIdProps={patientId} />,
      specimens: <AccountSpecimens patientIdProps={patientId} />,
    },
    patient: {
      canes: <PatientCanes />,
      devices: <PatientDevices />,
      specimens: <PatientSpecimens />,
    },
  };

  return tabComponents[role][tabName];
};

const getRole = (roles: UserRole[]): string | null => {
  if (isUserAdmin(roles) || isUserGodAdmin(roles)) return 'cryoAdmin';
  if (isUserClinicAdmin(roles)) return 'clinicAdmin';
  if (isUserAccountAdmin(roles)) return 'networkAdmin';
  if (isUserPatient(roles)) return 'patient';
  return null;
};

export const PatientInventorySection: React.FC<PatientOverviewProps> = ({
  patient,
  isReadonly,
  refetchPatientInfo,
}) => {
  const { t } = useTranslation('specimens');
  const { roles } = useRole();
  const adminRole = getRole(roles);
  const [activeTab, setActiveTab] = useState<TabName>(TABS.CANES);
  const [loading, setLoading] = useState<boolean>(false);
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();

  const { userPermissions } = usePermissions();
  const isUserCanCreateSpecimens =
    !isReadonly &&
    hasPermission(userPermissions, 'create:specimens') &&
    patient.patientStatus === PatientStatus.Created;

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
        {isUserCanCreateSpecimens && (
          <AddCaneDeviceModal
            isOpen={isModalOpen}
            onClose={() => {
              onCloseModal();
            }}
            patient={patient}
            refetchPatientInfo={refetchPatientInfo}
          />
        )}
        <div className="flex items-center justify-between">
          <p className=" mb-5 text-2xl font-normal text-white">{t('title')}</p>
          {isUserCanCreateSpecimens ? (
            <Button gradientDuoTone="primary" onClick={onOpenModal}>
              <div className="mr-2">
                <PlusIcon />
              </div>
              {t('modal.addCane')}
            </Button>
          ) : null}
        </div>

        {adminRole && (
          <div className="mb-4 flex h-6 flex-row gap-8 text-sm font-medium leading-[150%] text-[#F9FAFB]">
            {Object.values(TABS).map(tabName => (
              <div
                key={tabName}
                className={getTabClassName(activeTab, tabName)}
                onClick={() => handleTabClick(tabName)}>
                {t(tabName)}
              </div>
            ))}
          </div>
        )}
        {loading ? (
          <div className="flex h-[385px] w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-sm text-white">
              <Spinner size="sm" className="mt-[-1px]" /> Loading...
            </div>
          </div>
        ) : adminRole ? (
          renderTabs(activeTab, adminRole, patient?.id, refetchPatientInfo)
        ) : null}
      </div>
    </PatientComponentLayout>
  );
};
