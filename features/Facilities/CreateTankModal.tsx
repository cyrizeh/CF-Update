import useFacilityMutation from '@/api/mutations/useFacilityMutation';
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import closeIcon from '@/public/icons/close-button.svg';
import { ViewTypes } from '@/types';
import { errorHandler } from '@/utils/errorHandler';
import { fieldIsRequiredMessage } from '@/validations/validationUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRef } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

type Props = {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onClose: (isSubmitted?: boolean) => void;
  vaultId: string;
};

export const tankTypes = [
  { label: '816-2T', value: '816-2T' },
  { label: 'TW 38-HC', value: 'TW 38-HC' },
  { label: 'MVE 47-11', value: 'MVE 47-11' },
];

export const defaultTankValues: ViewTypes.TankFormValues = {
  name: '',
  model: '',
  isReactive: false,
};

const CreateTankModal = ({ isOpen, onClose, vaultId }: Props) => {
  const { t } = useTranslation('facilities');
  const rootRef = useRef<HTMLDivElement>(null);
  const { createTank } = useFacilityMutation();

  const { handleSubmit, ...formProps } = useForm<ViewTypes.TankFormValues>({
    defaultValues: defaultTankValues,
    // @ts-ignore
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string()
          .required(fieldIsRequiredMessage('Name'))
          .test({
            name: 'max',
            message: `Tank name can't be longer than 40 characters`,
            test: value => !value || value.length <= 40,
          }),
        model: Yup.string().required(fieldIsRequiredMessage('Model')),
        isReactive: Yup.boolean().notRequired(),
      })
    ),
  });

  const isLoading = createTank.isMutating;

  function handleError(error: { field: any; error: { message: string } }) {
    formProps.setError(error.field.slice(0, -1), { ...error.error });
  }

  function handleClearForm() {
    formProps.reset();
  }

  const handleCreateTank = async (data: ViewTypes.TankFormValues) => {
    createTank
      .trigger({ name: data.name, model: data.model, vaultId, isReactive: data?.isReactive })
      .then(() => onCloseModal(true))
      .catch(error => {
        if (error.response.data.detail.includes('23505')) {
          toast.error('Conflict! Duplicate tank name!');
          formProps.setError('name', { type: 'custom', message: 'Conflict! Duplicate tank name!' });
        } else {
          errorHandler(error, handleError, 'errors');
        }
      });
  };

  const onSubmit = (data: ViewTypes.TankFormValues) => {
    handleCreateTank(data);
  };

  const onCloseModal = (isSubmitted?: boolean) => {
    handleClearForm();
    onClose(isSubmitted);
  };

  return (
    <div ref={rootRef} data-testid="create-tank-modal">
      <Modal
        root={rootRef.current ?? undefined}
        show={isOpen}
        size="md"
        onClose={() => onCloseModal()}
        data-testid="create-tank-modal-dialog">
        <div className="flex items-center justify-between p-5" data-testid="create-tank-modal-header">
          <div></div>
          <div className="text-3xl font-light">{t('modal.createTank')}</div>
          <div className="cursor-pointer" onClick={() => onCloseModal()} data-testid="create-tank-modal-close-button">
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body data-testid="create-tank-modal-body">
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            <form className="flex max-w-md flex-col gap-4" data-testid="create-tank-form">
              <ErrorValidationMessage
                touched={formProps.formState.errors?.name}
                message={formProps.formState.errors?.name?.message}>
                <TextInput
                  type="text"
                  placeholder={t('common:tank') + ' *'}
                  register={formProps.register('name')}
                  error={formProps.formState.errors?.name}
                  data-testid="tank-name-input"
                />
              </ErrorValidationMessage>
              <ErrorValidationMessage
                touched={formProps.formState.errors?.model}
                message={formProps.formState.errors?.model?.message}>
                <CustomSelect
                  isMulti={false}
                  control={formProps.control}
                  name="model"
                  error={formProps.formState.errors?.model}
                  options={tankTypes}
                  placeholder={t('common:tankModel') + ' *'}
                  dataTestId="tank-model-select"
                />
              </ErrorValidationMessage>
              <Controller
                control={formProps.control}
                name="isReactive"
                render={({ field }) => (
                  <div>
                    <ErrorValidationMessage
                      touched={!!formProps?.formState?.errors?.isReactive}
                      message={formProps?.formState?.errors.isReactive?.message}
                      style={{
                        container: {
                          minHeight: '24px',
                        },
                      }}>
                      <Checkbox
                        checked={field.value as boolean}
                        onChange={() => field.onChange(!field.value)}
                        register={field}
                        label={'Is Reactive'}
                        labelStyles="text-base"
                        dataTestId="tank-reactive-checkbox"
                      />
                    </ErrorValidationMessage>
                  </div>
                )}
              />
            </form>
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="justify-between" data-testid="create-tank-modal-footer">
          <Button color="transparent" onClick={onCloseModal} data-testid="create-tank-modal-cancel-button">
            {t('common:cancel')}
          </Button>

          <Button
            type="submit"
            gradientDuoTone="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            data-testid="create-tank-modal-submit-button">
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

export default CreateTankModal;
