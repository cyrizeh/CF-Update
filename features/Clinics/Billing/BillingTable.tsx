/* eslint-disable complexity */
// @ts-nocheck
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import classNames from 'classnames';
import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BsCurrencyDollar } from 'react-icons/bs';
import { NumericFormat } from 'react-number-format';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

const BillingTable = ({ index }: { index: number }) => {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const billingConfig = [
    {
      title: StorageDurationNames?.['OneMonth'],
      isEnabled: `form.${index}.values.storagePrices.OneMonth.isEnabled`,
      items: [
        {
          type: 'SpecimenTypes',
          register: `form.${index}.values.storagePrices.OneMonth.embryoPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.OneMonth?.embryoPrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          register: `form.${index}.values.storagePrices.OneMonth.oocytePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.OneMonth?.oocytePrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          register: `form.${index}.values.storagePrices.OneMonth.spermPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.OneMonth?.spermPrice
              : false,
        },
        {
          type: 'Patient',
          register: `form.${index}.values.storagePrices.OneMonth.patientPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.OneMonth?.patientPrice
              : false,
        },
        {
          type: 'NumberOfCanes',
          register: `form.${index}.values.storagePrices.OneMonth.canePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.OneMonth?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['Quarter'],
      isEnabled: `form.${index}.values.storagePrices.Quarter.isEnabled`,
      items: [
        {
          type: 'SpecimenTypes',
          register: `form.${index}.values.storagePrices.Quarter.embryoPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.Quarter?.embryoPrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          register: `form.${index}.values.storagePrices.Quarter.oocytePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.Quarter?.oocytePrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          register: `form.${index}.values.storagePrices.Quarter.spermPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.Quarter?.spermPrice
              : false,
        },
        {
          type: 'Patient',
          register: `form.${index}.values.storagePrices.Quarter.patientPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.Quarter?.patientPrice
              : false,
        },
        {
          type: 'NumberOfCanes',
          register: `form.${index}.values.storagePrices.Quarter.canePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.Quarter?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['SixMonth'],
      isEnabled: `form.${index}.values.storagePrices.SixMonth.isEnabled`,
      items: [
        {
          type: 'SpecimenTypes',
          register: `form.${index}.values.storagePrices.SixMonth.embryoPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.Quarter?.embryoPrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          register: `form.${index}.values.storagePrices.SixMonth.oocytePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.SixMonth?.oocytePrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          register: `form.${index}.values.storagePrices.SixMonth.spermPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.SixMonth?.spermPrice
              : false,
        },
        {
          type: 'Patient',
          register: `form.${index}.values.storagePrices.SixMonth.patientPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.SixMonth?.patientPrice
              : false,
        },
        {
          type: 'NumberOfCanes',
          register: `form.${index}.values.storagePrices.SixMonth.canePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.SixMonth?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['OneYear'],
      isEnabled: `form.${index}.values.storagePrices.OneYear.isEnabled`,
      items: [
        {
          type: 'SpecimenTypes',
          title: 'Embryo',
          register: `form.${index}.values.storagePrices.OneYear.embryoPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.OneYear?.embryoPrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          title: 'Oocyte',
          register: `form.${index}.values.storagePrices.OneYear.oocytePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.OneYear?.oocytePrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          title: 'Sperm',
          register: `form.${index}.values.storagePrices.OneYear.spermPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.OneYear?.spermPrice
              : false,
        },
        {
          type: 'Patient',
          register: `form.${index}.values.storagePrices.OneYear.patientPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.OneYear?.patientPrice
              : false,
        },
        {
          type: 'NumberOfCanes',
          register: `form.${index}.values.storagePrices.OneYear.canePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.OneYear?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['TwoYears'],
      isEnabled: `form.${index}.values.storagePrices.TwoYears.isEnabled`,
      items: [
        {
          type: 'SpecimenTypes',
          title: 'Embryo',
          register: `form.${index}.values.storagePrices.TwoYears.embryoPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.TwoYears?.embryoPrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          title: 'Oocyte',
          register: `form.${index}.values.storagePrices.TwoYears.oocytePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.TwoYears?.oocytePrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          title: 'Sperm',
          register: `form.${index}.values.storagePrices.TwoYears.spermPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.TwoYears?.spermPrice
              : false,
        },
        {
          type: 'Patient',
          register: `form.${index}.values.storagePrices.TwoYears.patientPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.TwoYears?.patientPrice
              : false,
        },
        {
          type: 'NumberOfCanes',
          register: `form.${index}.values.storagePrices.TwoYears.canePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.TwoYears?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['ThreeYears'],
      isEnabled: `form.${index}.values.storagePrices.ThreeYears.isEnabled`,
      items: [
        {
          type: 'SpecimenTypes',
          title: 'Embryo',
          register: `form.${index}.values.storagePrices.ThreeYears.embryoPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.ThreeYears?.embryoPrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          title: 'Oocyte',
          register: `form.${index}.values.storagePrices.ThreeYears.oocytePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.ThreeYears?.oocytePrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          title: 'Sperm',
          register: `form.${index}.values.storagePrices.ThreeYears.spermPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.ThreeYears?.spermPrice
              : false,
        },
        {
          type: 'Patient',
          register: `form.${index}.values.storagePrices.ThreeYears.patientPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.ThreeYears?.patientPrice
              : false,
        },
        {
          type: 'NumberOfCanes',
          register: `form.${index}.values.storagePrices.ThreeYears.canePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.ThreeYears?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['FiveYears'],
      isEnabled: `form.${index}.values.storagePrices.FiveYears.isEnabled`,
      items: [
        {
          type: 'SpecimenTypes',
          title: 'Embryo',
          register: `form.${index}.values.storagePrices.FiveYears.embryoPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.FiveYears?.embryoPrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          title: 'Oocyte',
          register: `form.${index}.values.storagePrices.FiveYears.oocytePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.FiveYears?.oocytePrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          title: 'Sperm',
          register: `form.${index}.values.storagePrices.FiveYears.spermPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.FiveYears?.spermPrice
              : false,
        },
        {
          type: 'Patient',
          register: `form.${index}.values.storagePrices.FiveYears.patientPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.FiveYears?.patientPrice
              : false,
        },
        {
          type: 'NumberOfCanes',
          register: `form.${index}.values.storagePrices.FiveYears.canePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.FiveYears?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['TenYears'],
      isEnabled: `form.${index}.values.storagePrices.TenYears.isEnabled`,
      items: [
        {
          type: 'SpecimenTypes',
          title: 'Embryo',
          register: `form.${index}.values.storagePrices.TenYears.embryoPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.TenYears?.embryoPrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          title: 'Oocyte',
          register: `form.${index}.values.storagePrices.TenYears.oocytePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.TenYears?.oocytePrice
              : false,
        },
        {
          type: 'SpecimenTypes',
          title: 'Sperm',
          register: `form.${index}.values.storagePrices.TenYears.spermPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.TenYears?.spermPrice
              : false,
        },
        {
          type: 'Patient',
          register: `form.${index}.values.storagePrices.TenYears.patientPrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.TenYears?.patientPrice
              : false,
        },
        {
          type: 'NumberOfCanes',
          register: `form.${index}.values.storagePrices.TenYears.canePrice`,
          error:
            errors.form && errors?.form[index]?.values?.storagePrices
              ? errors?.form[index]?.values?.storagePrices?.TenYears?.canePrice
              : false,
        },
      ],
    },
  ];

  const Checked = useCallback(
    billing => {
      return (
        <Checkbox
          register={register(billing.isEnabled)}
          label={<div className="text-sm font-normal leading-[14px] text-white">{billing.title}</div>}
        />
      );
    },
    [register]
  );

  const YearsTabs = billingConfig.map(billing => {
    const isSpecimenType = watch(`form.${index}.values.chargeType`) === 'SpecimenTypes';

    const gridClassNames = classNames('grid items-center gap-4', {
      'grid-cols-[minmax(155px,_1fr)_minmax(100px,_210px)_minmax(100px,_210px)_minmax(100px,_210px)]': isSpecimenType,
      'grid-cols-[minmax(155px,_1fr)_minmax(100px,_210px)]': !isSpecimenType,
    });

    return (
      <div key={billing.title} className="border-b border-neutral-700">
        <div className={`${gridClassNames} pt-4`}>
          <div className="inline-flex items-center justify-start">{Checked(billing)}</div>
          {billing.items.map((item, itemIndex) =>
            watch(`form.${index}.values.chargeType`) === item.type ? (
              <div key={itemIndex}>
                <Controller
                  defaultValue=""
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
            watch(`form.${index}.values.chargeType`) === item.type ? (
              <div key={itemIndex}>
                <ErrorValidationMessage touched={item.error} message={item.error?.message} />
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  });

  return (
    <section className="mb-3 rounded-lg bg-[#1E2021] p-8 shadow">
      <div className="mb-2 flex items-center justify-between  p-2 px-4">
        <div className="inline-flex items-center justify-start ">
          <div className="text-sm font-normal leading-[14px] text-white">Select charge type: </div>
        </div>

        <div className="w-[200px]">
          <CustomSelect
            error={errors.form && errors?.form[index]?.chargeType ? errors?.form[index]?.values?.chargeType : false}
            name={`form.${index}.values.chargeType`}
            control={control}
            options={[
              { label: 'Patient', value: 'Patient' },
              { label: 'Specimen types', value: 'SpecimenTypes' },
              { label: 'Number of canes', value: 'NumberOfCanes' },
            ]}
          />
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between  p-2 px-4">
        <div className="inline-flex items-center justify-start ">
          <div className="text-sm font-normal leading-[14px] text-white">Select subscription type: </div>
        </div>

        <div className="w-[200px]">
          <CustomSelect
            error={
              errors.form && errors?.form[index]?.subscriptionType
                ? errors?.form[index]?.values?.subscriptionType
                : false
            }
            name={`form.${index}.values.subscriptionType`}
            control={control}
            options={[
              { label: 'Consolidated', value: 'Consolidated' },
              { label: 'Per Cycle', value: 'PerCycle' },
            ]}
          />
        </div>
      </div>

      {watch(`form.${index}.values.chargeType`) === 'Patient' ? (
        <div className="grid grid-cols-[minmax(155px,_1fr)_minmax(100px,_210px)] gap-4 bg-[#292B2C]">
          <div className="inline-flex w-full items-center  justify-start bg-[#292B2C] pl-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">SPECIMEN PRICING</div>
          </div>
          <div className="inline-flex  items-center justify-start bg-[#292B2C] py-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">Patient price</div>
          </div>
        </div>
      ) : null}

      {watch(`form.${index}.values.chargeType`) === 'NumberOfCanes' ? (
        <div className="grid grid-cols-[minmax(155px,_1fr)_minmax(100px,_210px)] gap-4 bg-[#292B2C]">
          <div className="inline-flex w-full items-center  justify-start bg-[#292B2C] pl-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">SPECIMEN PRICING</div>
          </div>
          <div className="inline-flex  items-center justify-start bg-[#292B2C] py-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">Canes price</div>
          </div>
        </div>
      ) : null}

      {watch(`form.${index}.values.chargeType`) === 'SpecimenTypes' ? (
        <div className="grid grid-cols-[minmax(155px,_1fr)_minmax(100px,_210px)_minmax(100px,_210px)_minmax(100px,_210px)] gap-4 bg-[#292B2C]">
          <div className="inline-flex w-full items-center  justify-start bg-[#292B2C] pl-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">SPECIMEN PRICING</div>
          </div>
          <div className="inline-flex items-center justify-start bg-[#292B2C] py-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">Embryo</div>
          </div>
          <div className="inline-flex items-center justify-start bg-[#292B2C] py-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">Oocyte</div>
          </div>
          <div className="inline-flex  items-center justify-start bg-[#292B2C] py-4">
            <div className="text-sm font-normal uppercase leading-[21px] text-white">Sperm</div>
          </div>
        </div>
      ) : null}

      {YearsTabs}
    </section>
  );
};

export default BillingTable;
