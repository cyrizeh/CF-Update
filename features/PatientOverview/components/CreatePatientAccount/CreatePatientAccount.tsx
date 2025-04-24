import useToggleModal from '@/hooks/useToggleModal';
import { PatientOverviewProps } from '@/types/view';
import { Button } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import CreatePatientAccountModal from './CreatePatientAccountModal';

export const CreatePatientAccount = ({ patient, refetchPatientInfo }: PatientOverviewProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const { t } = useTranslation('patients');
  return (
    <div className="flex flex-wrap justify-end">
      <div className="flex justify-end">
        <Button gradientDuoTone="primary" onClick={onOpenModal} className="mr-5 mt-5">
          {t('initiateOnboarding')}
        </Button>
      </div>
      <CreatePatientAccountModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        refetchPatientData={refetchPatientInfo}
        patient={patient}
      />
    </div>
  );
};
