import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { Controller, useFormContext } from 'react-hook-form';
import { HiMail } from 'react-icons/hi';
import { BsTelephoneFill } from 'react-icons/bs';
import { PatternFormat } from 'react-number-format';
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axiosConfig';
import { debounce } from 'lodash';
import { Button } from 'flowbite-react';
import { convertPhoneNumberWithOutCode } from '@/utils/normalizePhoneNumber';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import { TUser } from '@/types/view';

const PatientInfo = ({
  currentStep,
  patient,
  isEditMode,
  isOpen,
  setSkipPartner,
  hasPartner,
  setPartner,
}: {
  currentStep: number;
  patient: any;
  isEditMode?: boolean;
  isOpen: boolean;
  setSkipPartner?: any;
  hasPartner?: boolean;
  setPartner?: any;
}) => {
  const {
    register,
    control,
    setValue,
    watch,
    clearErrors,
    formState: {
      errors: { transportation: errors },
    },
  } = useFormContext<ViewTypes.TransportationFormValues>();
  const { t } = useTranslation('transportation');

  const [initialUser, setInitialUser] = useState<TUser | null>(null);
  const [isAutocomplete, setIsAutocomplete] = useState(false);
  const [hasUsedAutocomplete, setHasUsedAutocomplete] = useState(false);

  const findUser = debounce(async (e: any) => {
    const { value } = e.target;
    const email = encodeURIComponent(value);

    if (email) {
      setValue('transportation.email', value);
      const { data: user } = await axiosInstance.get(`admin/patients/find?Email=${email}`);
      if (user) {
        setInitialUser(user);
        if (hasUsedAutocomplete) {
          setValue('transportation.email', user.email);
          setValue('transportation.firstName', user.firstName);
          setValue('transportation.lastName', user.lastName);
          setValue('transportation.note', user.note);
          setValue('transportation.phoneNumber', convertPhoneNumberWithOutCode(user.phoneNumber));
          setValue('transportation.patientId', user.id);
          setValue('transportation.hasPartner', !!user.partner ? true : false);
          setPartner(user.partner);
        }
      } else {
        setInitialUser(null);
        setValue('transportation.patientId', undefined);
        setPartner(null);
        setValue('partner.email', '');
        setValue('partner.firstName', '');
        setValue('partner.lastName', '');
        setValue('partner.phoneNumber', '');
        setValue('partner.partnerId', '');
      }
    } else {
      if (isAutocomplete) return setIsAutocomplete(false);
      setInitialUser(null);
      setValue('transportation.patientId', undefined);
    }
  }, 1000);

  const autocompletePatient = () => {
    if (initialUser) {
      if (isAutocomplete) {
        setIsAutocomplete(false);
        return;
      }
      setIsAutocomplete(true);
      setHasUsedAutocomplete(true);
      setValue('transportation.email', initialUser.email);
      setValue('transportation.firstName', initialUser.firstName);
      setValue('transportation.lastName', initialUser.lastName);
      setValue('transportation.note', initialUser.note);
      setValue('transportation.phoneNumber', convertPhoneNumberWithOutCode(initialUser.phoneNumber));
      setValue('transportation.patientId', initialUser.id);
      setValue('transportation.hasPartner', !!initialUser.partner ? true : false);
      setPartner(initialUser.partner);
    }
  };

  useEffect(() => {
    if (!watch('transportation.email')) {
      setInitialUser(null);
    }
    setIsAutocomplete(false);
  }, [currentStep, initialUser, watch]);

  useEffect(() => {
    if (patient) {
      setIsAutocomplete(true);
      setValue('transportation.email', patient.email);
      setValue('transportation.firstName', patient.firstName);
      setValue('transportation.lastName', patient.lastName);
      setValue('transportation.note', '');
      setValue('transportation.phoneNumber', convertPhoneNumberWithOutCode(patient.phoneNumber));
      setValue('transportation.hasPartner', hasPartner as boolean);
    }
  }, [patient, isOpen]);
  useEffect(() => {
    // if modal was closed we clear initial user
    if (isOpen && !!initialUser) {
      setInitialUser(null);
      setHasUsedAutocomplete(false); // reset state if modal open again
    }
    // clear errors if close modal
    clearErrors();
  }, [isOpen]);

  return currentStep === 1 ? (
    <div className="flex flex-col">
      <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{t('patient.title')}</p>
      <ErrorValidationMessage touched={errors?.email} message={errors?.email?.message}>
        <div className="flex w-full justify-between gap-2">
          <TextInput
            label
            full
            type="email"
            placeholder={t('common:email') + ' *'}
            adornments={{
              content: HiMail,
              position: 'start',
            }}
            onChange={findUser}
            register={register('transportation.email')}
            disabled={isAutocomplete || isEditMode}
            error={errors?.email}
            inputstyles="sensitive"
          />

          {initialUser && (
            <Button onClick={autocompletePatient} className="mt-8 h-[43.5px] w-[100%]" gradientDuoTone="primary">
              {isAutocomplete ? 'Return' : 'Auto'}
            </Button>
          )}
        </div>
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={errors?.firstName} message={errors?.firstName?.message}>
        <TextInput
          label
          type="text"
          placeholder={t('common:firstName') + ' *'}
          register={register('transportation.firstName')}
          disabled={isAutocomplete && !isEditMode}
          error={errors?.firstName}
          inputstyles="sensitive"
        />
      </ErrorValidationMessage>

      <ErrorValidationMessage touched={errors?.lastName} message={errors?.lastName?.message}>
        <TextInput
          label
          type="text"
          placeholder={t('common:lastName') + ' *'}
          register={register('transportation.lastName')}
          disabled={isAutocomplete && !isEditMode}
          error={errors?.lastName}
          inputstyles="sensitive"
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={errors?.phoneNumber} message={errors?.phoneNumber?.message}>
        <Controller
          render={({ field: { onChange, name, value } }) => (
            <PatternFormat
              onValueChange={v => onChange(v.value)}
              name={name}
              value={value}
              format="+1 (###) ###-####"
              allowEmptyFormatting
              mask="_"
              label="Phone Number *"
              error={errors?.phoneNumber}
              customInput={TextInput}
              adornments={{
                content: BsTelephoneFill,
                position: 'start',
              }}
              disabled={isAutocomplete && !isEditMode}
              inputstyles="sensitive"
            />
          )}
          name={'transportation.phoneNumber'}
          control={control}
          defaultValue=""
        />
      </ErrorValidationMessage>

      {!isEditMode ? (
        <ErrorValidationMessage touched={errors?.note} message={errors?.note?.message}>
          <TextInput
            label
            type="text"
            placeholder={t('common:note')}
            register={register('transportation.note')}
            error={errors?.note}
          />
        </ErrorValidationMessage>
      ) : null}
      <div className="mt-2">
        {/* <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{t('partnerAccount')}</p> */}
        <Checkbox
          register={register('transportation.hasPartner')}
          onChange={() => setSkipPartner(!watch('transportation.hasPartner'))}
          label={<div className={`text-sm font-normal leading-[21px] text-white`}>{t('hasPartner')}</div>}
        />
      </div>
    </div>
  ) : null;
};

export default PatientInfo;
