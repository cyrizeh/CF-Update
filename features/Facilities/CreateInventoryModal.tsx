/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import { useForm, FormProvider } from 'react-hook-form';
import Image from 'next/image';
import useFacilityMutation from '@/api/mutations/useFacilityMutation';
import { ViewTypes } from '@/types';
import closeIcon from '@/public/icons/close-button.svg';
import { errorHandler } from '@/utils/errorHandler';
import useTranslation from 'next-translate/useTranslation';
import InventoryForm from './InventoryForm';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { fieldIsRequiredMessage, maxLengthMessage } from '@/validations/validationUtils';

type Props = {
  isOpen: boolean;
  onClose: (isSubmitted?: boolean) => void;
};

const CreateInventoryModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation('facilities');
  const rootRef = useRef<HTMLDivElement>(null);

  const { createInventory } = useFacilityMutation();

  const router = useRouter();
  const facilityId = router.query.id as string;

  const { handleSubmit, ...formProps } = useForm<ViewTypes.InventoryFormValues>({
    // @ts-ignore
    resolver: yupResolver(
      Yup.object().shape({
        form: Yup.object().shape({
          name: Yup.string().required(fieldIsRequiredMessage('Name')).max(100, maxLengthMessage(100, 'Name')),
        }),
      })
    ),
  });

  const isLoading = createInventory.isMutating;

  function handleError(error: { field: any; error: { message: string } }) {
    formProps.setError(error.field, { ...error.error });
  }

  function handleClearForm() {
    formProps.reset();
  }

  const handleCreateFacility = async (data: ViewTypes.InventoryFormValues) => {
    createInventory
      .trigger({ name: data.form.name, facilityId: facilityId })
      .then(() => {
        onCloseModal(true);
      })
      .catch(error => errorHandler(error, handleError, 'form'));
  };

  const onSubmit = (data: ViewTypes.InventoryFormValues) => {
    handleCreateFacility(data);
  };

  const onCloseModal = (isSubmitted?: boolean) => {
    handleClearForm();
    onClose(isSubmitted);
  };

  return (
    <div ref={rootRef} data-testid="create-inventory-modal">
      <Modal
        root={rootRef.current ?? undefined}
        show={isOpen}
        size="md"
        onClose={() => onCloseModal()}
        data-testid="create-inventory-modal-dialog">
        <div data-testid="create-inventory-modal-header" className="flex items-center justify-between p-5">
          <div></div>
          <div className="text-3xl font-light">{t('modal.createInventory')}</div>
          <div
            className="cursor-pointer"
            onClick={() => onCloseModal()}
            data-testid="create-inventory-modal-close-button">
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body data-testid="create-inventory-modal-body">
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            <InventoryForm />
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="justify-between" data-testid="create-inventory-modal-footer">
          <Button color="transparent" onClick={onCloseModal} data-testid="create-inventory-modal-cancel-button">
            {t('common:cancel')}
          </Button>

          <Button
            type="submit"
            gradientDuoTone="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            data-testid="create-inventory-modal-submit-button">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" className="mt-[-1px]" /> {t('loading')}
              </div>
            ) : (
              <div className="flex gap-2">{t('common:add')}</div>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateInventoryModal;
