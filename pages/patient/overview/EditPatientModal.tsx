/* eslint-disable no-unused-vars */
import React, { useRef, useEffect } from 'react';
import { Button, Modal } from 'flowbite-react';
import { useForm, FormProvider } from 'react-hook-form';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import EditPatient from './EditPatient';
import closeIcon from '@/public/icons/close-button.svg';
import { ViewTypes } from '@/types';
import { errorHandler } from '@/utils/errorHandler';
import useTranslation from 'next-translate/useTranslation';
import { editProfileShema } from '@/validations/patients';

type EditPatientProps = {
  isOpen: boolean;
  patient: any;
  updateDetails: (data: any) => Promise<any>;
  onClose: (isSubmitted?: boolean) => void;
};

const EditPatientModal = ({ isOpen, patient, updateDetails, onClose }: EditPatientProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');

  const { handleSubmit, ...formProps } = useForm<ViewTypes.EditPatientFormValues>({
    // @ts-ignore
    resolver: yupResolver(editProfileShema),
  });

  function handleError(error: { field: any; error: { message: string } }) {
    formProps.setError(error.field, { ...error.error });
  }
  const isLoading = false;

  useEffect(() => {
    formProps.setValue('phoneNumber', patient?.phoneNumber);
    formProps.setValue('email', patient?.email);
    formProps.setValue('alternativeEmail', patient?.alternativeEmail ?? '');
    formProps.setValue('address.street1', patient?.address?.street1);
    formProps.setValue('address.street2', patient?.address?.street2 ?? '');
    formProps.setValue('address.city', patient?.address?.city);
    formProps.setValue('address.state', patient?.address?.state);
    formProps.setValue('address.zipCode', patient?.address?.zipCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient]);

  const onSubmit = (data: any) => {
    updateDetails({ ...data })
      .then(() => {
        onClose(true);
        // mutate(undefined, { revalidate: true });
        // onCloseModal();
      })
      .catch(error => errorHandler(error, handleError, 'patient'));
  };

  function handleClearForm() {
    formProps.reset({
      phoneNumber: patient?.phoneNumber || '',
      email: patient?.email || '',
      alternativeEmail: patient?.alternativeEmail || '',
      address: {
        street1: patient?.address?.street1 || '',
        street2: patient?.address?.street2 || '',
        city: patient?.address?.city || '',
        state: patient?.address?.state || '',
        zipCode: patient?.address?.zipCode || '',
      },
    });
  }

  const onCloseModal = (isSubmitted?: boolean) => {
    handleClearForm();
    onClose(isSubmitted);
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={() => onCloseModal()}>
        <div className="flex items-center justify-between p-5">
          <div></div>
          <div className="text-3xl font-light">{t('edit_patient')}</div>
          <div className="cursor-pointer" onClick={() => onCloseModal()}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body className="max-h-[calc(100vh-270px)]">
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            <EditPatient />
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={() => onCloseModal()}>
            {t('common:cancel')}
          </Button>

          <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            <div className="flex gap-2">{t('common:save')}</div>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditPatientModal;
