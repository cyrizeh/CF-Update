import { useFormContext } from 'react-hook-form';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import { statesWithId } from '@/constants/states';
import useTranslation from 'next-translate/useTranslation';
import CustomSelect from '@/components/Forms/Select/Select';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

const EditBillingAddress = () => {
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

      <div className="flex max-w-md flex-col gap-4">
        <ErrorValidationMessage
          touched={errors?.billingAddress?.street1}
          message={errors?.billingAddress?.street1?.message}>
          <TextInput
            type="text"
            placeholder={t('common:addressLine1') + ' *'}
            register={register('address.billingAddress.street1')}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage
          touched={errors?.billingAddress?.street2}
          message={errors?.billingAddress?.street2?.message}>
          <TextInput
            type="text"
            placeholder={t('common:addressLine2')}
            register={register('address.billingAddress.street2')}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage
            touched={errors?.billingAddress?.city}
            message={errors?.billingAddress?.city?.message}>
            <TextInput
              type="text"
              placeholder={t('common:city') + ' *'}
              register={register('address.billingAddress.city')}
            />
          </ErrorValidationMessage>
        <div className="grid grid-cols-2 gap-5">

          <ErrorValidationMessage
            touched={errors?.billingAddress?.state}
            message={errors?.billingAddress?.state?.message}>
            <CustomSelect
              control={control}
              name="address.billingAddress.state"
              options={statesWithId}
              placeholder={t('step2.selectState') + ' *'}
            />
          </ErrorValidationMessage>
          <ErrorValidationMessage
          touched={errors?.billingAddress?.zipCode}
          message={errors?.billingAddress?.zipCode?.message}>
          <TextInput
            type="text"
            placeholder={t('common:zipCode') + ' *'}
            register={register('address.billingAddress.zipCode')}
          />
        </ErrorValidationMessage>
        </div>
       
      </div>
    </div>
  );
};

export default EditBillingAddress;
