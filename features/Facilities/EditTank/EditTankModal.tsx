import useFacilityMutation from '@/api/mutations/useFacilityMutation';
import TextInput from '@/components/Forms/TextInput/TextInput';
import closeIcon from '@/public/icons/close-button.svg';
import { errorHandler } from '@/utils/errorHandler';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetchTankList: any;
  tankId: string;
  tankName: string;
}

interface EditTankFormValues {
  tankName: string;
}

const EditTankModal = ({ isOpen, onClose, refetchTankList, tankId, tankName }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('facilities');
  const { updateTank } = useFacilityMutation();

  const linkedAccSchema = Yup.object().shape({
    tankName: Yup.string().required('Tank Name is required').max(40, `Tank Name can't be longer than 40 characters`),
  });

  const { handleSubmit, ...formProps } = useForm<EditTankFormValues>({
    // @ts-ignore
    resolver: yupResolver(linkedAccSchema),
  });

  function onCloseModal() {
    formProps?.reset();
    onClose();
  }

  function handleError(error: { field: any; error: { message: string } }) {
    formProps?.setError(error.field, { ...error.error });
  }

  const handleUpdateTank = async (data: EditTankFormValues) => {
    await updateTank
      .trigger({
        id: tankId,
        tankName: data?.tankName,
      })
      .then(() => {
        // @ts-ignore
        refetchTankList(undefined, { revalidate: true });
        onCloseModal();
      })
      .catch(error => {
        if (error?.response?.data?.detail?.includes('23505')) {
          toast.error('Conflict! Duplicate tank name!');
          formProps?.setError('tankName', { type: 'custom', message: 'Conflict! Duplicate tank name!' });
        } else {
          errorHandler(error, handleError, 'tankName');
        }
      });
  };

  useEffect(() => {
    if (isOpen) {
      formProps?.setValue('tankName', tankName);
    }
  }, [tankName, isOpen]);

  return (
    <div ref={rootRef} data-testid="edit-tank-modal">
      <Modal
        root={rootRef.current ?? undefined}
        show={isOpen}
        onClose={onCloseModal}
        data-testid="edit-tank-modal-dialog">
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5" data-testid="edit-tank-modal-header">
              <div></div>
              <div className="text-3xl font-light dark:text-white"> {t('editTank')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal} data-testid="edit-tank-modal-close-button">
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body data-testid="edit-tank-modal-body">
              <FormProvider handleSubmit={handleSubmit} {...formProps}>
                <TextInput
                  type="text"
                  placeholder={t('common:tank') + ' *'}
                  register={formProps.register('tankName')}
                  error={formProps.formState.errors?.tankName}
                  data-testid="edit-tank-name-input"
                />
              </FormProvider>
            </Modal.Body>

            <Modal.Footer className="justify-between" data-testid="edit-tank-modal-footer">
              <Button color="transparent" onClick={onCloseModal} data-testid="edit-tank-modal-cancel-button">
                {t('common:cancel')}
              </Button>

              <Button
                data-testid="edit-tank-modal-submit-button"
                type="submit"
                gradientDuoTone="primary"
                onClick={handleSubmit(handleUpdateTank)}
                disabled={updateTank?.isMutating}>
                {updateTank?.isMutating ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="mt-[-1px]" /> {t('common:loading')}
                  </div>
                ) : (
                  <div className="flex gap-2">{t('common:confirm')}</div>
                )}
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditTankModal;
