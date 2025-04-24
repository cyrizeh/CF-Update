export type PaymentDateSource = 'SpecimenReceivedDate' | 'BillingStartDate';
export type PaymentSquareRequest = {
  paymentMethodToken: string;
  verificationToken: string;
};

export enum PaymentDateSourceEnum {
  SpecimenReceivedDate = 'SpecimenReceivedDate',
  BillingStartDate = 'BillingStartDate'
}