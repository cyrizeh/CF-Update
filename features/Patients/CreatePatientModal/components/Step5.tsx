import { FieldError, useFormContext } from 'react-hook-form';
import Checkbox from '@/components/Forms/Checkbox/Checkbox';

import useTranslation from 'next-translate/useTranslation';

import TextInput from '@/components/Forms/TextInput/TextInput';

import { ViewTypes } from '@/types';
import { PatientSpecimenTypes } from '@/constants/patients';

import CustomSelect from '@/components/Forms/Select/Select';
import { useEffect, useState } from 'react';
import { Label, Radio } from 'flowbite-react';
import { OnboardingType } from '@/types/view/OnBoardingType.type';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';

const Step5 = ({ currentStep, patient }: { currentStep: number; patient: any }) => {
  const { t } = useTranslation('patients');

  const {
    control,
    register,
    formState: {
      errors: { donorInfo: errors },
    },
    watch,
    setValue,
    trigger,
  } = useFormContext<ViewTypes.PatientFormValues>();

  const [clinicData, setClinicData] = useState(watch('billingInfo.clinicId'));
  // we use it because setValue on 4th step not work very quickly and we need to track state changes if it is edit
  useEffect(() => {
    const subscription = watch((value: any, { name }: { name?: string }) => {
      if (name === 'billingInfo.clinicId') {
        setClinicData(value?.billingInfo?.clinicId);
      }
    });
    return () => subscription?.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (patient) {
      setValue('patient.email', patient?.email);
    }
  }, [patient]);

  return currentStep === 5 ? (
    <>
      {errors?.type === 'general' && <div className="text-xs text-rose-400">{errors?.message}</div>}

      <div className="mb-5 flex flex-col">
        <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{t('step5.spesimenType')}</p>
        <div className="mt-0 gap-5">
          <ErrorValidationMessage
            touched={errors?.specimenTypes as FieldError}
            message={errors?.specimenTypes?.message}>
            <CustomSelect
              isMulti
              options={PatientSpecimenTypes}
              placeholder={t('step5.specimenTypes')}
              // @ts-ignore
              error={errors?.specimenTypes}
              control={control}
              name="donorInfo.specimenTypes"
            />
          </ErrorValidationMessage>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-5">
        <div className="mt-0">
          <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{t('step5.canes')}</p>
          <ErrorValidationMessage touched={errors?.numberOfCanes} message={errors?.numberOfCanes?.message}>
            <TextInput
              type="number"
              placeholder={t('step5.canes', { ns: 'patients' }) + ' *'}
              register={register('donorInfo.numberOfCanes')}
              error={errors?.numberOfCanes}
            />
          </ErrorValidationMessage>
        </div>

        {(!!clinicData?.onboardingConfiguration?.isPreTreatmentEnabled ||
          !!watch('billingInfo.clinicId.onboardingConfiguration.isPreTreatmentEnabled')) && (
          <div className="mt-5 flex flex-col gap-5">
            <Checkbox
              register={register('donorInfo.isPreTreatment')}
              label={<div className="text-sm font-normal leading-[21px] text-white">{t('step5.isPreTreatment')}</div>}
            />
          </div>
        )}

        <div>
          <Label>{t('step5.onBoardingType.title')}</Label>
          <Label htmlFor="fullOnboardOnCreate" className="flex items-center gap-2 pl-1">
            <Radio
              id="fullOnboardOnCreate"
              name="fullOnboardOnCreate"
              checked={watch('donorInfo.onBoardingType') === OnboardingType.FullOnboard}
              onClick={() => {
                setValue('donorInfo.onBoardingType', OnboardingType.FullOnboard);
                trigger('donorInfo.onBoardingType');
              }}
            />
            {t('step5.onBoardingType.fullOnboard')}
          </Label>

          <Label htmlFor="paymentsOnboardPlusLoginOnCreate" className="flex items-center gap-2 pl-1">
            <Radio
              id="paymentsOnboardPlusLoginOnCreate"
              name="paymentsOnboardPlusLoginOnCreate"
              checked={watch('donorInfo.onBoardingType') === OnboardingType.PaymentsOnboardPlusLogin}
              onClick={() => {
                setValue('donorInfo.onBoardingType', OnboardingType.PaymentsOnboardPlusLogin);
                trigger('donorInfo.onBoardingType');
              }}
            />
            {t('step5.onBoardingType.paymentsOnboardPlusLogin')}
          </Label>
          <Label htmlFor="justPatientLogin" className="flex items-center gap-2 pl-1">
            <Radio
              id="justPatientLogin"
              name="justPatientLogin"
              checked={watch('donorInfo.onBoardingType') === OnboardingType.JustPatientLogin}
              onClick={() => {
                setValue('donorInfo.onBoardingType', OnboardingType.JustPatientLogin);
                trigger('donorInfo.onBoardingType');
              }}
            />
            {t('step5.onBoardingType.justPatientLogin')}
          </Label>

          <Label htmlFor="noLoginOnboarding" className="flex items-center gap-2 pl-1">
            <Radio
              id="noLoginOnboarding"
              name="noLoginOnboarding"
              checked={watch('donorInfo.onBoardingType') === OnboardingType.NoLoginOnboarding}
              onClick={() => {
                setValue('donorInfo.onBoardingType', OnboardingType.NoLoginOnboarding);
                trigger('donorInfo.onBoardingType');
              }}
            />
            {
              <div>
                <p>{t('step5.onBoardingType.noLoginOnboarding1')}</p>
                <p>{t('step5.onBoardingType.noLoginOnboarding2')}</p>
              </div>
            }
          </Label>

          {errors?.onBoardingType && (
            <ErrorValidationMessage
              touched={errors?.onBoardingType}
              message={errors?.onBoardingType?.message}
              style={{
                label: {
                  fontSize: '14px',
                  marginTop: '5px',
                },
              }}></ErrorValidationMessage>
          )}
        </div>
        {watch('donorInfo.onBoardingType') === OnboardingType.FullOnboard && (
          <ErrorValidationMessage touched={errors?.witness} message={errors?.witness?.message}>
            <Autocomplete2
              defaultValue={watch('donorInfo.witness')}
              url="/Witness"
              control={control}
              error={errors?.witness}
              name="donorInfo.witness"
              placeholder={'Select consent witness *'}
              isPrefilled
            />
          </ErrorValidationMessage>
        )}
      </div>
    </>
  ) : null;
};

export default Step5;
