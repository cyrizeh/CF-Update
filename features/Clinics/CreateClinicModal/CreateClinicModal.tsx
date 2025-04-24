/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, Dispatch, SetStateAction, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { errorHandler } from '@/utils/errorHandler';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import { useForm, FormProvider } from 'react-hook-form';

import Step1 from './Step1/Step1';
import Step2 from './Step2/Step2';
import Stepper from '@/components/Forms/Stepper/Stepper';

import useTranslation from 'next-translate/useTranslation';
import useModalStepper from '@/hooks/useModalStepper';
import useClinicMutation from '@/api/mutations/useClinicMutation';

import {
  createClinicMapper,
  updateClinicAddressMapper,
  updateClinicAffiliateMapper,
} from '@/api/mappers/clinic.mappers';

import { getValidationSchema } from '@/validations/clinics';
import { ViewTypes } from '@/types';

import closeIcon from '@/public/icons/close-button.svg';
import arrowIcon from '@/public/icons/arrow-left.svg';
import arrowNextIcon from '@/public/icons/arrow-right.svg';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  revalidate: () => void;
};

const steps = ['step1.title', 'step2.title'];

const CreateClinicModal = ({ isOpen, setIsOpen, revalidate }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('clinics');

  const [clinicId, setClinicId] = useState<string>('');

  const { maxStep, activeStep, onNextStep, onPrevStep, onCancel } = useModalStepper(steps, setIsOpen, handleClearForm);

  const { createClinic, updateDetails, updateClinicAddress, isClinicAddressMutating } = useClinicMutation();

  const { handleSubmit, ...formProps } = useForm<ViewTypes.ClinicFormValues>({
    // @ts-ignore
    resolver: yupResolver(getValidationSchema(activeStep)),
  });

  const isLoading = createClinic.isMutating || isClinicAddressMutating;

  const getStepComponent = (step: number) => {
    switch (step) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
    }
  };

  function handleError(error: { field: any; error: { message: string } }) {
    formProps.setError(error.field, { ...error.error });
  }

  function handleClearForm() {
    formProps.reset();
    setClinicId('');
  }

  const handleCreateClinic = async (data: ViewTypes.ClinicFormValues) => {
    if (clinicId) {
      // TODO: FIX THIS
      // @ts-ignore
      updateDetails({ ...createClinicMapper(data), clinicId })
        .then(() => {
          onNextStep();
          revalidate();
        })
        .catch(error => errorHandler(error, handleError, 'details'));
    } else
      createClinic
        .trigger(createClinicMapper(data))
        .then(response => {
          setClinicId(response.data.id);
          onNextStep();
          revalidate();
        })
        .catch(error => errorHandler(error, handleError, 'details'));
  };

  const handleUpdateClinicAddress = (data: ViewTypes.ClinicFormValues) => {
    updateClinicAddress(updateClinicAddressMapper(data, clinicId))
      .then(() => {
        onCloseModal();
      })
      .catch(error => errorHandler(error, handleError, 'address'));
  };

  const onSubmit = (data: ViewTypes.ClinicFormValues) => {
    switch (activeStep) {
      case 0: {
        handleCreateClinic(data);
        break;
      }
      case 1: {
        handleUpdateClinicAddress(data);
        break;
      }
    }
  };

  const onCloseModal = () => {
    handleClearForm();
    onCancel();
  };

  return (
    <div ref={rootRef} data-testid="create-clinic-modal">
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={onCloseModal}>
        <div className="flex items-center justify-between p-5" data-testid="create-clinic-modal-header">
          <div data-testid="create-clinic-modal-prev-button" className={classNames({ 'cursor-pointer': activeStep !== 0 })}>
            <Image
              priority
              src={arrowIcon}
              alt="Prev"
              onClick={onPrevStep}
              className={classNames({ hidden: activeStep === 0 })}
            />
          </div>

          <div data-testid="create-clinic-modal-title" className="text-3xl font-light">
            {t('create_title')}
          </div>

          <div data-testid="create-clinic-modal-close-button" className="cursor-pointer" onClick={onCloseModal}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body className="max-h-[calc(100vh-270px)]">
          <Stepper steps={steps} currentStep={activeStep + 1} />

          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            {getStepComponent(activeStep)}
          </FormProvider>
        </Modal.Body>

        <Modal.Footer data-testid="create-clinic-modal-footer" className="justify-between">
          <Button data-testid="create-clinic-modal-cancel-button" color="transparent" onClick={onCloseModal}>
            {t('common:cancel')}
          </Button>

          <Button
            data-testid="create-clinic-modal-submit-button"
            type="submit"
            gradientDuoTone="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}>
            {isLoading && (
              <div data-testid="create-clinic-loading-indicator" className="flex items-center gap-2">
                <Spinner size="sm" className="mt-[-1px]" /> Loading...
              </div>
            )}

            {!isLoading && (
              <div>
                {maxStep === activeStep ? (
                  t('common:finish')
                ) : (
                  <div className="flex gap-2" data-testid="create-clinic-modal-next-button">
                    {t('common:next')} <Image priority src={arrowNextIcon} alt="next" />
                  </div>
                )}
              </div>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateClinicModal;
