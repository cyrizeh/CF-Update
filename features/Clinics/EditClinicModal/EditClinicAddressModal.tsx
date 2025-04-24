import React, { useRef, useEffect } from 'react';
import { Button, Modal } from 'flowbite-react';
import { useForm, FormProvider } from 'react-hook-form';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';

import EditClinicAddress from './EditClinicAddress';

import closeIcon from '@/public/icons/close-button.svg';
import { editClinicAddressMapper } from '@/api/mappers/clinic.mappers';

import { ViewTypes } from '@/types';
import { errorHandler } from '@/utils/errorHandler';
import useTranslation from 'next-translate/useTranslation';
import { getValidationSchema } from '@/validations/clinics';

type EditClinicProps = {
  isOpen: boolean;
  clinic: ViewTypes.Clinic;
  // eslint-disable-next-line no-unused-vars
  updateDetails: (data: any) => Promise<any>;
  onClose: () => void;
};

const EditClinicAddressModal = ({ isOpen, clinic, updateDetails, onClose }: EditClinicProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('clinics');

  const { handleSubmit, ...formProps } = useForm<ViewTypes.ClinicFormValues>({
    // @ts-ignore
    resolver: yupResolver(getValidationSchema(1)),
  });

  function handleError(error: { field: any; error: { message: string } }) {
    formProps.setError(error.field, { ...error.error });
  }

  useEffect(() => {
    if (clinic && isOpen) {
      formProps.setValue('address.address.street1', clinic.address?.street1);
      formProps.setValue('address.address.street2', clinic.address?.street2);
      formProps.setValue('address.address.city', clinic.address?.city);
      formProps.setValue('address.address.state', clinic.address?.state);
      formProps.setValue('address.address.zipCode', clinic.address?.zipCode);
      formProps.setValue('address.billingAddress.street1', clinic.billingAddress?.street1);
      formProps.setValue('address.billingAddress.street2', clinic.billingAddress?.street2);
      formProps.setValue('address.billingAddress.city', clinic.billingAddress?.city);
      formProps.setValue('address.billingAddress.state', clinic.billingAddress?.state);
      formProps.setValue('address.billingAddress.zipCode', clinic.billingAddress?.zipCode);
    }
  }, [clinic, isOpen]);

  const onSubmit = (data: any) => {
    updateDetails(editClinicAddressMapper(data, clinic.id))
      .then(() => {
        onCloseModal();
      })
      .catch(error => errorHandler(error, handleError, 'address'));
  };

  const onCloseModal = () => {
    onClose();
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={onCloseModal}>
        <div className="flex items-center justify-between p-5">
          <div></div>
          <div className="text-3xl font-light">{t('edit_location')}</div>
          <div className="cursor-pointer" onClick={onCloseModal}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body>
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            <EditClinicAddress />
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

export default EditClinicAddressModal;
