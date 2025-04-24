import { StorageDurationNames } from '@/constants/billing';
import { Label, Radio } from 'flowbite-react';
import { useFormContext } from 'react-hook-form';

const BillingMobile = ({ values }: { values: any }) => {
  const { register } = useFormContext();

  const items = [
    { title: 'Embryo', value: 'embryoPrice' },
    { title: 'Oocyte', value: 'oocytePrice' },
    { title: 'Sperm', value: 'spermPrice' },
  ];

  const billingConfig = [
    {
      title: StorageDurationNames?.['OneYear'],
      register: register('pricingPlan'),
      value: 'OneYear',
      items: items,
    },
    {
      title: StorageDurationNames?.['FiveYears'],
      register: register('pricingPlan'),
      value: 'FiveYears',
      items: items,
    },
    {
      title: StorageDurationNames?.['TenYears'],
      register: register('pricingPlan'),
      value: 'TenYears',
      items: items,
    },
  ];

  return (
    <section className="mb-3 flex flex-col gap-3">
      {billingConfig.map((billing, index) => (
        <div key={index} className="flex flex-col rounded-lg border-0 bg-[#1E2021] px-4 py-4 shadow">
          <div className="flex  items-center">
            <Radio
              id={billing.value}
              value={billing.value}
              {...billing.register}
              style={{ boxShadow: 'none' }}
              className="cursor-pointer"
            />
            <Label
              htmlFor={billing.value}
              className="flex h-[50px] w-full cursor-pointer items-center  pl-4 text-sm font-normal leading-[14px] text-white">
              {billing.title}
            </Label>
          </div>

          <div className="flex flex-col gap-3 pb-4">
            {billing.items.map((item, index) => (
              <div key={index} className="inline-flex h-[50px] w-full items-center justify-between p-2">
                <div className="text-sm font-normal uppercase leading-[21px] text-zinc-500">{item.title}</div>
                <div className="text-sm font-normal leading-[21px] text-gray-300">
                  ${values.storagePrices.find((el: any) => el.storageDuration === billing.value)[item.value]}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default BillingMobile;
