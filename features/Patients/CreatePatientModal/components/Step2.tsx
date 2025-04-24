import classNames from 'classnames';
import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';

import ContactInfo from './ContactInfo';
import GeneralInfo from './GeneralInfo';
import Switch from '@/components/Forms/Switch/Switch';

import { ViewTypes } from '@/types';

type Props = {
  // eslint-disable-next-line no-unused-vars
  setSkipPartner: (value: boolean) => void;
  currentStep: number;
  partnerInfo?: any;
  skipPartner: boolean;
};

const Step2 = ({ currentStep, setSkipPartner, partnerInfo, skipPartner }: Props) => {
  const { t } = useTranslation('patients');
  const { watch, register } = useFormContext<ViewTypes.PatientFormValues>();

  const onChangeTab = (tab: number) => {
    setSkipPartner(!!tab);
  };

  return currentStep === 2 ? (
    <div>
      <div className="mb-5 flex h-[53px] w-full overflow-hidden rounded-lg bg-[#292B2C] text-sm font-medium leading-[21px] text-gray-400 shadow">
        <label
          htmlFor="field-rain"
          className={classNames('check-hidden flex w-2/4 cursor-pointer items-center justify-center', {
            'bg-gradient-to-r from-blue-600 to-teal-400 text-white': skipPartner === false,
          })}>
          <input
            {...register('skipPartner')}
            type="radio"
            value="connect"
            id="field-rain"
            onClick={() => onChangeTab(0)}
          />
          {t('step2.connectPartner', { ns: 'patients' })}
        </label>

        <label
          htmlFor="field-wind"
          className={classNames('check-hidden flex w-2/4 cursor-pointer items-center justify-center', {
            'bg-gradient-to-r from-blue-600 to-teal-400 text-white': skipPartner === true,
          })}>
          <input
            {...register('skipPartner')}
            type="radio"
            value="skip"
            id="field-wind"
            onClick={() => onChangeTab(1)}
          />
          {t('step2.skipPartner', { ns: 'patients' })}
        </label>
      </div>

      <div className={classNames('block', { hidden: skipPartner === true })}>
        <GeneralInfo partner partnerInfo={partnerInfo} />

        <ContactInfo partner disabled={watch('usePatientAddress')} partnerInfo={partnerInfo} />

        <div className="pt-5">
          <Switch label="Same as patient contacts" register={register('usePatientAddress')} />
        </div>
      </div>

      <div className={classNames('hidden', { hidden: skipPartner === false })}></div>
    </div>
  ) : null;
};

export default Step2;
