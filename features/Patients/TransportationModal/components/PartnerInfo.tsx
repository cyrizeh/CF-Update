import { useFormContext } from 'react-hook-form';
import { HiMail } from 'react-icons/hi';
import TextInput from '@/components/Forms/TextInput/TextInput';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { ViewTypes } from '@/types';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import { Controller } from 'react-hook-form';
import { BsTelephoneFill } from 'react-icons/bs';
import { PatternFormat } from 'react-number-format';
import { debounce } from 'lodash';
import { axiosInstance } from '@/api/axiosConfig';
import { convertPhoneNumberWithOutCode } from '@/utils/normalizePhoneNumber';
import { Button } from 'flowbite-react';
import { TUser } from '@/types/view';
import { toast } from 'react-toastify';

const PartnerInfo = ({ currentStep, partner, isOpen }: { currentStep: number; partner?: any; isOpen: boolean }) => {
  const { t } = useTranslation('patients');
  const {
    register,
    setValue,
    control,
    setError,
    clearErrors,
    watch,
    formState: {
      errors: { partner: errors },
    },
  } = useFormContext<ViewTypes.PatientFormValues>();

  const [initialUser, setInitialUser] = useState<TUser | null>(null);
  const [isAutocomplete, setIsAutocomplete] = useState(false);
  const [hasUsedAutocomplete, setHasUsedAutocomplete] = useState(false);

  const findUser = debounce(async (e: any) => {
    const { value } = e.target;
    const email = encodeURIComponent(value);

    // Reset isValidPartner when email changes
    setValue('partner.isValidPartner', true);
    clearErrors('partner.isValidPartner');

    //@ts-ignore
    const patientEmail = watch('transportation.email');
    if (patientEmail === value) {
      setValue('partner.isValidPartner', false); // Set to false if the user is already a partner
      setError('partner.isValidPartner', { type: 'manual', message: 'This user is already a partner' });
    }

    if (email) {
      setValue('partner.email', value);
      const { data: user } = await axiosInstance.get(`admin/patients/find?Email=${email}`);
      setInitialUser(user || null);

      if (user?.partner?.id) {
        setValue('partner.isValidPartner', false); // Set to false if the user is already a partner
        setError('partner.isValidPartner', { type: 'manual', message: 'This user is already a partner' });
      }

      if (user && hasUsedAutocomplete) {
        setValue('partner.email', user.email);
        setValue('partner.firstName', user.firstName);
        setValue('partner.lastName', user.lastName);
        setValue('partner.phoneNumber', convertPhoneNumberWithOutCode(user.phoneNumber));
        setValue('partner.partnerId', user.id);
      }
    } else {
      if (isAutocomplete) return setIsAutocomplete(false);
      setInitialUser(null);
      setValue('partner.partnerId', undefined);
    }
  }, 1000);

  useEffect(() => {
    if (!watch('partner.email')) {
      setInitialUser(null);
    }
    setIsAutocomplete(false);
  }, [currentStep, initialUser, watch]);

  const autocompletePatient = () => {
    if (initialUser) {
      if (isAutocomplete) return setIsAutocomplete(false);
      setIsAutocomplete(true);
      setHasUsedAutocomplete(true);
      setValue('partner.email', initialUser.email);
      setValue('partner.firstName', initialUser.firstName);
      setValue('partner.lastName', initialUser.lastName);
      setValue('partner.phoneNumber', convertPhoneNumberWithOutCode(initialUser.phoneNumber));
      setValue('partner.partnerId', initialUser.id);
      setValue('partner.isAutocomplete', true);
    }
  };

  useEffect(() => {
    if (partner) {
      setValue('partner.firstName', partner.firstName);
      setValue('partner.middleName', partner.middleName);
      setValue('partner.lastName', partner.lastName);
      setValue('partner.email', partner.email);
      setValue('partner.phoneNumber', convertPhoneNumberWithOutCode(partner.phoneNumber));
      setValue('partner.partnerId', partner.id);
    }
  }, [setValue, partner, isOpen]);

  useEffect(() => {
    // if modal was closed we clear initial user
    if (isOpen && !!initialUser) {
      setInitialUser(null);
      setHasUsedAutocomplete(false); // reset state if modal open again
    }
  }, [isOpen]);

  return currentStep === 2 ? (
    <>
      <div className="flex flex-col">
        <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{t('step1.partnerTitle')}</p>
        <ErrorValidationMessage touched={errors?.isValidPartner} message={errors?.isValidPartner?.message}>
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
                inputstyles="sensitive"
                onChange={findUser}
                register={register('partner.email')}
                disabled={isAutocomplete || partner}
                error={errors?.email || errors?.isValidPartner}
              />
              {initialUser && (
                <Button onClick={autocompletePatient} className="mt-8 h-[43.5px] w-[100%]" gradientDuoTone="primary">
                  {isAutocomplete ? 'Return' : 'Auto'}
                </Button>
              )}
            </div>
          </ErrorValidationMessage>
        </ErrorValidationMessage>

        <ErrorValidationMessage touched={errors?.firstName} message={errors?.firstName?.message}>
          <TextInput
            label
            type="text"
            placeholder={t('common:firstName') + ' *'}
            register={register('partner.firstName')}
            disabled={isAutocomplete}
            error={errors?.firstName}
            inputstyles="sensitive"
          />
        </ErrorValidationMessage>

        <ErrorValidationMessage touched={errors?.lastName} message={errors?.lastName?.message}>
          <TextInput
            label
            type="text"
            placeholder={t('common:lastName') + ' *'}
            register={register('partner.lastName')}
            disabled={isAutocomplete}
            error={errors?.lastName}
            inputstyles="sensitive"
          />
        </ErrorValidationMessage>

        <Controller
          render={({ field: { onChange, name, value } }) => (
            <ErrorValidationMessage touched={errors?.phoneNumber} message={errors?.phoneNumber?.message}>
              <PatternFormat
                onValueChange={v => onChange(v.value)}
                name={name}
                value={value || ''}
                label="Phone Number *"
                format="+1 (###) ###-####"
                allowEmptyFormatting
                mask="_"
                customInput={TextInput}
                adornments={{
                  content: BsTelephoneFill,
                  position: 'start',
                }}
                error={errors?.phoneNumber}
                disabled={isAutocomplete}
                inputstyles="sensitive"
              />
            </ErrorValidationMessage>
          )}
          name="partner.phoneNumber"
          control={control}
        />
      </div>
    </>
  ) : null;
};

export default PartnerInfo;
