import React, { useRef, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import { useForm, FormProvider } from 'react-hook-form';
import Image from 'next/image';
import useFacilityMutation from '@/api/mutations/useFacilityMutation';
import { ViewTypes } from '@/types';
import closeIcon from '@/public/icons/close-button.svg';
import useTranslation from 'next-translate/useTranslation';
import { toast } from 'react-toastify';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { editRfidSchema } from '@/validations/specimens';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import { handleInputToUpperCase } from '@/utils/toUpperCase';

type Props = {
  isOpen: boolean;
  onClose: (isSubmitted?: boolean) => void;
  cane: any;
  refetchCaneInfo: () => void;
  refetchDevices: () => void;
  refetchSpecimens: () => void;
};

const EditRfidModal = ({ isOpen, onClose, cane, refetchCaneInfo, refetchDevices, refetchSpecimens }: Props) => {
  const { t } = useTranslation('transportation');
  const rootRef = useRef<HTMLDivElement>(null);
  const { createTank } = useFacilityMutation();
  const { updateRfid } = useInventoryMutation();
  const { handleSubmit, ...formProps } = useForm<ViewTypes.EditRfidFormValues>({
    resolver: yupResolver(editRfidSchema),
  });

  const isLoading = createTank.isMutating;

  useEffect(() => {
    if (cane?.rfid) {
      formProps.setValue('rfid', cane.rfid);
    }
  }, [cane]);

  const onSubmit = (data: any) => {
    updateRfid
      .trigger({
        caneId: cane.id,
        rfid: data.rfid,
      })
      .then(() => {
        onClose();
        toast.success('The RFID edited');
        refetchCaneInfo();
        refetchDevices();
        refetchSpecimens();
      })
      .catch((reason: any) => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        } else {
          toast.error('Failed to edit RFID');
        }
      });
  };

  const onCloseModal = (isSubmitted?: boolean) => {
    formProps.reset();
    onClose();
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={() => onCloseModal()}>
        <div className="flex items-center justify-between p-5">
          <div></div>
          <div className="text-3xl font-light">{'Edit RFID'}</div>
          <div className="cursor-pointer" onClick={() => onCloseModal()}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body>
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            <form className="flex max-w-md flex-col gap-4">
              <ErrorValidationMessage
                touched={formProps?.formState?.errors?.rfid}
                message={formProps?.formState?.errors?.rfid?.message}>
                <TextInput
                  type="text"
                  placeholder={'RFID'}
                  register={formProps.register('rfid', { value: cane?.rfid || '' })}
                  error={formProps.formState.errors?.rfid}
                  onInput={handleInputToUpperCase}
                />
              </ErrorValidationMessage>
            </form>
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={onCloseModal}>
            {t('common:cancel')}
          </Button>

          <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" className="mt-[-1px]" /> {t('loading')}
              </div>
            ) : (
              <div className="flex gap-2">{t('common:save')}</div>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditRfidModal;
