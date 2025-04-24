import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import { ViewTypes } from '@/types';
import { FDAEligibilityType } from '@/types/view/AddSpecimanModal.type';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useState } from 'react';
import { UseFormWatch } from 'react-hook-form';

const useEditCaneModalCustomHook = (
  onClose: any,
  currentStep: number,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  refetchCaneInfo: any,
  watch: UseFormWatch<ViewTypes.EditCaneModalFormValues>
) => {
  const maxCountOfSteps = 2;

  // state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // apis
  const { createCaneDisease, updateCane } = useInventoryMutation();

  //fns
  const stepClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formState = watch();
    try {
      if (currentStep === 1) {
        await updateCane
          .trigger({
            caneDescription: formState?.caneColor || '',
            label: formState?.caneLabel || '',
            expectedDeviceQty: Number(formState?.deviceNumber),
            primaryIdentifierId: formState?.primaryIdentifier.userId || '',
            receiptDate: formState?.receiptDate ? dayjs(formState.receiptDate).format('YYYY-MM-DD') : null,
            caneId: formState?.id || '',
          })
          .then(() => {
            setCurrentStep(2);
          })
          .catch(reason => {
            if (reason?.response?.data?.errors) {
              handleBackendErrors(reason.response.data.errors);
            }
          });
      } else if (currentStep === 2) {
        await createCaneDisease
          .trigger({
            caneId: formState?.id,
            fdaEligibility: formState?.FDAEligibility as FDAEligibilityType,
            idLabResult: formState?.idLabResult,
            reactive: formState?.reactive || null,
            reactivity: !!formState?.reactivity,
          })
          .then(() => {
            onClose();
            refetchCaneInfo();
          })
          .catch(reason => {
            if (reason?.response?.data?.errors) {
              handleBackendErrors(reason.response.data.errors);
            }
          });
      }
    } catch (error) {
      console.error('Error in step click:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isLastStep = currentStep === maxCountOfSteps;

  return {
    stepClick,
    isLastStep,
    maxCountOfSteps,
    onPrevStep,
    isSubmitting,
  };
};

export default useEditCaneModalCustomHook;
