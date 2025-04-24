import { useEffect } from 'react';
import { HiMail } from 'react-icons/hi';
import { PatternFormat } from 'react-number-format';
import { BsTelephoneFill } from 'react-icons/bs';
import { Controller, useFormContext } from 'react-hook-form';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

import { ViewTypes } from '@/types';

import useTranslation from 'next-translate/useTranslation';
import { statesWithId } from '@/constants/states';
import CustomSelect from '@/components/Forms/Select/Select';
import { convertPhoneNumberWithOutCode } from '@/utils/normalizePhoneNumber';

type Props = {
  disabled?: boolean;
  partner?: boolean;
  partnerInfo?: any;
  patient?: any;
};

const ContactInfo = ({ disabled, partner, partnerInfo, patient }: Props) => {
  const { t } = useTranslation('patients');

  const {
    watch,
    control,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<ViewTypes.PatientFormValues>();

  const getError = partner ? errors?.partner : errors?.patient;

  const title = () => (partner ? t('step1.partnerContact') : t('step1.patientContact'));

  useEffect(() => {
    if (patient) {
      setValue('patient.email', patient.email);
      setValue('patient.note', patient?.notes[0]?.text || '');
      setValue('patient.phoneNumber', convertPhoneNumberWithOutCode(patient.phoneNumber));
      setValue('patient.address.city', patient.address?.city);
      setValue('patient.address.state', patient.address?.state);
      setValue('patient.address.street1', patient.address?.street1);
      setValue('patient.address.street2', patient.address?.street2);
      setValue('patient.address.zipCode', patient.address?.zipCode);
    }
  }, [patient, setValue, watch]);

  useEffect(() => {
    if (disabled) {
      setValue('partner.address.city', watch('patient.address.city'));
      setValue('partner.address.state', watch('patient.address.state'));
      setValue('partner.address.street1', watch('patient.address.street1'));
      setValue('partner.address.street2', watch('patient.address.street2'));
      setValue('partner.address.zipCode', watch('patient.address.zipCode'));
    } else {
      setValue('partner.address.city', watch('partner.temp.address.zipCode') || partnerInfo?.address?.city || '');
      setValue('partner.address.state', watch('partner.temp.address.state') || partnerInfo?.address?.state || '');
      setValue('partner.address.street1', watch('partner.temp.address.street1') || partnerInfo?.address?.street1 || '');
      setValue('partner.address.street2', watch('partner.temp.address.street2') || partnerInfo?.address?.street2 || '');
      setValue('partner.address.zipCode', watch('partner.temp.address.zipCode') || partnerInfo?.address?.zipCode || '');
    }
  }, [disabled, setValue, watch, partnerInfo]);

  return (
    <div className="mt-6 flex flex-col gap-5">
      <div>
        <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{title()}</p>
        <ErrorValidationMessage touched={getError?.email} message={getError?.email?.message}>
          <TextInput
            type="email"
            inputstyles="sensitive"
            placeholder={t('common:email')}
            adornments={{
              content: HiMail,
              position: 'start',
            }}
            register={register(partner ? 'partner.email' : 'patient.email')}
            error={getError?.email}
          />
        </ErrorValidationMessage>
      </div>
      <ErrorValidationMessage touched={getError?.note} message={getError?.note?.message}>
        <TextInput
          type="text"
          placeholder={t('common:note')}
          register={register(partner ? 'partner.note' : 'patient.note')}
          error={getError?.note}
        />
      </ErrorValidationMessage>

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
        name={partner ? 'partner.phoneNumber' : 'patient.phoneNumber'}
        control={control}
        defaultValue=""
      />
      <ErrorValidationMessage touched={getError?.address?.street1} message={getError?.address?.street1?.message}>
        <TextInput
          required
          type="text"
          placeholder={t('common:addressLine1')}
          disabled={disabled}
          register={register(partner ? 'partner.address.street1' : 'patient.address.street1')}
          error={getError?.address?.street1}
        />
      </ErrorValidationMessage>

      <ErrorValidationMessage touched={getError?.address?.street2} message={getError?.address?.street2?.message}>
        <TextInput
          type="text"
          placeholder={t('common:addressLine2')}
          disabled={disabled}
          register={register(partner ? 'partner.address.street2' : 'patient.address.street2')}
          // value={disabled ? patientContactInfo?.address.street2 : contactInfo.address.street2}
          error={getError?.address?.street2}
        />
      </ErrorValidationMessage>

      <ErrorValidationMessage touched={getError?.address?.city} message={getError?.address?.city?.message}>
        <TextInput
          type="text"
          placeholder={t('common:city')}
          disabled={disabled}
          // value={disabled ? patientContactInfo?.address.city : contactInfo.address.city}
          register={register(partner ? 'partner.address.city' : 'patient.address.city')}
          error={getError?.address?.city}
        />
      </ErrorValidationMessage>

      <div className="grid grid-cols-2 gap-3">
        <ErrorValidationMessage touched={getError?.address?.state} message={getError?.address?.state?.message}>
          <CustomSelect
            control={control}
            error={getError?.address?.state}
            name={partner ? 'partner.address.state' : 'patient.address.state'}
            options={statesWithId}
            placeholder={t('common:state')}
          />
        </ErrorValidationMessage>

        <ErrorValidationMessage touched={getError?.address?.zipCode} message={getError?.address?.zipCode?.message}>
          <TextInput
            type="text"
            error={getError?.address?.zipCode}
            placeholder={t('common:zipCode')}
            disabled={disabled}
            register={register(partner ? 'partner.address.zipCode' : 'patient.address.zipCode')}
          />
        </ErrorValidationMessage>
      </div>
    </div>
  );
};

export default ContactInfo;
