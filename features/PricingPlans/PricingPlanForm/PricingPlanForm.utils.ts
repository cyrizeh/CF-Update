import { FieldErrors } from 'react-hook-form';
import { PricingPlanFormFields } from '../PricingPlanDetailsPage/PricingPlanDetailsPage.types';
import { StorageDurationNames } from '@/constants/billing';

type BillingItem = {
  title: string;
  type: string;
  register: string;
  error: any;
};

type BillingConfigSection = {
  title: string;
  isEnabled: string;
  items: BillingItem[];
};

export const useGetBillingConfig = (errors: FieldErrors<PricingPlanFormFields>): BillingConfigSection[] => {
  const billingConfig = [
    {
      title: StorageDurationNames?.['OneMonth'],
      isEnabled: `form.values.storagePrices.OneMonth.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.OneMonth.embryoPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.OneMonth?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.OneMonth.oocytePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.OneMonth?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.OneMonth.spermPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.OneMonth?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.values.storagePrices.OneMonth.patientPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.OneMonth?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.values.storagePrices.OneMonth.canePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.OneMonth?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['Quarter'],
      isEnabled: `form.values.storagePrices.Quarter.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.Quarter.embryoPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.Quarter?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.Quarter.oocytePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.Quarter?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.Quarter.spermPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.Quarter?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.values.storagePrices.Quarter.patientPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.Quarter?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.values.storagePrices.Quarter.canePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.Quarter?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['SixMonth'],
      isEnabled: `form.values.storagePrices.SixMonth.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.SixMonth.embryoPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.SixMonth?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.SixMonth.oocytePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.SixMonth?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.SixMonth.spermPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.SixMonth?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.values.storagePrices.SixMonth.patientPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.SixMonth?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.values.storagePrices.SixMonth.canePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.SixMonth?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['OneYear'],
      isEnabled: `form.values.storagePrices.OneYear.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.OneYear.embryoPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.OneYear?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.OneYear.oocytePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.OneYear?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.OneYear.spermPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.OneYear?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.values.storagePrices.OneYear.patientPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.OneYear?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.values.storagePrices.OneYear.canePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.OneYear?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['TwoYears'],
      isEnabled: `form.values.storagePrices.TwoYears.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.TwoYears.embryoPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.TwoYears?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.TwoYears.oocytePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.TwoYears?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.TwoYears.spermPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.TwoYears?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.values.storagePrices.TwoYears.patientPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.TwoYears?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.values.storagePrices.TwoYears.canePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.TwoYears?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['ThreeYears'],
      isEnabled: `form.values.storagePrices.ThreeYears.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.ThreeYears.embryoPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.ThreeYears?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.ThreeYears.oocytePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.ThreeYears?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.ThreeYears.spermPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.ThreeYears?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.values.storagePrices.ThreeYears.patientPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.ThreeYears?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.values.storagePrices.ThreeYears.canePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.ThreeYears?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['FiveYears'],
      isEnabled: `form.values.storagePrices.FiveYears.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.FiveYears.embryoPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.FiveYears?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.FiveYears.oocytePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.FiveYears?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.FiveYears.spermPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.FiveYears?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.values.storagePrices.FiveYears.patientPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.FiveYears?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.values.storagePrices.FiveYears.canePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.FiveYears?.canePrice
              : false,
        },
      ],
    },
    {
      title: StorageDurationNames?.['TenYears'],
      isEnabled: `form.values.storagePrices.TenYears.isEnabled`,
      items: [
        {
          title: 'Embryo',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.TenYears.embryoPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.TenYears?.embryoPrice
              : false,
        },
        {
          title: 'Oocyte',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.TenYears.oocytePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.TenYears?.oocytePrice
              : false,
        },
        {
          title: 'Sperm',
          type: 'SpecimenTypes',
          register: `form.values.storagePrices.TenYears.spermPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.TenYears?.spermPrice
              : false,
        },
        {
          title: 'Patient price',
          type: 'Patient',
          register: `form.values.storagePrices.TenYears.patientPrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.TenYears?.patientPrice
              : false,
        },
        {
          title: 'Canes price',
          type: 'NumberOfCanes',
          register: `form.values.storagePrices.TenYears.canePrice`,
          error:
            errors.form && errors?.form?.values?.storagePrices
              ? errors?.form?.values?.storagePrices?.TenYears?.canePrice
              : false,
        },
      ],
    },
  ];

  return billingConfig;
};
