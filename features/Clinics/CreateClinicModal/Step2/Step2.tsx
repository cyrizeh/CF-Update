import { useFormContext } from 'react-hook-form';

import Switch from '@/components/Forms/Switch/Switch';
import TextInput from '@/components/Forms/TextInput/TextInput';

import { ViewTypes } from '@/types';
import { statesWithId } from '@/constants/states';

import useTranslation from 'next-translate/useTranslation';
import CustomSelect from '@/components/Forms/Select/Select';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

const Step2 = () => {
  const { t } = useTranslation('clinics');

  const {
    control,
    register,
    watch,
    formState: {
      errors: { address: errors },
    },
  } = useFormContext<ViewTypes.ClinicFormValues>();

  return (
    <div className="flex max-w-md flex-col gap-4" data-testid="step2-container">
      {/* {errors?.type === 'general' && <div className="text-xs text-rose-400">{errors?.message}</div>} */}

      <div className="label-with-help" data-testid="clinic-address-label">
        <div className="text-sm font-normal">{t('step2.clinicAddress')}</div>
      </div>
      <ErrorValidationMessage touched={errors?.address?.street1} message={errors?.address?.street1?.message}>
        <TextInput
          data-testid="address-street1-input"
          type="text"
          placeholder={t('common:addressLine1') + ' *'}
          register={register('address.address.street1')}
          error={errors?.address?.street1}
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={errors?.address?.street2} message={errors?.address?.street2?.message}>
        <TextInput
          data-testid="address-street2-input"
          type="text"
          placeholder={t('common:addressLine2')}
          register={register('address.address.street2')}
          error={errors?.address?.street2}
        />
      </ErrorValidationMessage>

      <ErrorValidationMessage touched={errors?.address?.city} message={errors?.address?.city?.message}>
        <TextInput
          data-testid="address-city-input"
          type="text"
          placeholder={t('common:city') + ' *'}
          register={register('address.address.city')}
          error={errors?.address?.city}
        />
      </ErrorValidationMessage>

      <div className="grid grid-cols-2 gap-5">
        <ErrorValidationMessage touched={errors?.address?.state} message={errors?.address?.state?.message}>
          <CustomSelect
            dataTestId="address-state-select"
            control={control}
            name="address.address.state"
            error={errors?.address?.state}
            options={statesWithId}
            placeholder={t('step2.selectState') + ' *'}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage touched={errors?.address?.zipCode} message={errors?.address?.zipCode?.message}>
          <TextInput
            data-testid="address-zipcode-input"
            type="text"
            placeholder={t('common:zipCode') + ' *'}
            register={register('address.address.zipCode')}
            error={errors?.address?.zipCode}
          />
        </ErrorValidationMessage>
      </div>

      <div className="flex items-center justify-between">
        <div className="label-with-help">
          <div className="text-sm font-normal">Billing address</div>
        </div>

        <div className="ml-auto flex-shrink-0">
          <Switch label={t('step2.sameBilling')} register={register('address.address.sameBilling')} />
        </div>
      </div>

      {!watch('address.address.sameBilling') && (
        <div>
          <div className="flex max-w-md flex-col gap-4">
            <ErrorValidationMessage
              touched={errors?.billingAddress?.street1}
              message={errors?.billingAddress?.street1?.message}>
              <TextInput
                data-testid="billing-street1-input"
                type="text"
                placeholder={t('common:addressLine1') + ' *'}
                register={register('address.billingAddress.street1')}
                error={errors?.billingAddress?.street1}
              />
            </ErrorValidationMessage>
            <ErrorValidationMessage
              touched={errors?.billingAddress?.street2}
              message={errors?.billingAddress?.street2?.message}>
              <TextInput
                data-testid="billing-street2-input"
                type="text"
                placeholder={t('common:addressLine2')}
                register={register('address.billingAddress.street2')}
                error={errors?.billingAddress?.street2}
              />
            </ErrorValidationMessage>
            <ErrorValidationMessage
              touched={errors?.billingAddress?.city}
              message={errors?.billingAddress?.city?.message}>
              <TextInput
                data-testid="billing-city-input"
                type="text"
                placeholder={t('common:city') + ' *'}
                register={register('address.billingAddress.city')}
                error={errors?.billingAddress?.city}
              />
            </ErrorValidationMessage>
            <div className="grid grid-cols-2 gap-5">
              <ErrorValidationMessage
                touched={errors?.billingAddress?.state}
                message={errors?.billingAddress?.state?.message}>
                <CustomSelect
                  dataTestId="billing-state-select"
                  control={control}
                  name="address.billingAddress.state"
                  error={errors?.billingAddress?.state}
                  options={statesWithId}
                  placeholder={t('step2.selectState') + ' *'}
                />
              </ErrorValidationMessage>
              <ErrorValidationMessage
                touched={errors?.billingAddress?.zipCode}
                message={errors?.billingAddress?.zipCode?.message}>
                <TextInput
                  data-testid="billing-zipcode-input"
                  type="text"
                  placeholder={t('common:zipCode') + ' *'}
                  register={register('address.billingAddress.zipCode')}
                  error={errors?.billingAddress?.zipCode}
                />
              </ErrorValidationMessage>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2;
