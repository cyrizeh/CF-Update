type ServicePrice = {
  id: string;
  serviceId: string;
  name: string;
  description: string | null;
  type: string;
  billingSchedule: string;
  priceType: string;
  price: number;
  isEnabled: boolean;
  isCustom: boolean;
};

export type ServiceGuarantee = {
  id: string | null;
  name: string;
  description: string | null;
  price: number;
};

export type ExtraProtectionProgram = {
  id: string | null;
  name: string;
  description: string | null;
  price: number;
  protectionLevels: any[];
};

type StoragePrice = {
  id: string;
  storageDuration: string;
  embryoPrice: number;
  spermPrice: number;
  oocytePrice: number;
  patientPrice: number;
  canePrice: number;
  isEnabled: boolean;
};

type PaymentAmount = {
  grossAmount: number;
  discountAmount: number;
  paymentAmount: number;
  totalAmount: number;
  totalGrossAmount: number;
  pricingLines: { tissueType: string; total: number }[];
  invoiceLines: {
    name: string;
    description: string | null;
    grossAmount: number;
    discountAmount: number;
    netAmount: number;
    paymentType: string;
  }[];
  extraProtection: any | null;
};

type ClinicStoragePrice = {
  id: string;
  storageDuration: string;
  embryoPrice: number;
  spermPrice: number;
  oocytePrice: number;
  patientPrice: number;
  canePrice: number;
  isEnabled: boolean;
};

export interface PaymentInfoResponse {
  id: string;
  billingCriteria: string;
  servicePrices: ServicePrice[];
  transferServiceGuarantees: ServiceGuarantee[];
  extraProtectionPrograms: ExtraProtectionProgram[];
  transferServiceGuaranteeId: string | null;
  extraProtectionProgramId: string | null;
  storagePrice: StoragePrice;
  discount: any | null;
  paymentAmount: PaymentAmount;
  clinicStoragePrices: ClinicStoragePrice[];
  clinicPlanId: string;
  canSkipPayment: boolean;
  paymentDateSource: string;
  payNowEnabled: boolean;
  schedulePaymentEnabled: boolean;
  transferServiceGuaranteeEnabled: boolean;
}
