export type PricingPlanRequest = {
  pricingPlanId?: string;
  name: string;
  billingCriteria: string;
  subscriptionType: string;
  servicePrices: ServicePrice[];
  storagePrices: StoragePrice[];
  // Todo remove any
  discounts: any[];
};

interface ServicePrice {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  type: string;
  billingSchedule: string;
  priceType: string;
  price: number;
  isEnabled: boolean;
  isCustom: boolean;
}

interface StoragePrice {
  id?: string;
  storageDuration: string;
  canePrice: number;
  patientPrice: number;
  embryoPrice: number;
  spermPrice: number;
  oocytePrice: number;
  isEnabled: boolean;
}

interface Discount {
  id?: string;
  discountId?: string;
  name: string;
  type: string;
  amount: number;
}
