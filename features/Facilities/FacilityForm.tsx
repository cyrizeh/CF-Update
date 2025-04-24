import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import CustomSelect from '@/components/Forms/Select/Select';
import { statesWithId } from '@/constants/states';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

const FacilityForm = () => {
  const { t } = useTranslation('facilities');

  const {
    register,
    control,
    formState: {
      errors: { name: nameError, address: addressErrors },
    },
  } = useFormContext<ViewTypes.FacilityFormValues>();

  return (
    <form className="flex max-w-md flex-col gap-4">
      {nameError?.type === 'general' && <div className="text-xs text-rose-400">{nameError?.message}</div>}
      {addressErrors?.type === 'general' && <div className="text-xs text-rose-400">{nameError?.message}</div>}

      <div className="label-with-help">
        <div className="text-sm font-normal">{t('modal.facilityName')}</div>
      </div>
      <ErrorValidationMessage touched={nameError} message={nameError?.message}>
        <TextInput
          data-testid="facility-name-input"
          type="text"
          error={nameError}
          placeholder={t('common:name') + ' *'}
          register={register('name')}
        />
      </ErrorValidationMessage>
      <div className="label-with-help">
        <div className="text-sm font-normal">{t('modal.facilityAddress')}</div>
      </div>
      <ErrorValidationMessage touched={addressErrors?.street1} message={addressErrors?.street1?.message}>
        <TextInput
          data-testid="facility-address-street1-input"
          type="text"
          placeholder={t('common:addressLine1') + ' *'}
          error={addressErrors?.street1}
          register={register('address.street1')}
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={addressErrors?.street2} message={addressErrors?.street2?.message}>
        <TextInput
          data-testid="facility-address-street2-input"
          type="text"
          placeholder={t('common:addressLine2')}
          error={addressErrors?.street2}
          register={register('address.street2')}
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={addressErrors?.city} message={addressErrors?.city?.message}>
        <TextInput
          data-testid="facility-address-city-input"
          type="text"
          placeholder={t('common:city') + ' *'}
          error={addressErrors?.city}
          register={register('address.city')}
        />
      </ErrorValidationMessage>

      <div className="grid grid-cols-2 gap-5">
        <ErrorValidationMessage touched={addressErrors?.state} message={addressErrors?.state?.message}>
          <CustomSelect
            dataTestId="facility-address-state-select"
            control={control}
            name="address.state"
            error={addressErrors?.state}
            options={statesWithId}
            placeholder={t('common:selectState') + ' *'}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage touched={addressErrors?.zipCode} message={addressErrors?.zipCode?.message}>
          <TextInput
            data-testid="facility-address-zipcode-input"
            type="text"
            placeholder={t('common:zipCode') + ' *'}
            error={addressErrors?.zipCode}
            register={register('address.zipCode')}
          />
        </ErrorValidationMessage>
      </div>
    </form>
  );
};

export default FacilityForm;
