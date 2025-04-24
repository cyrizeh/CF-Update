import { useGetPatientsById } from '@/api/queries/patient.queries';

import Billing from '@/features/PatientOverview/Billing/Billing';
import Overview from '@/features/PatientOverview/PatientOverview';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { hasPermission, isSmallScreen, isUserClinicAdmin } from '@/utils';
import { useGetUsers } from '@/api/queries/user.queries';
import { Button, Spinner } from 'flowbite-react';
import { PatientStatus } from '@/types/Patients.enum';
import AddNewPatientModal from '../CreatePatientModal/CreatePatientModal';
import useToggleModal from '@/hooks/useToggleModal';
import useRole from '@/hooks/useRole';
import { useGetClinicById } from '@/api/queries/clinic.queries';
import { Clinic } from '@/types/view';
import { ViewTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { toPascalCase } from '@/utils/toPascalCase';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';
import { Communications } from '@/features/PatientOverview/components/Communications/Communications';

function PatientOverview() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { data: usersData } = useGetUsers();
  const [responseError, setResponseError] = useState<ViewTypes.ResponseError>();
  const isReadonly = usersData?.role === 'ClinicAdmin' || usersData?.role === 'AccountAdmin';
  const { userPermissions } = usePermissions();
  const isUserCanCreatePatients = hasPermission(userPermissions, 'create:patients');
  const { roles } = useRole();
  const isClinicAdmin = isUserClinicAdmin(roles);
  const {
    data: patient,
    mutate: refetchPatientInfo,
    isLoading,
    error,
  } = useGetPatientsById(router?.query?.id as string);
  const { data: clinic } = useGetClinicById(isClinicAdmin ? (usersData?.clinicId as string) : '');
  const [clinicData, setClinicData] = useState<Clinic | null>(null);

  const [activeTab, setActiveTab] = useState('General');

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const getTabClassName = (tabName: string) => {
    return activeTab === tabName
      ? 'border-blue-600 cursor-pointer border-b-[1px] text-transparent bg-clip-text bg-gradient-to-r from-cryo-blue to-cryo-cyan font-medium'
      : '';
  };

  const {
    onOpenModal: onOpenCompletePatientModal,
    isModalOpen: isCompletePatientModalOpen,
    onCloseModal: onCloseCompletePatientModal,
  } = useToggleModal();

  useEffect(() => {
    if (clinic) {
      setClinicData(clinic);
    }
  }, [clinic]);

  useEffect(() => {
    if (error) {
      //@ts-ignore
      setResponseError(error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <div className="mb-44">
            <Spinner size="sm" className="mr-2 mt-[-1px]" />
            {t('loadingWithDots')}
          </div>
        </div>
      </div>
    );
  }

  if (responseError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-xl text-white">
        <p className="mb-44">
          {responseError.response?.status === 403
            ? t('forbiddenErrorMessage')
            : `${t('commonErrorMessage')} ${responseError.message}`}
        </p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <p className="mb-44">{t('noData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isUserCanCreatePatients && (
        <AddNewPatientModal
          isOpen={isCompletePatientModalOpen}
          onClose={onCloseCompletePatientModal}
          patientCreationStep={patient?.patientCreationStep}
          patient={patient}
          refetchPatientData={refetchPatientInfo}
          clinicData={clinicData || undefined}
        />
      )}
      {!isSmallScreen() && (
        <div className="flex items-end justify-between md:mb-10">
          <h1 className="sensitive w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent ">
            {toPascalCase(`${patient?.firstName || ''} ${patient?.middleName || ''} ${patient?.lastName || ''}`)}
          </h1>

          {patient?.patientStatus === PatientStatus.Draft &&
            isUserCanCreatePatients &&
            patient?.patientType === 'Storage' &&
            isClinicAdmin &&
            !patient?.isSignup && (
              <Button gradientDuoTone="primary" onClick={onOpenCompletePatientModal}>
                Complete profile
              </Button>
            )}
        </div>
      )}

      {usersData?.role === 'AccountAdmin' ? (
        <Overview patient={patient} refetchPatientInfo={refetchPatientInfo} isReadonly={isReadonly} />
      ) : (
        <>
          <div className="mb-4 flex h-6 flex-row gap-8 text-sm font-medium leading-[150%] text-[#F9FAFB]">
            <div className={getTabClassName('General')} onClick={() => handleTabClick('General')}>
              General
            </div>

            <div className={getTabClassName('Billing')} onClick={() => handleTabClick('Billing')}>
              Billing
            </div>
            <div className={getTabClassName('Communications')} onClick={() => handleTabClick('Communications')}>
              Communications
            </div>
          </div>

          {activeTab === 'General' ? (
            <Overview patient={patient} refetchPatientInfo={refetchPatientInfo} isReadonly={isReadonly} />
          ) : activeTab === 'Billing' ? (
            <Billing patient={patient} isReadonly={isReadonly} refetchPatientInfo={refetchPatientInfo} />
          ) : (
            <Communications patient={patient} />
          )}
        </>
      )}
    </div>
  );
}

export default PatientOverview;
