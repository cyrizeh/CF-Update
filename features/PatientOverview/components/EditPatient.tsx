import { Controller, useFormContext } from 'react-hook-form';

import TextInput from '@/components/Forms/TextInput/TextInput';

import DateField from '@/components/Forms/DateField/DateField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import { statesWithId } from '@/constants/states';
import { ViewTypes } from '@/types';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import { PatternFormat } from 'react-number-format';
const EditPatient = () => {
  const { t } = useTranslation('patient');

  const {
    control,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<ViewTypes.EditPatientProfileFormValues>();

  return (
    <div className="flex max-w-md flex-col gap-4">
      <ErrorValidationMessage touched={errors?.firstName} message={errors?.firstName?.message}>
        <TextInput
          type="text"
          error={errors?.firstName}
          placeholder={t('common:firstName') + ' *'}
          register={register('firstName')}
          inputstyles="sensitive"
        />
      </ErrorValidationMessage>

      <ErrorValidationMessage touched={errors?.middleName} message={errors?.middleName?.message}>
        <TextInput
          type="text"
          placeholder={t('common:middleName')}
          error={errors?.middleName}
          register={register('middleName')}
          inputstyles="sensitive"
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={errors?.lastName} message={errors?.lastName?.message}>
        <TextInput
          type="text"
          error={errors?.lastName}
          placeholder={t('common:lastName') + ' *'}
          register={register('lastName')}
          inputstyles="sensitive"
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={errors?.dateOfBirth} message={errors?.dateOfBirth?.message}>
        <DateField
          setError={setError}
          clearErrors={clearErrors}
          control={control}
          name={'dateOfBirth'}
          error={errors?.dateOfBirth}
          placeholder={t('common:birth')}
          maxDate={dayjs()}
        />
      </ErrorValidationMessage>
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
          placeholder={t('common:email')}
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
          placeholder={t('common:addressLine1')}
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
          placeholder={t('common:city')}
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
            placeholder={t('common:selectState')}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage touched={errors?.address?.zipCode} message={errors?.address?.zipCode?.message}>
          <TextInput
            type="text"
            placeholder={t('common:zipCode')}
            error={errors?.address?.zipCode}
            register={register('address.zipCode')}
          />
        </ErrorValidationMessage>
      </div>
    </div>
  );
};

export default EditPatient;
