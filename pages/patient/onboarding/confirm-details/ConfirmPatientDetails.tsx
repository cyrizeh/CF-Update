import { useEffect } from 'react';
import { HiMail } from 'react-icons/hi';
import { PatternFormat } from 'react-number-format';
import { BsTelephoneFill } from 'react-icons/bs';
import { Controller, useFormContext } from 'react-hook-form';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { statesWithId } from '@/constants/states';
import CustomSelect from '@/components/Forms/Select/Select';
import { convertPhoneNumberWithOutCode } from '@/utils/normalizePhoneNumber';
import DateField from '@/components/Forms/DateField/DateField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

type Props = {
  patient?: any;
};

const ConfirmPatientDetails = ({ patient }: Props) => {
  const { t } = useTranslation('patients');

  const {
    watch,
    control,
    setValue,
    setError,
    clearErrors,
    register,
    formState: { errors },
  } = useFormContext<ViewTypes.ConfirmDetailsFormValues>();

  // const errors = errors?.patient;

  useEffect(() => {
    if (patient) {
      setValue('firstName', patient.firstName);
      setValue('middleName', patient.middleName);
      setValue('lastName', patient.lastName);
      setValue('dateOfBirth', patient.dateOfBirth);
      setValue('email', patient.email);
      setValue('phoneNumber', convertPhoneNumberWithOutCode(patient.phoneNumber));
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
          Welcome to CryoFuture’s Patient Portal. To continue, please confirm your account details below.{' '}
        </p>
        <ErrorValidationMessage touched={errors?.firstName} message={errors?.firstName?.message}>
          <TextInput
            type="text"
            error={errors?.firstName}
            placeholder={t('common:firstName') + ' *'}
            register={register('firstName')}
            inputstyles="sensitive"
          />
        </ErrorValidationMessage>
      </div>
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
        />
      </ErrorValidationMessage>

      <div>
        {/* <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{title()}</p> */}

        <TextInput
          type="email"
          placeholder={t('common:email') + ' *'}
          adornments={{
            content: HiMail,
            position: 'start',
          }}
          disabled={patient}
          // error={errors?.email}
          register={register('email')}
          inputstyles="sensitive"
        />
      </div>

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
              adornments={{
                content: BsTelephoneFill,
                position: 'start',
              }}
            />
          </ErrorValidationMessage>
        )}
        name={'phoneNumber'}
        control={control}
        defaultValue=""
      />
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
        // value={disabled ? patientContactInfo?.address.street2 : contactInfo.address.street2}
      />

      <ErrorValidationMessage touched={errors?.address?.city} message={errors?.address?.city?.message}>
        <TextInput
          type="text"
          placeholder={t('common:city') + ' *'}
          error={errors?.address?.city}
          // value={disabled ? patientContactInfo?.address.city : contactInfo.address.city}
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

export default ConfirmPatientDetails;
