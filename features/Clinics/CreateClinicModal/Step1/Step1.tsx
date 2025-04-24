import useTranslation from 'next-translate/useTranslation';
import { Controller, useFormContext } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { clinicTypes } from '@/constants/clinics';
import { ViewTypes } from '@/types';

const Step1 = () => {
  const { t } = useTranslation('clinics');

  const {
    watch,
    register,
    control,
    formState: {
      errors: { details: errors },
    },
  } = useFormContext<ViewTypes.ClinicFormValues>();

  return (
    <form data-testid="step1-form" className="flex max-w-md flex-col gap-4">
      {/* {errors?.type === 'general' && <div className="text-xs text-rose-400">{errors?.message}</div>} */}
      <div className="label-with-help">
        <div data-testid="clinic-details-label" className="text-sm font-normal">
          {t('step1.clinicDetails')}
        </div>
      </div>
      <ErrorValidationMessage touched={errors?.name} message={errors?.name?.message}>
        <TextInput
          data-testid="clinic-name-input"
          type="text"
          placeholder={t('step1.name') + ' *'}
          register={register('details.name')}
          error={errors?.name}
        />
      </ErrorValidationMessage>
      <ErrorValidationMessage touched={errors?.accountId} message={errors?.accountId?.message}>
        <Autocomplete2
          defaultValue={watch('details.accountId')}
          url="/Accounts"
          control={control}
          name={'details.accountId'}
          error={errors?.accountId}
          placeholder={t('step1.selectClinic')}
        />
      </ErrorValidationMessage>
      <div className="clinic-type flex flex-row items-center justify-between gap-5">
        <div className="w-full">
          <ErrorValidationMessage touched={errors?.clinicType} message={errors?.clinicType?.message}>
            <CustomSelect
              dataTestId="clinic-type-select"
              options={clinicTypes}
              placeholder={t('step1.selectType') + ' *'}
              error={errors?.clinicType}
              control={control}
              name="details.clinicType"
            />
          </ErrorValidationMessage>
        </div>
      </div>
      <div className="label-with-help mt-2">
        <div className="text-sm font-normal">{t('step1.primaryContactTitle')}</div>
        <p data-testid="primary-contact-subtitle" className="text-sm font-light leading-tight text-gray-300">
          {t('step1.primaryContactSubtitle')}
        </p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-5">
        <ErrorValidationMessage
          touched={errors?.contactDetails?.firstName}
          message={errors?.contactDetails?.firstName?.message}>
          <TextInput
            data-testid="primary-firstname-input"
            type="text"
            placeholder={t('common:firstName')}
            register={register('details.contactDetails.firstName')}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage
          touched={errors?.contactDetails?.lastName}
          message={errors?.contactDetails?.lastName?.message}>
          <TextInput
            data-testid="primary-lastname-input"
            type="text"
            placeholder={t('common:lastName')}
            register={register('details.contactDetails.lastName')}
          />
        </ErrorValidationMessage>
      </div>
      {}
      <ErrorValidationMessage
        touched={errors?.contactDetails?.jobTitle}
        message={errors?.contactDetails?.jobTitle?.message}>
        <TextInput
          data-testid="primary-jobtitle-input"
          type="text"
          placeholder={t('common:jobTitle')}
          register={register('details.contactDetails.jobTitle')}
        />
      </ErrorValidationMessage>
      <div className="grid grid-cols-2 gap-5">
        <ErrorValidationMessage
          touched={errors?.contactDetails?.email}
          message={errors?.contactDetails?.email?.message}>
          <TextInput
            data-testid="primary-email-input"
            type="email"
            placeholder={t('common:email')}
            register={register('details.contactDetails.email')}
          />
        </ErrorValidationMessage>

        <Controller
          render={({ field: { onChange, name, value } }) => (
            <ErrorValidationMessage
              touched={errors?.contactDetails?.phoneNumber}
              message={errors?.contactDetails?.phoneNumber?.message}>
              <PatternFormat
                onValueChange={v => onChange(v.value)}
                name={name}
                value={value}
                format="+1 (###) ###-####"
                allowEmptyFormatting
                mask="_"
                error={errors?.contactDetails?.phoneNumber}
                customInput={TextInput}
                data-testid="primary-phone-input"
              />
            </ErrorValidationMessage>
          )}
          defaultValue=""
          name={'details.contactDetails.phoneNumber'}
          control={control}
        />
      </div>
      <div className="label-with-help mt-2">
        <div data-testid="secondary-contact-title" className="text-sm font-normal">
          {t('step1.secondaryContactTitle')}
        </div>
        <p data-testid="secondary-contact-subtitle" className="text-sm font-light leading-tight text-gray-300">
          {t('step1.primaryContactSubtitle')}
        </p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-5">
        <ErrorValidationMessage
          touched={errors?.secondaryContactDetails?.firstName}
          message={errors?.secondaryContactDetails?.firstName?.message}>
          <TextInput
            data-testid="secondary-firstname-input"
            type="text"
            placeholder={t('common:firstName')}
            register={register('details.secondaryContactDetails.firstName')}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage
          touched={errors?.secondaryContactDetails?.lastName}
          message={errors?.secondaryContactDetails?.lastName?.message}>
          <TextInput
            data-testid="secondary-lastname-input"
            type="text"
            placeholder={t('common:lastName')}
            register={register('details.secondaryContactDetails.lastName')}
          />
        </ErrorValidationMessage>
      </div>
      <ErrorValidationMessage
        touched={errors?.secondaryContactDetails?.jobTitle}
        message={errors?.secondaryContactDetails?.jobTitle?.message}>
        <TextInput
          data-testid="secondary-jobtitle-input"
          type="text"
          placeholder={t('common:jobTitle')}
          register={register('details.secondaryContactDetails.jobTitle')}
        />
      </ErrorValidationMessage>
      <div className="grid grid-cols-2 gap-5">
        <ErrorValidationMessage
          touched={errors?.secondaryContactDetails?.email}
          message={errors?.secondaryContactDetails?.email?.message}>
          <TextInput
            data-testid="secondary-email-input"
            type="email"
            placeholder={t('common:email')}
            register={register('details.secondaryContactDetails.email')}
          />
        </ErrorValidationMessage>

        <Controller
          render={({ field: { onChange, name, value } }) => (
            <ErrorValidationMessage
              touched={errors?.secondaryContactDetails?.phoneNumber}
              message={errors?.secondaryContactDetails?.phoneNumber?.message}>
              <PatternFormat
                onValueChange={v => onChange(v.value)}
                name={name}
                value={value}
                format="+1 (###) ###-####"
                allowEmptyFormatting
                mask="_"
                error={errors?.secondaryContactDetails?.phoneNumber}
                customInput={TextInput}
                data-testid="secondary-phone-input"
              />
            </ErrorValidationMessage>
          )}
          defaultValue=""
          name={'details.secondaryContactDetails.phoneNumber'}
          control={control}
        />
      </div>
    </form>
  );
};

export default Step1;
