import { Dispatch, SetStateAction, useState } from 'react';

const useModalStepper = (steps: Array<string>, setIsOpen: Dispatch<SetStateAction<boolean>>, resetForm: any) => {
  const maxStep = steps.length - 1;
  const [activeStep, changeStep] = useState(0);

  const onNextStep = () => (activeStep < maxStep ? changeStep(activeStep + 1) : null);

  const onPrevStep = () => (activeStep > 0 ? changeStep(activeStep - 1) : null);

  const onCancel = () => {
    resetForm();
    changeStep(0);
    setIsOpen(false);
  };

  return { activeStep, maxStep, onNextStep, onPrevStep, onCancel };
};

export default useModalStepper;
