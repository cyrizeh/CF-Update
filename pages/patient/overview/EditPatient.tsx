import { Controller, useFormContext } from 'react-hook-form';

import TextInput from '@/components/Forms/TextInput/TextInput';

import { ViewTypes } from '@/types';
import { statesWithId } from '@/constants/states';
import useTranslation from 'next-translate/useTranslation';
import CustomSelect from '@/components/Forms/Select/Select';
import { PatternFormat } from 'react-number-format';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

const EditPatient = () => {
  const { t } = useTranslation('patient');

  const {
    control,
    register,
    formState: { errors: errors },
  } = useFormContext<ViewTypes.EditPatientFormValues>();

  return (
    <div className="flex max-w-md flex-col gap-4">
      <Controller
        render={({ field: { onChange, name, value } }) => (
          <ErrorValidationMessage touched={errors?.phoneNumber} message={errors?.phoneNumber?.message}>
            <PatternFormat
              onValueChange={v => onChange(v.value)}
              name={name}
              value={value}
              format="+1 (###) ###-####"
              allowEmptyFormatting
              mask="_"
              error={errors?.phoneNumber}
              customInput={TextInput}
              inputstyles="sensitive"
            />
          </ErrorValidationMessage>
        )}
        defaultValue=""
        name={'phoneNumber'}
        control={control}
      />

      <ErrorValidationMessage touched={errors?.email} message={errors?.email?.message}>
        <TextInput
          type="email"
          error={errors?.email}
          placeholder={t('common:email') + ' *'}
          register={register('email')}
          inputstyles="sensitive"
        />
      </ErrorValidationMessage>

      <ErrorValidationMessage touched={errors?.alternativeEmail} message={errors?.alternativeEmail?.message}>
        <TextInput
          type="email"
          error={errors?.alternativeEmail}
          placeholder={t('common:emailAlt')}
          register={register('alternativeEmail')}
          inputstyles="sensitive"
        />
      </ErrorValidationMessage>

      <ErrorValidationMessage touched={errors?.address?.street1} message={errors?.address?.street1?.message}>
        <TextInput
          type="text"
          placeholder={t('common:addressLine1') + ' *'}
          error={errors?.address?.street1}
          register={register('address.street1')}
        />
      </ErrorValidationMessage>

      <ErrorValidationMessage touched={errors?.address?.street2} message={errors?.address?.street2?.message}>
        <TextInput
          type="text"
          placeholder={t('common:addressLine2')}
          error={errors?.address?.street2}
          register={register('address.street2')}
        />
      </ErrorValidationMessage>

      <ErrorValidationMessage touched={errors?.address?.city} message={errors?.address?.city?.message}>
        <TextInput
          type="text"
          placeholder={t('common:city') + ' *'}
          error={errors?.address?.city}
          register={register('address.city')}
        />
      </ErrorValidationMessage>

      <div className="grid grid-cols-2 gap-5">
        <ErrorValidationMessage touched={errors?.address?.state} message={errors?.address?.state?.message}>
          <CustomSelect
            control={control}
            name="address.state"
            error={errors?.address?.state}
            options={statesWithId}
            placeholder={t('common:selectState') + ' *'}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage touched={errors?.address?.zipCode} message={errors?.address?.zipCode?.message}>
          <TextInput
            type="text"
            placeholder={t('common:zipCode') + ' *'}
            error={errors?.address?.zipCode}
            register={register('address.zipCode')}
          />
        </ErrorValidationMessage>
      </div>
    </div>
  );
};

export default EditPatient;
