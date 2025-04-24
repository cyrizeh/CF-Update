import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { statesWithId } from '@/constants/states';
import CustomSelect from '@/components/Forms/Select/Select';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

type Props = {
  patient?: any;
};

const ConfirmPatientAddress = ({ patient }: Props) => {
  const { t } = useTranslation('patients');

  const {
    watch,
    control,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<ViewTypes.ConfirmAddressFormValues>();

  useEffect(() => {
    if (patient) {
      setValue('address.city', patient.address?.city);
      setValue('address.state', patient.address?.state);
      setValue('address.street1', patient.address?.street1);
      setValue('address.street2', patient.address?.street2);
      setValue('address.zipCode', patient.address?.zipCode);
    }
  }, [patient, setValue, watch]);

  return (
    <div className="flex flex-col  gap-5">
      <div className="flex flex-col">
        <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">
          Welcome to CryoFuture’s Patient Portal. To continue, please provide your address below.{' '}
        </p>
      </div>
      <ErrorValidationMessage touched={errors?.address?.street1} message={errors?.address?.street1?.message}>
        <TextInput
          required
          type="text"
          placeholder={t('common:address1') + ' *'}
          error={errors?.address?.street1}
          register={register('address.street1')}
        />
      </ErrorValidationMessage>
      <TextInput
        type="text"
        placeholder={t('common:address2')}
        error={errors?.address?.street2}
        register={register('address.street2')}
      />

      <ErrorValidationMessage touched={errors?.address?.city} message={errors?.address?.city?.message}>
        <TextInput
          type="text"
          placeholder={t('common:city') + ' *'}
          error={errors?.address?.city}
          register={register('address.city')}
        />
      </ErrorValidationMessage>

      <div className="grid grid-cols-2 gap-3">
        <div className="w-full">
          <ErrorValidationMessage touched={errors?.address?.state} message={errors?.address?.state?.message}>
            <CustomSelect
              control={control}
              error={errors?.address?.state}
              name={'address.state'}
              options={statesWithId}
              placeholder={t('common:state') + ' *'}
            />
          </ErrorValidationMessage>
        </div>
        <ErrorValidationMessage touched={errors?.address?.zipCode} message={errors?.address?.zipCode?.message}>
          <TextInput
            type="text"
            error={errors?.address?.zipCode}
            placeholder={t('common:zipCode') + ' *'}
            register={register('address.zipCode')}
          />
        </ErrorValidationMessage>
      </div>
    </div>
  );
};

export default ConfirmPatientAddress;
