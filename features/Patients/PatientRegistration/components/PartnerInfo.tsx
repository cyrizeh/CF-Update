import { useFormContext } from 'react-hook-form';
import { HiMail } from 'react-icons/hi';
import TextInput from '@/components/Forms/TextInput/TextInput';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { ViewTypes } from '@/types';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

type Props = {
  // eslint-disable-next-line no-unused-vars
  currentStep: number;
  partner?: any;
};

const PartnerInfo = ({ currentStep, partner }: Props) => {
  const { t } = useTranslation('patients');

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<ViewTypes.PatientFormValues>();

  const getError = errors?.partner;

  useEffect(() => {
    if (partner) {
      setValue('partner.firstName', partner.firstName);
      setValue('partner.middleName', partner.middleName);
      setValue('partner.lastName', partner.lastName);
      setValue('partner.email', partner.email);
    }
  }, [setValue, partner]);

  return currentStep === 2 ? (
    <>
      <p className="mb-1 text-sm font-normal leading-[21px] text-gray-50">
        {' '}
        After adding your partner’s contact info, we will send them a verification email with a link to create their
        account. Your partner will also need to complete the registration process and will be prompted through the
        registration portal to sign the joint consents that you will be provided with after you have created your
        account.
      </p>
      <p className="mb-4  text-sm font-normal leading-[21px] text-gray-50">
        {' '}
        Please double check that you have entered your partner’s email correctly as your partner will not be able to
        edit their email until after the registration is complete.
      </p>
      <div className="mb-2 flex flex-col gap-5">
        {/* {getError?.type === 'general' && <div className="text-xs text-rose-400">{getError?.message}</div>} */}
        <ErrorValidationMessage touched={getError?.firstName} message={getError?.firstName?.message}>
          <TextInput
            type="text"
            error={getError?.firstName}
            placeholder={t('common:firstName') + ' *'}
            register={register('partner.firstName')}
            inputstyles="sensitive"
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage touched={getError?.middleName} message={getError?.middleName?.message}>
          <TextInput
            type="text"
            placeholder={t('common:middleName')}
            error={getError?.middleName}
            register={register('partner.middleName')}
            inputstyles="sensitive"
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage touched={getError?.lastName} message={getError?.lastName?.message}>
          <TextInput
            type="text"
            error={getError?.lastName}
            placeholder={t('common:lastName') + ' *'}
            register={register('partner.lastName')}
            inputstyles="sensitive"
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage touched={getError?.email} message={getError?.email?.message}>
          <TextInput
            type="email"
            placeholder={t('common:email') + ' *'}
            adornments={{
              content: HiMail,
              position: 'start',
            }}
            inputstyles="sensitive"
            error={getError?.email}
            register={register('partner.email')}
          />
        </ErrorValidationMessage>
      </div>
    </>
  ) : null;
};

export default PartnerInfo;
