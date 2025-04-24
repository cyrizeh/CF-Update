import { ViewTypes } from '@/types';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { initialDeviceData } from '@/constants/specimens';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import arrowIcon from '@/public/icons/arrow-left.svg';
import closeIcon from '@/public/icons/close-button.svg';
import { addSpecimenWitSteps } from '@/validations/specimens';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import AddCaneStep1 from './AddCaneStep1';
import AddCaneStep2 from './AddCaneStep2';
import AddDevicesTable from './AddDevicesStep';
import Footer from './Footer';
import useAddSpecimansModal from './useAddCaneDeviceModal';

interface AddCaneDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: any;
  refetchPatientInfo?: (id: any, options?: any) => void;
}

const AddCaneDeviceModal = ({ isOpen, onClose, patient, refetchPatientInfo }: AddCaneDeviceModalProps) => {
  // Refs
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // States
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Utils
  const { t } = useTranslation('specimens');
  const { userData } = useGetCurrentUser();
  // Form setup
  const { handleSubmit, ...formProps } = useForm<ViewTypes.AddSpecimanModalFormValues>({
    // @ts-ignore
    resolver: yupResolver(addSpecimenWitSteps(currentStep)),
    defaultValues: {
      caneData: {
        deviceNumber: 1,
        clinic: { id: '', name: '' },
        facilityId: { id: '', name: '' },
        rfId: '',
        caneColor: '',
        caneLabel: '',
        rfidReaderId: '',
        rfidItemType: '',
        rfidReader: '',
        noteId: '',
        notes: ''
      },
      specimensData: [initialDeviceData],
      currentStep: 1,
    },
  });

  // Functions
  const onCloseModal = () => {
    onClose();
    formProps?.reset();
  };

  const closeModalAndCheckUpdatedInfo = () => {
    if (currentStep > 1) {
      // @ts-ignore
      refetchPatientInfo(undefined, { revalidate: true });
    }
    onCloseModal();
  };

  // Custom Hooks
  const { stepClick, isLastStep, onPrevStep, dictionaryRFID, readersList, isSubmitting } = useAddSpecimansModal(
    onCloseModal,
    formProps?.getValues(),
    patient,
    currentStep,
    setCurrentStep,
    formProps?.setValue,
    refetchPatientInfo,
    formProps?.setError,
    isOpen,
    formProps?.watch,
    formProps?.control
  );

  // useEffect hooks
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });

    setCurrentStep(1);
    if (isOpen) {
      formProps?.setValue('caneData.secondaryIdentifier', {
        id: userData?.userId || '',
        name: userData?.email || '',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  return (
    <div ref={rootRef}>
      <Modal
        root={rootRef.current ?? undefined}
        show={isOpen}
        onClose={closeModalAndCheckUpdatedInfo}
        size={currentStep > 2 ? '7xl' : '2xl'}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div className={classNames('h-5 w-5', { 'cursor-pointer': currentStep !== 1 })}>
                <Image
                  priority
                  src={arrowIcon}
                  alt="Prev"
                  onClick={onPrevStep}
                  className={classNames({ hidden: currentStep === 1 })}
                />
              </div>

              <div className="text-3xl font-light dark:text-white">
                {currentStep === 1
                  ? t('modal.addCane')
                  : currentStep === 2
                  ? t('modal.infectiousDisease')
                  : t('modal.addDevice')}
              </div>

              <div className="h-5 w-5 cursor-pointer" onClick={closeModalAndCheckUpdatedInfo}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <div className="space-y-6">
                <div className="max-h-[calc(100vh-270px)] overflow-y-scroll" ref={scrollRef}>
                  <FormProvider handleSubmit={handleSubmit} {...formProps}>
                    <AddCaneStep1
                      currentStep={currentStep}
                      isOpen={isOpen}
                      dictionaryRFID={dictionaryRFID}
                      readersList={readersList}
                    />
                    <AddCaneStep2 currentStep={currentStep} />
                    <AddDevicesTable currentStep={currentStep} />
                  </FormProvider>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-full p-5 pt-2">
                <Footer
                  onClose={closeModalAndCheckUpdatedInfo}
                  isLastStep={isLastStep}
                  stepClick={stepClick}
                  handleSubmit={handleSubmit}
                  isLoading={isSubmitting}
                />
              </div>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddCaneDeviceModal;
