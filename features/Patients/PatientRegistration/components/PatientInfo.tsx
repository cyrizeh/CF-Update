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
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import DateField from '@/components/Forms/DateField/DateField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

type Props = {
  currentStep: number;
  patient?: any;
  setSkipPartner?: any;
  isPartner?: boolean;
};

const PatientInfo = ({ currentStep, patient, setSkipPartner, isPartner }: Props) => {
  const { t } = useTranslation('patients');

  const {
    watch,
    control,
    setValue,
    setError,
    clearErrors,
    register,
    formState: { errors },
  } = useFormContext<ViewTypes.PatientFormValues>();
  const getError = errors?.patient;

  useEffect(() => {
    if (patient) {
      setValue('patient.firstName', patient.firstName);
      setValue('patient.middleName', patient.middleName);
      setValue('patient.lastName', patient.lastName);
      setValue('patient.dateOfBirth', patient.dateOfBirth);
      setValue('patient.email', patient.email);
      setValue('patient.phoneNumber', convertPhoneNumberWithOutCode(patient.phoneNumber));
      setValue('patient.address.city', patient.address?.city);
      setValue('patient.address.state', patient.address?.state);
      setValue('patient.address.street1', patient.address?.street1);
      setValue('patient.address.street2', patient.address?.street2);
      setValue('patient.address.zipCode', patient.address?.zipCode);
      setValue('hasPartner', patient.signupSetup?.hasPartner);
    }
  }, [patient, setValue, watch]);

  return currentStep === 1 ? (
    <div className="flex flex-col  gap-5">
      <div className="flex flex-col">
        <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">Please enter your contact information.</p>
        <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">Please use your FULL LEGAL NAME.</p>
        <ErrorValidationMessage touched={getError?.firstName} message={getError?.firstName?.message}>
          <TextInput
            type="text"
            error={getError?.firstName}
            inputstyles="sensitive"
            placeholder={t('common:firstName') + ' *'}
            register={register('patient.firstName')}
          />
        </ErrorValidationMessage>
      </div>
      <ErrorValidationMessage touched={getError?.middleName} message={getError?.middleName?.message}>
        <TextInput
          type="text"
          placeholder={t('common:middleName')}
          inputstyles="sensitive"
          error={getError?.middleName}
          register={register('patient.middleName')}
        />
      </ErrorValidationMessage>

      <ErrorValidationMessage touched={getError?.lastName} message={getError?.lastName?.message}>
        <TextInput
          type="text"
          error={getError?.lastName}
          inputstyles="sensitive"
          placeholder={t('common:lastName') + ' *'}
          register={register('patient.lastName')}
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={getError?.dateOfBirth} message={getError?.dateOfBirth?.message}>
        <DateField
          setError={setError}
          clearErrors={clearErrors}
          control={control}
          name={'patient.dateOfBirth'}
          error={getError?.dateOfBirth}
          placeholder={t('common:birth')}
        />
      </ErrorValidationMessage>

      <div>
        <TextInput
          type="email"
          placeholder={t('common:email') + ' *'}
          adornments={{
            content: HiMail,
            position: 'start',
          }}
          disabled={patient}
          inputstyles="sensitive"
          register={register('patient.email')}
        />
      </div>

      <Controller
        render={({ field: { onChange, name, value } }) => (
          <PatternFormat
            onValueChange={v => onChange(v.value)}
            name={name}
            value={value}
            format="+1 (###) ###-####"
            allowEmptyFormatting
            mask="_"
            error={getError?.phoneNumber}
            customInput={TextInput}
            inputstyles="sensitive"
            adornments={{
              content: BsTelephoneFill,
              position: 'start',
            }}
          />
        )}
        name={'patient.phoneNumber'}
        control={control}
        defaultValue=""
      />
      <ErrorValidationMessage touched={getError?.address?.street1} message={getError?.address?.street1?.message}>
        <TextInput
          required
          type="text"
          placeholder={t('common:address1') + ' *'}
          error={getError?.address?.street1}
          register={register('patient.address.street1')}
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={getError?.address?.street2} message={getError?.address?.street2?.message}>
        <TextInput
          type="text"
          placeholder={t('common:address2')}
          error={getError?.address?.street2}
          register={register('patient.address.street2')}
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={getError?.address?.city} message={getError?.address?.city?.message}>
        <TextInput
          type="text"
          placeholder={t('common:city') + ' *'}
          error={getError?.address?.city}
          register={register('patient.address.city')}
        />
      </ErrorValidationMessage>

      <div className="grid grid-cols-2 gap-3">
        <div className="w-full">
          <ErrorValidationMessage touched={getError?.address?.state} message={getError?.address?.state?.message}>
            <CustomSelect
              control={control}
              error={getError?.address?.state}
              name={'patient.address.state'}
              options={statesWithId}
              placeholder={t('common:state') + ' *'}
            />
          </ErrorValidationMessage>
        </div>
        <ErrorValidationMessage touched={getError?.address?.zipCode} message={getError?.address?.zipCode?.message}>
          <TextInput
            type="text"
            error={getError?.address?.zipCode}
            placeholder={t('common:zipCode') + ' *'}
            register={register('patient.address.zipCode')}
          />
        </ErrorValidationMessage>
      </div>

      {!isPartner ? (
        <Checkbox
          register={register('hasPartner')}
          disabled={patient.partner}
          onChange={() => setSkipPartner(!watch('hasPartner'))}
          label={
            <div className={`text-sm font-normal leading-[21px] ${!patient.partner ? 'text-[#D1D5DB]' : 'text-white'}`}>
              {t('common:hasPartner')}
            </div>
          }
        />
      ) : null}
    </div>
  ) : null;
};

export default PatientInfo;
