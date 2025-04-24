import { HiMail } from 'react-icons/hi';
import { useFormContext } from 'react-hook-form';
import { ViewTypes } from '@/types';
import TextInput from '@/components/Forms/TextInput/TextInput';
import useTranslation from 'next-translate/useTranslation';
import classNames from 'classnames';
import { useEffect } from 'react';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

// eslint-disable-next-line no-unused-vars
const EmergencyInfo = ({
  currentStep,
  setSkipEmergency,
  patient,
  skipEmergency,
}: {
  currentStep: number;
  setSkipEmergency: (v: boolean) => void;
  patient: any;
  skipEmergency: boolean;
}) => {
  const { t } = useTranslation('patients');

  const {
    register,
    formState: {
      errors: { emergencyInfo: errors },
    },
    setValue,
    watch,
  } = useFormContext<ViewTypes.PatientFormValues>();

  const onChangeTab = (tab: number) => {
    setSkipEmergency(!!tab);
  };

  useEffect(() => {
    if (patient?.emergencyContact) {
      setValue('emergencyInfo.contactName', patient?.emergencyContact?.name);
      setValue('emergencyInfo.contactEmail', patient?.emergencyContact?.email);
      setValue('emergencyInfo.contactAddress', patient?.emergencyContact?.address);
    }
  }, [patient, setValue, watch]);

  return currentStep === 3 ? (
    <div className="flex flex-col gap-5">
      <div className="mb-2 flex h-[53px] w-full overflow-hidden rounded-lg bg-[#292B2C] text-sm font-medium leading-[21px] text-gray-400 shadow">
        <label
          htmlFor="field-rain"
          className={classNames('check-hidden flex w-2/4 cursor-pointer items-center justify-center', {
            'bg-gradient-to-r from-blue-600 to-teal-400 text-white': skipEmergency === false,
          })}>
          <input
            {...register('skipEmergency')}
            type="radio"
            value="connectEmergency"
            id="field-rain"
            onClick={() => onChangeTab(0)}
          />
          {t('step3.connectEmergency', { ns: 'patients' })}
        </label>

        <label
          htmlFor="field-wind"
          className={classNames('check-hidden flex w-2/4 cursor-pointer items-center justify-center', {
            'bg-gradient-to-r from-blue-600 to-teal-400 text-white': skipEmergency === true,
          })}>
          <input
            {...register('skipEmergency')}
            type="radio"
            value="skipEmergency"
            id="field-wind"
            onClick={() => onChangeTab(1)}
          />
          {t('step3.skipEmergency', { ns: 'patients' })}
        </label>
      </div>

      {errors?.type === 'general' && <div className="text-xs text-rose-400">{errors?.message}</div>}

      <div className={classNames('flex flex-col gap-5', { hidden: skipEmergency === true })}>
        <div>
          <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">
            If you would like to add an Emergency Contact to your account, please add their details below. Or click on
            “Skip Partner” to proceed without an Emergency Contact. After clicking “Create Account”, you will be
            prompted to complete the storage and transfer consents and to complete Registration.
          </p>
          <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">
            After clicking “Create Account”, you will be prompted to complete the storage and transfer consents and to
            complete Registration.
          </p>
          <ErrorValidationMessage touched={errors?.contactName} message={errors?.contactName?.message}>
            <TextInput
              type="text"
              placeholder={t('step3.contactName', { ns: 'patients' })}
              error={errors?.contactName}
              register={register('emergencyInfo.contactName')}
              inputstyles="sensitive"
            />
          </ErrorValidationMessage>
        </div>
        <ErrorValidationMessage touched={errors?.contactEmail} message={errors?.contactEmail?.message}>
          <TextInput
            placeholder={t('step3.contactEmail', { ns: 'patients' })}
            adornments={{
              position: 'start',
              content: HiMail,
            }}
            inputstyles="sensitive"
            type="email"
            error={errors?.contactEmail}
            register={register('emergencyInfo.contactEmail')}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage touched={errors?.contactAddress} message={errors?.contactAddress?.message}>
          <TextInput
            type="text"
            placeholder={t('step3.contactAddress', { ns: 'patients' })}
            error={errors?.contactAddress}
            register={register('emergencyInfo.contactAddress')}
          />
        </ErrorValidationMessage>
      </div>
    </div>
  ) : null;
};

export default EmergencyInfo;
