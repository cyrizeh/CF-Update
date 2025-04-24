import { useGetPatientsById } from '@/api/queries/patient.queries';
import { useGetTerminationRequests } from '@/api/queries/termination.queries';
import {
  buildAdminBillingByCyclePatientPageRoute,
  buildAdminBillingPatientPageRoute,
  buildAdminBillingStatementsPatientPageRoute,
  buildAdminGeneralPatientPageRoute,
  buildAdminOnboardingPatientPageRoute,
  buildCommunicationsPageRoute,
} from '@/constants/buildRoutes';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';
import { NotFound } from '@/features/NotFound/NotFound';
import PatientRouteTabs from '@/features/PatientOverview/components/PatientTabs/PatientTabs';
import AddNewPatientModal from '@/features/Patients/CreatePatientModal/CreatePatientModal';
import useRole from '@/hooks/useRole';
import useToggleModal from '@/hooks/useToggleModal';
import { PatientSubscriptionType } from '@/types/api/Responses/PatientResponse.type';
import { PatientStatus } from '@/types/Patients.enum';
import { TerminationRequest } from '@/types/view';
import { OnboardingType } from '@/types/view/OnBoardingType.type';
import { hasPermission, isSmallScreen, isUserAccountAdmin, isUserClinicAdmin } from '@/utils';
import { toPascalCase } from '@/utils/toPascalCase';
import { Button, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export type PatientChildrenProps = {
  patient: any;
  refetchPatientInfo: any;
  isReadonly: boolean;
  terminationRequests: TerminationRequest[] | undefined;
};

const LayoutWithNoSSR = dynamic(() => import('@/components/Layout/Layout'), { ssr: false });

const PatientProfilePage = () => {
  return null;
};

export const NestedLayout = ({ children }: any) => {
  const router = useRouter();
  const { userPermissions } = usePermissions();
  const { t } = useTranslation();
  const isUserCanCreatePatients = hasPermission(userPermissions, 'create:patients');
  const { roles } = useRole();
  const isClinicAdmin = isUserClinicAdmin(roles);
  const isNetworkAdmin = isUserAccountAdmin(roles);
  const isReadonly = isClinicAdmin || isNetworkAdmin;
  const [specimenTerminations, setSpecimenTerminations] = useState<TerminationRequest[]>();

  const {
    data: patient,
    mutate: refetchPatientInfo,
    isLoading,
    error,
  } = useGetPatientsById(router?.query?.id as string);
  const { data: terminationRequests } = useGetTerminationRequests({});

  useEffect(() => {
    setSpecimenTerminations(terminationRequests?.items?.filter((request: any) => request.patientId === patient?.id));
  }, [patient, terminationRequests]);

  const {
    onOpenModal: onOpenAddNewPatientModal,
    isModalOpen: isAddNewPatientModalOpen,
    onCloseModal: onCloseAddNewPatientModal,
  } = useToggleModal();

  const patientTabs = [
    {
      key: 'general',
      name: 'General',
      url: buildAdminGeneralPatientPageRoute(router?.query?.id as string),
      show: true,
    },
    {
      key: 'billing',
      name: 'Billing',
      url: buildAdminBillingPatientPageRoute(router?.query?.id as string),
      show: true,
    },
    {
      key: 'billingByCycle',
      name: 'Billing Cycles',
      url: buildAdminBillingByCyclePatientPageRoute(router?.query?.id as string),
      show: patient?.subscriptionType === PatientSubscriptionType.PerCycle,
    },
    {
      key: 'billingStatements',
      name: 'Billing Statements',
      url: buildAdminBillingStatementsPatientPageRoute(router?.query?.id as string),
      show: true,
    },
    {
      key: 'communications',
      name: 'Communications',
      url: buildCommunicationsPageRoute(router?.query?.id as string),
      show: true,
    },
    {
      key: 'onboarding',
      name: 'Onboarding',
      url: buildAdminOnboardingPatientPageRoute(router?.query?.id as string),
      show: patient?.onboardingType === OnboardingType.ExistingPatient,
    },
  ].filter(tab => !!tab.show);

  const childrenProps: PatientChildrenProps = {
    patient,
    refetchPatientInfo,
    isReadonly,
    terminationRequests: specimenTerminations,
  };

  if (isLoading) {
    return (
      <LayoutWithNoSSR>
        <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-sm text-white">
            <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
          </div>
        </div>
      </LayoutWithNoSSR>
    );
  }

  if (error && error?.response?.status == NOT_FOUND_STATUS_CODE) {
    return (
      <LayoutWithNoSSR>
        <NotFound text={t('notFound:patientNotFound')} />
      </LayoutWithNoSSR>
    );
  }

  return (
    <LayoutWithNoSSR>
      <div className="flex flex-col gap-4 md:gap-8">
        <AddNewPatientModal
          isOpen={isAddNewPatientModalOpen}
          onClose={onCloseAddNewPatientModal}
          patientCreationStep={patient?.patientCreationStep}
          patient={patient}
          refetchPatientData={refetchPatientInfo}
        />

        {!isSmallScreen() && (
          <div className="flex items-end justify-between md:mb-10">
            <h1 className="sensitive w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent ">
              {toPascalCase(`${patient?.firstName || ''} ${patient?.middleName || ''} ${patient?.lastName || ''}`)}
            </h1>
            <div>
              {patient?.patientStatus === PatientStatus.Draft &&
                isUserCanCreatePatients &&
                patient?.patientType === 'Storage' &&
                !patient?.isSignup && (
                  <Button gradientDuoTone="primary" onClick={onOpenAddNewPatientModal}>
                    Complete profile
                  </Button>
                )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between">
          <PatientRouteTabs patientTabs={patientTabs} />
        </div>

        {React.cloneElement(children, childrenProps)}
      </div>
    </LayoutWithNoSSR>
  );
};

export const PatientProfilePageLayout = (page: any) => <NestedLayout>{page}</NestedLayout>;

PatientProfilePage.getLayout = PatientProfilePageLayout;

export default PatientProfilePage;
