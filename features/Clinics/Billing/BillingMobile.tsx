/* eslint-disable complexity */
// @ts-nocheck
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { StorageDurationNames } from '@/constants/billing';
import { Accordion } from 'flowbite-react';
import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BsCurrencyDollar } from 'react-icons/bs';
import { NumericFormat } from 'react-number-format';

type Props = {
  yearIndex: number;
};

const BillingMobile = ({ yearIndex }: Props) => {
  const {
    control,
    watch,
    register,
    formState: { errors },
  } = useFormContext();

  const billingConfig = [
    {
      title: StorageDurationNames?.['OneMonth'],
      isEnabled: `form.${yearIndex}.values.storagePrices.OneMonth.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.OneMonth.embryoPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.OneMonth?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.OneMonth.oocytePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.OneMonth?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.OneMonth.spermPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.OneMonth?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.${yearIndex}.values.storagePrices.OneMonth.patientPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.OneMonth?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.${yearIndex}.values.storagePrices.OneMonth.canePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.OneMonth?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['Quarter'],
      isEnabled: `form.${yearIndex}.values.storagePrices.Quarter.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.Quarter.embryoPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.Quarter?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.Quarter.oocytePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.Quarter?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.Quarter.spermPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.Quarter?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.${yearIndex}.values.storagePrices.Quarter.patientPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.Quarter?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.${yearIndex}.values.storagePrices.Quarter.canePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.Quarter?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['SixMonth'],
      isEnabled: `form.${yearIndex}.values.storagePrices.SixMonth.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.SixMonth.embryoPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.SixMonth?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.SixMonth.oocytePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.SixMonth?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.SixMonth.spermPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.SixMonth?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.${yearIndex}.values.storagePrices.SixMonth.patientPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.SixMonth?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.${yearIndex}.values.storagePrices.SixMonth.canePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.SixMonth?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['OneYear'],
      isEnabled: `form.${yearIndex}.values.storagePrices.OneYear.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.OneYear.embryoPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.OneYear?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.OneYear.oocytePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.OneYear?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.OneYear.spermPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.OneYear?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.${yearIndex}.values.storagePrices.OneYear.patientPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.OneYear?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.${yearIndex}.values.storagePrices.OneYear.canePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.OneYear?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['TwoYears'],
      isEnabled: `form.${yearIndex}.values.storagePrices.TwoYears.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.TwoYears.embryoPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.TwoYears?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.TwoYears.oocytePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.TwoYears?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.TwoYears.spermPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.TwoYears?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.${yearIndex}.values.storagePrices.TwoYears.patientPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.TwoYears?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.${yearIndex}.values.storagePrices.TwoYears.canePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.TwoYears?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['ThreeYears'],
      isEnabled: `form.${yearIndex}.values.storagePrices.ThreeYears.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.ThreeYears.embryoPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.ThreeYears?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.ThreeYears.oocytePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.ThreeYears?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.ThreeYears.spermPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.ThreeYears?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.${yearIndex}.values.storagePrices.ThreeYears.patientPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.ThreeYears?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.${yearIndex}.values.storagePrices.ThreeYears.canePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.ThreeYears?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['FiveYears'],
      isEnabled: `form.${yearIndex}.values.storagePrices.FiveYears.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.FiveYears.embryoPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.FiveYears?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.FiveYears.oocytePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.FiveYears?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.FiveYears.spermPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.FiveYears?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.${yearIndex}.values.storagePrices.FiveYears.patientPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.FiveYears?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.${yearIndex}.values.storagePrices.FiveYears.canePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.FiveYears?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['TenYears'],
      isEnabled: `form.${yearIndex}.values.storagePrices.TenYears.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.TenYears.embryoPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.TenYears?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.TenYears.oocytePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.TenYears?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.${yearIndex}.values.storagePrices.TenYears.spermPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.TenYears?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.${yearIndex}.values.storagePrices.TenYears.patientPrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.TenYears?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.${yearIndex}.values.storagePrices.TenYears.canePrice`,
          error:
            errors.form && errors?.form[yearIndex]?.values?.storagePrices
              ? errors?.form[yearIndex]?.values?.storagePrices?.TenYears?.canePrice
              : false,
        },
      ],
    },
  ];

  const Checked = useCallback(
    billing => {
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
        <div className="text-sm font-normal leading-[14px] text-white">Select charge type: </div>
        <CustomSelect
          error={
            errors.form && errors?.form[yearIndex]?.chargeType ? errors?.form[yearIndex]?.values?.chargeType : false
          }
          name={`form.${yearIndex}.values.chargeType`}
          control={control}
          options={[
            { label: 'Patient', value: 'Patient' },
            { label: 'Specimen types', value: 'SpecimenTypes' },
            { label: 'Number of canes', value: 'NumberOfCanes' },
          ]}
        />
      </div>

      {billingConfig.map((el, index) => (
        <Accordion key={index} className="flex border-0 bg-[#1E2021] md:hidden">
          <Accordion.Panel className="!hover:bg-[#1E2021] bg-[#1E2021] ">
            <Accordion.Title className="!hover:bg-[#1E2021] rounded-lg border-0 bg-[#1E2021] px-4 py-8 text-sm font-normal leading-[21px] text-white  ring-0 focus:ring-0 dark:hover:bg-[#1E2021]">
              {Checked(el)}
            </Accordion.Title>

            <Accordion.Content className="border-0 bg-[#1E2021]">
              <div className="flex flex-col gap-3 pb-4">
                {el.items.map((item, index) =>
                  watch(`form.${yearIndex}.values.chargeType`) == item.type ? (
                    <div key={index} className="inline-flex h-[50px] w-full items-center justify-between p-4">
                      <div className="text-sm font-normal uppercase leading-[21px] text-zinc-500">{item.title}</div>
                      <div className="flex max-w-[140px] items-center justify-between text-sm font-normal uppercase leading-[21px] text-white">
                        {
                          <Controller
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
                              />
                            )}
                            defaultValue=""
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

export default BillingMobile;
