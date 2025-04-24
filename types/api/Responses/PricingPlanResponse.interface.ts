import { ListResponse } from "./ListResponse.type";

export interface PricingPlansResponse {
  id: string;
  version: number;
  name: string;
  isDefault: boolean;
  originalPlanId: string;
  created: string;
}

export interface PricingPlansListResponse extends ListResponse {
    items: Array<PricingPlansResponse>;
  }
  

export interface PricingPlanResponse {
  id: string;
  originalPlanId: string;
  name: string;
  version: number;
  isDefault: boolean;
  subscriptionType: string;
  billingCriteria: string;
  servicePrices: ServicePrice[];
  storagePrices: StoragePrice[];
  discounts: Discount[];
}

export interface ServicePrice {
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

export interface StoragePrice {
  id: string;
  storageDuration: string;
  canePrice: number;
  patientPrice: number;
  embryoPrice: number;
  spermPrice: number;
  oocytePrice: number;
  isEnabled: boolean;
}

export interface Discount {
  id: string;
  discountId: string;
  name: string;
  type: string;
  amount: number;
}
