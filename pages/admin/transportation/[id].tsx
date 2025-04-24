import { useGetPatientsById } from '@/api/queries/patient.queries';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';
import { TransportationContextProvider } from '@/contexts/TransportationContext';
import { NotFound } from '@/features/NotFound/NotFound';
import PatientTransportationOverview from '@/features/PatientOverview/PatientTransportationOverview';
import MergeTranspPatientToStoragePatientModal from '@/features/Transportation/MergeTranspPatientToStoragePatientModal/MergeTranspPatientToStoragePatientModal';
import useRole from '@/hooks/useRole';
import useToggleModal from '@/hooks/useToggleModal';
import { isUserAdmin, isUserGodAdmin } from '@/utils';
import { toPascalCase } from '@/utils/toPascalCase';
import { Button, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

export default function OverviewPage() {
  const router = useRouter();
  const { t } = useTranslation('patients');

  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);

  const {
    data: patient,
    mutate: refetchPatientInfo,
    isLoading,
    error,
  } = useGetPatientsById(router?.query?.id as string);

  const {
    isModalOpen: isMergeModalOpen,
    onCloseModal: onCloseMergeModal,
    onOpenModal: onOpenMergeModal,
  } = useToggleModal();

  if (isLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  if (error && error?.response?.status == NOT_FOUND_STATUS_CODE) {
    return <NotFound text={t('notFound:transportationPatientNotFound')} />;
  }

  return (
    <TransportationContextProvider>
      <MergeTranspPatientToStoragePatientModal
        isOpen={isMergeModalOpen}
        onClose={onCloseMergeModal}
        refetchPatientData={refetchPatientInfo}
      />
      {
        <div className="flex flex-wrap-reverse items-center justify-center gap-4 sm:mb-10 sm:justify-between">
          <h1 className="sensitive w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light leading-[60px] text-transparent lg:text-5xl ">
            {toPascalCase(`${patient?.firstName || ''} ${patient?.middleName || ''} ${patient?.lastName || ''}`)}
          </h1>
          {isCryoAdmin && patient?.patientType === 'Transportation' && (
            <Button gradientDuoTone="primary" onClick={onOpenMergeModal}>
              {t('mergeToStoragePatient')}
            </Button>
          )}
        </div>
      }
      {patient && (
        <PatientTransportationOverview patient={patient} refetchPatientInfo={refetchPatientInfo} userRole={'Admin'} />
      )}
    </TransportationContextProvider>
  );
}
