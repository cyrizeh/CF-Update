/* eslint-disable react-hooks/exhaustive-deps */

import React, { useRef, useEffect } from 'react';
import { Button, Modal } from 'flowbite-react';
import { useForm, FormProvider } from 'react-hook-form';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';

import EditClinicDetails from './EditClinicDetails';

import closeIcon from '@/public/icons/close-button.svg';
import { editClinicDetailsMapper } from '@/api/mappers/clinic.mappers';

import { ViewTypes } from '@/types';
import { errorHandler } from '@/utils/errorHandler';
import useTranslation from 'next-translate/useTranslation';
import { getValidationSchema } from '@/validations/clinics';
import { useGetAccounts } from '@/api/queries/accounts.queries';
import { convertPhoneNumberWithOutCode } from '@/utils/normalizePhoneNumber';

type EditClinicProps = {
  isOpen: boolean;
  clinic: ViewTypes.Clinic;
  // eslint-disable-next-line no-unused-vars
  updateDetails: (data: any) => Promise<any>;
  onClose: () => void;
  canEditParentClinic: boolean;
  refetchClinicData: () => Promise<any>;
};

const EditClinicModal = ({
  isOpen,
  clinic,
  updateDetails,
  onClose,
  canEditParentClinic,
  refetchClinicData,
}: EditClinicProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('clinics');

  const { handleSubmit, ...formProps } = useForm<ViewTypes.ClinicFormValues>({
    // @ts-ignore
    resolver: yupResolver(getValidationSchema(0)),
  });

  function handleError(error: { field: any; error: { message: string } }) {
    formProps.setError(error.field, { ...error.error });
  }

  const { data: companies } = useGetAccounts({ q: clinic.accountName }, !!clinic.accountName);

  useEffect(() => {
    if (companies && isOpen) {
      formProps.setValue(
        'details.accountId',
        companies.items.find((el: any) => el.name === clinic.accountName)
      );
    }
  }, [companies, isOpen]);

  useEffect(() => {
    if (clinic && isOpen) {
      formProps.setValue('details.name', clinic.name);
      formProps.setValue('details.clinicType', clinic.type);
      formProps.setValue('details.contactDetails.firstName', clinic.contactDetails?.firstName);
      formProps.setValue('details.contactDetails.lastName', clinic.contactDetails?.lastName);
      formProps.setValue('details.contactDetails.email', clinic.contactDetails?.email);
      formProps.setValue(
        'details.contactDetails.phoneNumber',
        convertPhoneNumberWithOutCode(clinic.contactDetails?.phoneNumber)
      );
      formProps.setValue('details.contactDetails.jobTitle', clinic.contactDetails?.jobTitle);

      formProps.setValue('details.secondaryContactDetails.firstName', clinic.secondaryContactDetails?.firstName);
      formProps.setValue('details.secondaryContactDetails.lastName', clinic.secondaryContactDetails?.lastName);
      formProps.setValue('details.secondaryContactDetails.email', clinic.secondaryContactDetails?.email);
      formProps.setValue(
        'details.secondaryContactDetails.phoneNumber',
        convertPhoneNumberWithOutCode(clinic.secondaryContactDetails?.phoneNumber)
      );
      formProps.setValue('details.secondaryContactDetails.jobTitle', clinic.secondaryContactDetails?.jobTitle);
    }
  }, [clinic, isOpen]);

  const onSubmit = (data: ViewTypes.ClinicFormValues) => {
    updateDetails({ ...editClinicDetailsMapper(data), clinicId: clinic.id })
      .then(() => {
        refetchClinicData?.();
        onCloseModal();
      })
      .catch(error => errorHandler(error, handleError, 'details'));
  };

  const onCloseModal = () => {
    formProps?.reset();
    onClose();
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={onCloseModal}>
        <div className="flex items-center justify-between p-5">
          <div></div>
          <div className="text-3xl font-light">{t('edit_title')}</div>
          <div className="cursor-pointer" onClick={onCloseModal}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body className="max-h-[calc(100vh-270px)]">
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            <EditClinicDetails canEditParentClinic={canEditParentClinic} />
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={onCloseModal}>
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

export default EditClinicModal;
