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
import { editPatientProfileShema } from '@/validations/patients';
import { formatDate } from '@/utils/formatDate';
import { addUSCountryCodeWithOutPlus, convertPhoneNumberWithOutCode } from '@/utils/normalizePhoneNumber';

type EditPatientProps = {
  isOpen: boolean;
  patient: any;
  updateDetails: (data: any) => Promise<any>;
  onClose: (isSubmitted?: boolean) => void;
};

const EditPatientModal = ({ isOpen, patient, updateDetails, onClose }: EditPatientProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');

  const { handleSubmit, ...formProps } = useForm<ViewTypes.EditPatientProfileFormValues>({
    // @ts-ignore
    resolver: yupResolver(editPatientProfileShema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      alternativeEmail: '',
      address: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
  });

  function handleError(error: { field: any; error: { message: string } }) {
    formProps.setError(error.field, { ...error.error });
  }

  useEffect(() => {
    formProps.setValue('firstName', patient?.firstName);
    formProps.setValue('middleName', patient?.middleName ?? '');
    formProps.setValue('lastName', patient?.lastName);
    formProps.setValue('dateOfBirth', patient?.dateOfBirth);
    formProps.setValue('phoneNumber', convertPhoneNumberWithOutCode(patient?.phoneNumber));
    formProps.setValue('email', patient?.email);
    formProps.setValue('alternativeEmail', patient?.alternativeEmail ?? '');
    formProps.setValue('address.street1', patient?.address?.street1 ?? '');
    formProps.setValue('address.street2', patient?.address?.street2 ?? '');
    formProps.setValue('address.city', patient?.address?.city ?? '');
    formProps.setValue('address.state', patient?.address?.state ?? '');
    formProps.setValue('address.zipCode', patient?.address?.zipCode ?? '');
  }, [patient]);

  const onSubmit = (data: any) => {
    let formattedData = { ...data };
    const isAddressEmpty = Object.values(data.address).every(value => !value);
    const formattedAddress = isAddressEmpty ? null : data.address;
    if (!data.dateOfBirth || data.dateOfBirth === '') {
      formattedData = { ...formattedData, dateOfBirth: null };
    } else {
      formattedData = { ...formattedData, dateOfBirth: formatDate(new Date(data.dateOfBirth)) };
    }
    updateDetails({
      ...formattedData,
      patientId: patient.id,
      phoneNumber: addUSCountryCodeWithOutPlus(data?.phoneNumber),
      address: formattedAddress,
    })
      .then(() => {
        onClose(true);
      })
      .catch(error => errorHandler(error, handleError, 'patient'));
  };

  function handleClearForm() {
    formProps.reset({
      firstName: patient?.firstName || '',
      middleName: patient?.middleName || '',
      lastName: patient?.lastName || '',
      dateOfBirth: patient?.dateOfBirth || null,
      phoneNumber: convertPhoneNumberWithOutCode(patient?.phoneNumber) || '',
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

        <Modal.Body className="max-h-[calc(100vh-270px)] py-3">
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            <EditPatient />
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={() => onCloseModal()}>
            {t('common:cancel')}
          </Button>

          <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(onSubmit)}>
            <div className="flex gap-2">{t('common:save')}</div>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditPatientModal;
