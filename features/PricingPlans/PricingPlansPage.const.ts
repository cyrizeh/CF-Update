import { PricingPlanFormFields } from './PricingPlanDetailsPage/PricingPlanDetailsPage.types';

export const INITIAL_VALUES: PricingPlanFormFields = {
  form: {
    values: {
      name: '',
      discounts: [{ type: 'FixedDiscount', amount: '', name: 'Discount' }],
      chargeType: 'SpecimenTypes',
      storagePrices: {
        OneMonth: { isEnabled: false, embryoPrice: '', spermPrice: '', oocytePrice: '' },
        Quarter: { isEnabled: false, embryoPrice: '', spermPrice: '', oocytePrice: '' },
        SixMonth: { isEnabled: false, embryoPrice: '', spermPrice: '', oocytePrice: '' },
        OneYear: { isEnabled: false, embryoPrice: '', spermPrice: '', oocytePrice: '' },
        TwoYears: { isEnabled: false, embryoPrice: '', spermPrice: '', oocytePrice: '' },
        ThreeYears: { isEnabled: false, embryoPrice: '', spermPrice: '', oocytePrice: '' },
        FiveYears: { isEnabled: false, embryoPrice: '', spermPrice: '', oocytePrice: '' },
        TenYears: { isEnabled: false, embryoPrice: '', spermPrice: '', oocytePrice: '' },
      },
      servicePrices: [],
      subscriptionType: 'Consolidated',
    },
  },
};

export const subscriptionTypeList = [
  { label: 'Consolidated', value: 'Consolidated' },
  { label: 'Per Cycle', value: 'PerCycle' },
];

export const chargeTypeList = [
  { label: 'Patient', value: 'Patient' },
  { label: 'Specimen types', value: 'SpecimenTypes' },
  { label: 'Number of canes', value: 'NumberOfCanes' },
];
