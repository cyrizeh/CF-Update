import useTranslation from 'next-translate/useTranslation';
import { Controller, useFormContext } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import TextInput from '@/components/Forms/TextInput/TextInput';

import { ViewTypes } from '@/types';

import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import { clinicTypes } from '@/constants/clinics';
import useRole from '@/hooks/useRole';
import { isUserAdmin, isUserGodAdmin } from '@/utils';

const EditClinicDetails = ({ canEditParentClinic }: { canEditParentClinic: boolean }) => {
  const { t } = useTranslation('clinics');
  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const {
    register,
    watch,
    control,
    formState: {
      errors: { details: errors },
    },
  } = useFormContext<ViewTypes.ClinicFormValues>();

  return (
    <form className="flex max-w-md flex-col gap-4">
      <div className="label-with-help">
        <div className="text-sm font-normal">{t('step1.clinicDetails')}</div>
      </div>
      <ErrorValidationMessage touched={errors?.name} message={errors?.name?.message}>
        <TextInput type="text" placeholder={t('step1.name') + ' *'} register={register('details.name')} />
      </ErrorValidationMessage>

      {canEditParentClinic ? (
        <ErrorValidationMessage touched={errors?.accountId} message={errors?.accountId?.message}>
          <Autocomplete2
            error={errors?.accountId}
            control={control}
            defaultValue={watch('details.accountId')}
            name={'details.accountId'}
            placeholder={t('step1.selectClinic')}
            url="/Accounts"
          />
        </ErrorValidationMessage>
      ) : null}

      {isCryoAdmin && (
        <div className="clinic-type flex items-center gap-5">
          <div className="w-full">
            <ErrorValidationMessage touched={errors?.clinicType} message={errors?.clinicType?.message}>
              <CustomSelect
                options={clinicTypes}
                placeholder={t('step1.selectType')}
                error={errors?.clinicType}
                control={control}
                name="details.clinicType"
              />
            </ErrorValidationMessage>
          </div>
        </div>
      )}

      <div className="label-with-help">
        <div className="text-sm font-normal">{t('step1.primaryContactTitle')}</div>
        <p className="text-sm font-light leading-tight text-gray-300">{t('step1.primaryContactSubtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <ErrorValidationMessage
          touched={errors?.contactDetails?.firstName}
          message={errors?.contactDetails?.firstName?.message}>
          <TextInput
            type="text"
            placeholder={t('common:firstName')}
            register={register('details.contactDetails.firstName')}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage
          touched={errors?.contactDetails?.lastName}
          message={errors?.contactDetails?.lastName?.message}>
          <TextInput
            type="text"
            placeholder={t('common:lastName')}
            register={register('details.contactDetails.lastName')}
          />
        </ErrorValidationMessage>
      </div>
      <ErrorValidationMessage
        touched={errors?.contactDetails?.jobTitle}
        message={errors?.contactDetails?.jobTitle?.message}>
        <TextInput
          type="text"
          error={errors?.contactDetails?.jobTitle}
          placeholder={t('common:jobTitle')}
          register={register('details.contactDetails.jobTitle')}
        />
      </ErrorValidationMessage>

      <div className="grid grid-cols-2 gap-5">
        <ErrorValidationMessage
          touched={errors?.contactDetails?.email}
          message={errors?.contactDetails?.email?.message}>
          <TextInput type="email" placeholder={t('common:email')} register={register('details.contactDetails.email')} />
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
              />
            </ErrorValidationMessage>
          )}
          defaultValue=""
          name={'details.contactDetails.phoneNumber'}
          control={control}
        />
      </div>

      <div className="label-with-help mt-2">
        <div className="text-sm font-normal">{t('step1.secondaryContactTitle')}</div>
        <p className="text-sm font-light leading-tight text-gray-300">{t('step1.primaryContactSubtitle')}</p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-5">
        <ErrorValidationMessage
          touched={errors?.secondaryContactDetails?.firstName}
          message={errors?.secondaryContactDetails?.firstName?.message}>
          <TextInput
            type="text"
            placeholder={t('common:firstName')}
            register={register('details.secondaryContactDetails.firstName')}
          />
        </ErrorValidationMessage>
        <ErrorValidationMessage
          touched={errors?.secondaryContactDetails?.lastName}
          message={errors?.secondaryContactDetails?.lastName?.message}>
          <TextInput
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

export default EditClinicDetails;
