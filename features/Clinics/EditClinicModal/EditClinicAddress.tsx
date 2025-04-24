import { useFormContext } from 'react-hook-form';

import TextInput from '@/components/Forms/TextInput/TextInput';

import { ViewTypes } from '@/types';
import { statesWithId } from '@/constants/states';
import useTranslation from 'next-translate/useTranslation';
import CustomSelect from '@/components/Forms/Select/Select';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

const EditClinicAddress = () => {
  const { t } = useTranslation('clinics');

  const {
    control,
    register,
    formState: {
      errors: { address: errors },
    },
  } = useFormContext<ViewTypes.ClinicFormValues>();

  return (
    <div className="flex max-w-md flex-col gap-4">
      {errors?.type === 'general' && <div className="text-xs text-rose-400">{errors?.message}</div>}
      <ErrorValidationMessage touched={errors?.address?.street1} message={errors?.address?.street1?.message}>
        <TextInput
          type="text"
          placeholder={t('common:addressLine1') + ' *'}
          register={register('address.address.street1')}
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={errors?.address?.street2} message={errors?.address?.street2?.message}>
        <TextInput type="text" placeholder={t('common:addressLine2')} register={register('address.address.street2')} />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={errors?.address?.city} message={errors?.address?.city?.message}>
        <TextInput type="text" placeholder={t('common:city') + ' *'} register={register('address.address.city')} />
      </ErrorValidationMessage>
      <div className="grid grid-cols-2 gap-5">
        <ErrorValidationMessage touched={errors?.address?.state} message={errors?.address?.state?.message}>
          <CustomSelect
            control={control}
            name="address.address.state"
            options={statesWithId}
            placeholder={t('step2.selectState') + ' *'}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage touched={errors?.address?.zipCode} message={errors?.address?.zipCode?.message}>
          <TextInput
            type="text"
            placeholder={t('common:zipCode') + ' *'}
            register={register('address.address.zipCode')}
          />
        </ErrorValidationMessage>
      </div>
    </div>
  );
};

export default EditClinicAddress;
