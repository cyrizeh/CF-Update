import Stepper from '@/components/Forms/Stepper/Stepper';
import arrowIcon from '@/public/icons/arrow-left.svg';
import closeIcon from '@/public/icons/close-button.svg';
import { ViewTypes } from '@/types';
import { CaneDetails } from '@/types/view/Specimen.interface';
import { editCaneStepsFormSchema } from '@/validations/specimens';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import EditCaneDisease from './EditCaneDisease';
import EditCaneMainInfo from './EditCaneMainInfo';
import { defaultEditCaneModalFormValues } from './EditCaneModal.utils';
import Footer from './Footer';
import useEditCaneModalCustomHook from './useEditCaneModalCustomHook';

interface EditCaneModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchCaneInfo: any;
  caneData: CaneDetails | null | undefined;
}

const EditCaneModal = ({ isOpen, onClose, refetchCaneInfo, caneData }: EditCaneModalProps) => {
  // States
  const [currentStep, setCurrentStep] = useState<number>(1);

  // const
  const STEPS = Array(2).fill('');

  // refs
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Utils
  const { t } = useTranslation('specimens');

  // Forms
  const { handleSubmit, ...formProps } = useForm<ViewTypes.EditCaneModalFormValues>({
    // @ts-ignore
    resolver: yupResolver(editCaneStepsFormSchema(currentStep, caneData?.devices?.length)),
    defaultValues: defaultEditCaneModalFormValues,
  });

  // hook
  const { isLastStep, isSubmitting, onPrevStep, stepClick } = useEditCaneModalCustomHook(
    onCloseModal,
    currentStep,
    setCurrentStep,
    refetchCaneInfo,
    formProps?.watch
  );

  // Fns
  function onCloseModal() {
    onClose();
    formProps?.reset();
    refetchCaneInfo?.();
    setCurrentStep(1);
  }
  // useeffect hook
  useEffect(() => {
    if (isOpen && caneData) {
      formProps?.reset({
        receiptDate: caneData?.receiptDate || null,
        deviceNumber: caneData?.expectedDeviceQty || 0,
        caneColor: caneData?.caneDescription || '',
        caneLabel: caneData?.caneLabel || '',
        id: caneData?.id || '',
        primaryIdentifier: {
          id: caneData?.primaryIdentifier?.id || '',
          name: caneData?.primaryIdentifier?.email || '',
          userId: caneData?.primaryIdentifier?.id || '',
        },
        idLabResult: caneData?.idLabResult || '',
        FDAEligibility: caneData?.fdaEligibility || defaultEditCaneModalFormValues.FDAEligibility,
        reactivity: caneData?.reactivity || false,
        reactive: caneData?.reactiveStatus || defaultEditCaneModalFormValues.reactive,
      });
    }
  }, [isOpen, caneData]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
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
              <div className="text-3xl font-light dark:text-white">{t('modal.editCane')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body className="max-h-[calc(100vh-270px)]">
              <div className="space-y-6">
                <Stepper steps={STEPS} currentStep={currentStep} />

                <div className="max-h-[470px] overflow-y-scroll" ref={scrollRef}>
                  <FormProvider handleSubmit={handleSubmit} {...formProps}>
                    <EditCaneMainInfo currentStep={currentStep} />
                    <EditCaneDisease currentStep={currentStep} />
                  </FormProvider>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-full p-5 pt-2">
                <Footer
                  onClose={onCloseModal}
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

export default EditCaneModal;
