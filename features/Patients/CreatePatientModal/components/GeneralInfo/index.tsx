import { useFormContext } from 'react-hook-form';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';

import DateField from '@/components/Forms/DateField/DateField';
import { useEffect } from 'react';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import dayjs from 'dayjs';

type Props = {
  partner?: boolean;
  partnerInfo?: any;
  patient?: any;
};

const GeneralInfo = ({ partner, partnerInfo, patient }: Props) => {
  const { t } = useTranslation('patients');

  const {
    control,
    register,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useFormContext<ViewTypes.PatientFormValues>();

  const getError = partner ? errors?.partner : errors?.patient;

  const title = () => (partner ? t('step1.partnerTitle') : t('step1.patientTitle'));

  useEffect(() => {
    if (patient) {
      setValue('patient.firstName', patient.firstName);
      setValue('patient.middleName', patient.middleName);
      setValue('patient.lastName', patient.lastName);
      setValue('patient.dateOfBirth', patient.dateOfBirth);
    }
    if (partnerInfo) {
      setValue('partner.firstName', partnerInfo.firstName);
      setValue('partner.middleName', partnerInfo.middleName);
      setValue('partner.lastName', partnerInfo.lastName);
    }
  }, [setValue, partnerInfo, patient]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{title()}</p>
        <ErrorValidationMessage touched={getError?.firstName} message={getError?.firstName?.message}>
          <TextInput
            type="text"
            inputstyles="sensitive"
            placeholder={t('common:firstName') + ' *'}
            register={register(partner ? 'partner.firstName' : 'patient.firstName')}
            error={getError?.firstName}
          />
        </ErrorValidationMessage>
      </div>

      <TextInput
        type="text"
        inputstyles="sensitive"
        placeholder={t('common:middleName')}
        error={getError?.middleName}
        register={register(partner ? 'partner.middleName' : 'patient.middleName')}
      />
      <ErrorValidationMessage touched={getError?.lastName} message={getError?.lastName?.message}>
        <TextInput
          type="text"
          inputstyles="sensitive"
          placeholder={t('common:lastName') + ' *'}
          register={register(partner ? 'partner.lastName' : 'patient.lastName')}
          error={getError?.lastName}
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={getError?.dateOfBirth} message={getError?.dateOfBirth?.message}>
        <DateField
          setError={setError}
          clearErrors={clearErrors}
          control={control}
          name={partner ? 'partner.dateOfBirth' : 'patient.dateOfBirth'}
          error={getError?.dateOfBirth}
          placeholder={t('common:birth')}
          maxDate={dayjs()}
        />
      </ErrorValidationMessage>
    </div>
  );
};

export default GeneralInfo;
