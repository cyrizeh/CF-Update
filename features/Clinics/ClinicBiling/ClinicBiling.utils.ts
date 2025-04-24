import { PricingPlanFormFields } from "@/features/PricingPlans/PricingPlanDetailsPage/PricingPlanDetailsPage.types";

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
