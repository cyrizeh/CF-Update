import useTranslation from 'next-translate/useTranslation';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import { useFormContext } from 'react-hook-form';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

const InventoryForm = () => {
  const { t } = useTranslation('facilities');

  const {
    register,
    formState: { errors },
  } = useFormContext<ViewTypes.InventoryFormValues>();

  return (
    <form className="flex max-w-md flex-col gap-4" data-testid="inventory-form">
      <ErrorValidationMessage touched={errors?.form?.name} message={errors?.form?.name?.message}>
        <TextInput
          data-testid="inventory-form-name-input"
          type="text"
          error={errors?.form?.name}
          placeholder={t('common:vault') + ' *'}
          register={register('form.name')}
        />
      </ErrorValidationMessage>
    </form>
  );
};

export default InventoryForm;
