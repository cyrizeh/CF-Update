import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import classNames from 'classnames';
import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BsCurrencyDollar } from 'react-icons/bs';
import { NumericFormat } from 'react-number-format';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import { PricingPlanFormFields } from '../PricingPlanDetailsPage/PricingPlanDetailsPage.types';
import { useGetBillingConfig } from './PricingPlanForm.utils';
import useTranslation from 'next-translate/useTranslation';
import { chargeTypeList, subscriptionTypeList } from '../PricingPlansPage.const';

const PricingPlanBillingTable: React.FC<{ isReadOnly?: boolean }> = ({ isReadOnly = false }) => {
  const { t } = useTranslation('pricingPlans');
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext<PricingPlanFormFields>();

  const billingConfig = useGetBillingConfig(errors);

  const Checked = useCallback(
    (billing: any) => {
      return (
        <Checkbox
          register={register(billing.isEnabled)}
          label={<div className="text-sm font-normal leading-[14px] text-white">{billing.title}</div>}
        />
      );
    },
    [register]
  );

  function getLabelByValue(value: string, data: any[]) {
    const item = data.find(element => element.value === value);
    return item ? item.label : null;
  }

  const YearsTabs = billingConfig.map(billing => {
    const isSpecimenType = watch(`form.values.chargeType`) === 'SpecimenTypes';

    const gridClassNames = classNames('grid items-center gap-4', {
      'grid-cols-[minmax(155px,_1fr)_minmax(100px,_210px)_minmax(100px,_210px)_minmax(100px,_210px)]': isSpecimenType,
      'grid-cols-[minmax(155px,_1fr)_minmax(100px,_210px)]': !isSpecimenType,
    });

    return (
      <div key={billing.title} className="border-b border-neutral-700">
        <div className={`${gridClassNames} pl-4 pt-4`}>
          <div
            className={`inline-flex items-center justify-start ${isReadOnly ? 'pointer-events-none opacity-50' : ''}`}>
            {Checked(billing)}
          </div>

          {billing.items.map((item, itemIndex) =>
            watch(`form.values.chargeType`) === item.type ? (
              <div key={itemIndex}>
                <Controller
                  defaultValue=""
                  // @ts-ignore
                  name={item.register}
                  control={control}
                  render={({ field: { onChange, name, value } }) => (
                    <NumericFormat
                      allowNegative={false}
                      name={name}
                      value={value}
                      onValueChange={v => onChange(v.value)}
                      customInput={TextInput}
                      inputstyles="text-right text-sm font-normal uppercase leading-[21px] text-white"
                      error={item.error}
                      adornments={{
                        position: 'start',
                        content: BsCurrencyDollar,
                      }}
                      disabled={isReadOnly}
                    />
                  )}
                />
              </div>
            ) : null
          )}
        </div>
        <div className={`${gridClassNames} pb-4 pt-2`}>
          <div className="inline-flex items-center justify-start"></div>
          {billing.items.map((item, itemIndex) =>
            watch(`form.values.chargeType`) === item.type ? (
              <div key={itemIndex}>
                <ErrorValidationMessage
                  touched={item.error}
                  // @ts-ignore
                  message={item.error?.message}
                />
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  });

  return (
    <section className="mb-3 rounded-lg bg-[#1E2021] p-8 shadow">
      {/*        Charge & Subscription types        */}
      <div className="mb-2 flex items-center gap-2 p-2 px-4">
        <div className="inline-flex items-center justify-start ">
          <div className="text-base font-normal leading-[14px] text-white">
            {!isReadOnly ? t('select_charge_type') : t('charge_type')}
          </div>
        </div>

        <div className="w-[200px]">
          {!isReadOnly ? (
            <CustomSelect
              // @ts-ignore
              error={errors.form && errors?.form?.chargeType ? errors?.form?.values?.chargeType : false}
              name={`form.values.chargeType`}
              control={control}
              options={chargeTypeList}
            />
          ) : (
            <div className="flex items-center gap-2 text-base font-normal text-white">
              {getLabelByValue(watch('form.values.chargeType'), chargeTypeList)}
            </div>
          )}
        </div>
      </div>

      <div className="mb-2 flex items-center gap-2 p-2 px-4">
        <div className="inline-flex items-center justify-start ">
          <div className="text-base font-normal leading-[14px] text-white">
            {!isReadOnly ? t('select_subscription_type') : t('subscription_type')}{' '}
          </div>
        </div>

        <div className="w-[200px]">
          {!isReadOnly ? (
            <CustomSelect
              // @ts-ignore
              error={errors.form && errors?.form?.subscriptionType ? errors?.form?.values?.subscriptionType : false}
              name={`form.values.subscriptionType`}
              control={control}
              options={subscriptionTypeList}
            />
          ) : (
            <div className="flex items-center gap-2 text-base font-normal text-white">
              {getLabelByValue(watch('form.values.subscriptionType'), subscriptionTypeList)}
            </div>
          )}
        </div>
      </div>

      {watch(`form.values.chargeType`) === 'Patient' ? (
        <div className="grid grid-cols-[minmax(155px,_1fr)_minmax(100px,_210px)] gap-4 bg-[#292B2C]">
          <div className="inline-flex w-full items-center  justify-start bg-[#292B2C] pl-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">{t('table.specimen_pricing')}</div>
          </div>
          <div className="inline-flex  items-center justify-start bg-[#292B2C] py-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">{t('table.patient_pricing')}</div>
          </div>
        </div>
      ) : null}

      {watch(`form.values.chargeType`) === 'NumberOfCanes' ? (
        <div className="grid grid-cols-[minmax(155px,_1fr)_minmax(100px,_210px)] gap-4 bg-[#292B2C]">
          <div className="inline-flex w-full items-center  justify-start bg-[#292B2C] pl-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">{t('table.specimen_pricing')}</div>
          </div>
          <div className="inline-flex  items-center justify-start bg-[#292B2C] py-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">{t('table.cane_pricing')}</div>
          </div>
        </div>
      ) : null}

      {watch(`form.values.chargeType`) === 'SpecimenTypes' ? (
        <div className="grid grid-cols-[minmax(155px,_1fr)_minmax(100px,_210px)_minmax(100px,_210px)_minmax(100px,_210px)] gap-4 bg-[#292B2C]">
          <div className="inline-flex w-full items-center  justify-start bg-[#292B2C] pl-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">{t('table.specimen_pricing')}</div>
          </div>
          <div className="inline-flex items-center justify-start bg-[#292B2C] py-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">{t('table.embryo')}</div>
          </div>
          <div className="inline-flex items-center justify-start bg-[#292B2C] py-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">{t('table.oocyte')}</div>
          </div>
          <div className="inline-flex  items-center justify-start bg-[#292B2C] py-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">{t('table.sperm')}</div>
          </div>
        </div>
      ) : null}

      {YearsTabs}
    </section>
  );
};

export default PricingPlanBillingTable;
