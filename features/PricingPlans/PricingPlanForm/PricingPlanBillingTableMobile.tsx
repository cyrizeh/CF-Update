import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';

import { Accordion } from 'flowbite-react';
import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BsCurrencyDollar } from 'react-icons/bs';
import { NumericFormat } from 'react-number-format';
import { PricingPlanFormFields } from '../PricingPlanDetailsPage/PricingPlanDetailsPage.types';
import useTranslation from 'next-translate/useTranslation';
import { useGetBillingConfig } from './PricingPlanForm.utils';

const PricingPlanBillingTableMobile: React.FC<{ isReadOnly?: boolean }> = ({ isReadOnly = false }) => {
  const {
    control,
    watch,
    register,
    formState: { errors },
  } = useFormContext<PricingPlanFormFields>();

  const { t } = useTranslation('pricingPlans');

  const billingConfig = useGetBillingConfig(errors);

  const Checked = useCallback(
    (billing: any) => {
      return (
        <div className="max-w-[180px]">
          <Checkbox
            register={register(billing.isEnabled)}
            label={<div className="text-sm font-normal leading-[14px] text-white">{billing.title}</div>}
          />
        </div>
      );
    },
    [register]
  );

  return (
    <section className="mb-3 flex flex-col gap-3 md:hidden">
      <div className="!hover:bg-[#1E2021] flex flex-col gap-4 rounded-lg border-0 bg-[#1E2021] px-4 py-8 text-sm font-normal  leading-[21px] text-white ring-0 focus:ring-0 dark:hover:bg-[#1E2021]">
        <div className="text-sm font-normal leading-[14px] text-white">{t('select_charge_type')} </div>
        {!isReadOnly ? (
          <CustomSelect
            // @ts-ignore
            error={errors.form && errors?.form?.chargeType ? errors?.form?.values?.chargeType : false}
            name={`form.values.chargeType`}
            control={control}
            options={[
              { label: 'Patient', value: 'Patient' },
              { label: 'Specimen types', value: 'SpecimenTypes' },
              { label: 'Number of canes', value: 'NumberOfCanes' },
            ]}
          />
        ) : (
          <div className="flex items-center gap-2 text-base font-normal text-white">
            {watch('form.values.chargeType')}
          </div>
        )}
      </div>

      <div className="!hover:bg-[#1E2021] flex flex-col gap-4 rounded-lg border-0 bg-[#1E2021] px-4 py-8 text-sm font-normal  leading-[21px] text-white ring-0 focus:ring-0 dark:hover:bg-[#1E2021]">
        <div className="text-sm font-normal leading-[14px] text-white">{t('select_charge_type')} </div>
        {!isReadOnly ? (
          <CustomSelect
            // @ts-ignore
            error={errors.form && errors?.form?.subscriptionType ? errors?.form?.values?.subscriptionType : false}
            name={`form.values.subscriptionType`}
            control={control}
            options={[
              { label: 'Consolidated', value: 'Consolidated' },
              { label: 'Per Cycle', value: 'PerCycle' },
            ]}
          />
        ) : (
          <div className="flex items-center gap-2 text-base font-normal text-white">
            {watch('form.values.subscriptionType')}
          </div>
        )}
      </div>

      {billingConfig.map((el, index) => (
        <Accordion key={index} className="flex border-0 bg-[#1E2021] md:hidden">
          <Accordion.Panel className="!hover:bg-[#1E2021] bg-[#1E2021] ">
            <Accordion.Title className="!hover:bg-[#1E2021] rounded-lg border-0 bg-[#1E2021] px-4 py-8 text-sm font-normal leading-[21px] text-white  ring-0 focus:ring-0 dark:hover:bg-[#1E2021]">
              {!isReadOnly ? (
                Checked(el)
              ) : (
                <p className="flex items-center gap-2 text-base font-normal text-white">{el?.title}</p>
              )}
            </Accordion.Title>

            <Accordion.Content className="border-0 bg-[#1E2021]">
              <div className="flex flex-col gap-3 pb-4">
                {el.items.map((item, index) =>
                  watch(`form.values.chargeType`) == item.type ? (
                    <div key={index} className="inline-flex h-[50px] w-full items-center justify-between p-4">
                      <div className="text-sm font-normal uppercase leading-[21px] text-zinc-500">{item.title}</div>
                      <div className="flex max-w-[140px] items-center justify-between text-sm font-normal uppercase leading-[21px] text-white">
                        {
                          <Controller
                            render={({ field: { onChange, name, value } }) =>
                              !isReadOnly ? (
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
                                />
                              ) : (
                                <div className="flex items-center gap-2 text-base font-normal text-white">
                                  $ {value}
                                </div>
                              )
                            }
                            defaultValue=""
                            // @ts-ignore
                            name={item.register}
                            control={control}
                          />
                        }
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      ))}
    </section>
  );
};

export default PricingPlanBillingTableMobile;
