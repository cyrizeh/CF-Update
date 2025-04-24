import { useGetPatientInfo } from '@/api/queries/patient.queries';
import PatientProfile from '@/features/PatientOverview/PatientProfile';
import { Spinner, Button } from 'flowbite-react';
import { useGetOnboardingData } from '@/api/queries/onboarding.queries';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import useToggleModal from '@/hooks/useToggleModal';
import usePatientMutation from '@/api/mutations/usePatientMutation';
import EditPatientModal from './EditPatientModal';
import { Tooltip } from 'flowbite-react';
import { HiQuestionMarkCircle } from 'react-icons/hi';
import TerminationRequestModal from './TerminationRequestModal';
import { useGetPatientsTerminationRequests } from '@/api/queries/termination.queries';
import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { toPascalCase } from '@/utils/toPascalCase';
import router from 'next/router';
import { usePostHog } from 'posthog-js/react';

function OverviewPatientPage() {
  const { t } = useTranslation('terminations');
  const { data: patient, mutate } = useGetPatientInfo();
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const [specimenTerminations, setSpecimenTerminations] = useState([]);
  const [activeSpecimens, setActiveSpecimens] = useState([]);
  const [specimenTerminationTypes, setSpecimenTerminationTypes] = useState<string[]>([]);

  const {
    isModalOpen: isTerminationRequestModalOpen,
    onCloseModal: onCloseTerminationRequestModal,
    onOpenModal: onOpenTerminationRequestModal,
  } = useToggleModal();
  const { updatePatientDetails } = usePatientMutation('');

  const { data: onboardingData, isLoading } = useGetOnboardingData();

  const {
    data: terminationRequests,
    isLoading: isTerminationRequestLoading,
    mutate: refreshTerminationsRequests,
  } = useGetPatientsTerminationRequests({});

  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture('page_viewed', { page: 'overview' });
    }
  }, [posthog]);

  useEffect(() => {
    if (terminationRequests) {
      const term = terminationRequests.items.reduce((terminations: any, item: any) => {
        terminations.push(
          ...item.specimenTerminations.map((specimenTermination: any) => ({
            ...specimenTermination,
            terminationId: item.id,
          }))
        );

        return terminations;
      }, []);
      setSpecimenTerminations(term);
      setSpecimenTerminationTypes(term.map((item: any) => item.specimenType));
    }
  }, [terminationRequests]);

  useEffect(() => {
    setActiveSpecimens(patient?.specimenTypes.filter((type: string) => !specimenTerminationTypes.includes(type)) || []);
  }, [patient, specimenTerminationTypes]);

  const onClose = (isSubmitted?: boolean) => {
    if (isSubmitted) {
      mutate(undefined, { revalidate: true });
    }
    onCloseModal();
  };

  if (onboardingData?.status === 'NotStarted') {
    router.push(`/patient/onboarding`);
  }

  return onboardingData?.status !== 'NotStarted' && !isLoading ? (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <h1 className="sensitive w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-center text-5xl font-light leading-[60px] text-transparent md:mb-4">
          {toPascalCase(`${patient?.firstName || ''} ${patient?.middleName || ''} ${patient?.lastName || ''}`)}
        </h1>
        <div className="flex flex-row items-center justify-center">
          <Button size="sm" className="mr-2" gradientDuoTone="primary" onClick={onOpenModal}>
            {t('common:editProfile')}
          </Button>
          <div className="flex flex-row">
            <Button
              gradientDuoTone="primary"
              disabled={activeSpecimens.length === 0}
              outline
              size="sm"
              onClick={onOpenTerminationRequestModal}>
              {t('requestTermination')}
            </Button>
            <Tooltip
              placement="bottom"
              className="max-w-[350px] break-words"
              content={
                activeSpecimens.length > 0 ? (
                  <div>
                    <p className="mb-1 block"> {t('info.title')}</p>
                    <p>{t('info.text1')}</p>
                    <p>{t('info.text2')}</p>
                  </div>
                ) : (
                  <>
                    <p>{t('info.alternativeText1')}</p>
                    <p>{t('info.alternativeText2')}</p>
                  </>
                )
              }>
              <HiQuestionMarkCircle className="relative h-5 w-5" color="white" />
            </Tooltip>
          </div>
        </div>
      </div>

      {patient ? (
        <>
          <PatientProfile patient={patient} terminationDocuments={specimenTerminations} />
        </>
      ) : null}
      <DynamicNamespaces namespaces={['patients']} fallback="Loading...">
        <EditPatientModal
          patient={patient}
          updateDetails={updatePatientDetails}
          isOpen={isModalOpen}
          onClose={onClose}
        />
        <TerminationRequestModal
          key={activeSpecimens.length}
          isOpen={isTerminationRequestModalOpen && !isTerminationRequestLoading}
          onClose={() => {
            onCloseTerminationRequestModal();
            refreshTerminationsRequests(undefined, { revalidate: true });
          }}
          specimenTypes={activeSpecimens}
        />
      </DynamicNamespaces>
    </div>
  ) : (
    <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 text-sm text-white">
        <Spinner size="sm" className="mt-[-1px]" /> Loading...
      </div>
    </div>
  );
}

export default OverviewPatientPage;
