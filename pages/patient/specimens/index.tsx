import { useGetPatientInfo } from '@/api/queries/patient.queries';
import { useGetPatientsTerminationRequests } from '@/api/queries/termination.queries';
import { PatientInventories } from '@/features/Patients/PatientInventories/PatientInventories';
import useToggleModal from '@/hooks/useToggleModal';
import { Button, Tooltip } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { HiQuestionMarkCircle } from 'react-icons/hi';
import TerminationRequestModal from '../overview/TerminationRequestModal';

function PatientSpecimensPage() {
  const { t } = useTranslation('specimens');
  const { data: patient } = useGetPatientInfo();
  const [activeSpecimens, setActiveSpecimens] = useState([]);
  const [specimenTerminationTypes, setSpecimenTerminationTypes] = useState<string[]>([]);
  const {
    isModalOpen: isTerminationRequestModalOpen,
    onCloseModal: onCloseTerminationRequestModal,
    onOpenModal: onOpenTerminationRequestModal,
  } = useToggleModal();

  const {
    data: terminationRequests,
    isLoading: isTerminationRequestLoading,
    mutate: refreshTerminationsRequests,
  } = useGetPatientsTerminationRequests({});

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
      setSpecimenTerminationTypes(term.map((item: any) => item.specimenType));
    }
  }, [terminationRequests]);

  useEffect(() => {
    setActiveSpecimens(patient?.specimenTypes.filter((type: string) => !specimenTerminationTypes.includes(type)) || []);
  }, [patient, specimenTerminationTypes]);

  return (
    <>
      <div className="flex flex-col  md:flex-row md:justify-between">
        <h1 className="w-[300px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent md:mb-4">
          {t('specimens')}
        </h1>
        <div className="flex flex-row justify-center">
          <Button
            gradientDuoTone="primary"
            disabled={activeSpecimens.length === 0}
            outline
            size="sm"
            onClick={onOpenTerminationRequestModal}>
            {t('terminations:requestTermination')}
          </Button>
          <Tooltip
            placement="bottom"
            className="max-w-[350px] break-words"
            content={
              activeSpecimens.length > 0 ? (
                <div>
                  <p className="mb-1 block"> {t('terminations:info.title')}</p>
                  <p>{t('terminations:info.text1')}</p>
                  <p>{t('terminations:info.text2')}</p>
                </div>
              ) : (
                <>
                  <p>{t('terminations:info.alternativeText1')}</p>
                  <p>{t('terminations:info.alternativeText2')}</p>
                </>
              )
            }>
            <HiQuestionMarkCircle className="relative h-5 w-5" color="white" />
          </Tooltip>
        </div>
      </div>
      <PatientInventories />
      <TerminationRequestModal
        key={activeSpecimens.length}
        isOpen={isTerminationRequestModalOpen && !isTerminationRequestLoading}
        onClose={() => {
          onCloseTerminationRequestModal();
          refreshTerminationsRequests(undefined, { revalidate: true });
        }}
        specimenTypes={activeSpecimens}
      />
    </>
  );
}

export default PatientSpecimensPage;
