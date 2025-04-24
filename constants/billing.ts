type TypeNames = {
  [key: string]: string;
};

export const StorageDurationNames: TypeNames = {
  OneMonth: 'Monthly Cryostorage',
  Quarter: 'Quarterly Cryostorage',
  SixMonth: '6-Month Cryostorage',
  OneYear: '1-Year Cryostorage',
  TwoYears: '2-Year Cryostorage',
  ThreeYears: '3-Year Cryostorage',
  FiveYears: '5-Year Cryostorage',
  TenYears: '10-Year Cryostorage',
};

export const storageOrder = [
  'OneMonth',
  'Quarter',
  'SixMonth',
  'OneYear',
  'TwoYears',
  'ThreeYears',
  'FiveYears',
  'TenYears',
];

export const serviceOrder = [
  'Initial Specimen Transportation Fee (Local)',
  'Return Specimen Transportation Fee (Local)',
  'Service Guarantee™ (Level 1)',
  'Service Guarantee™ (Level 2)',
  '3rd Party Courier Admin Fee',
  'Clinic - Clinic Transportation Fee (Local)',
  'Clinic - Clinic Transportation Fee (Long Distance)',
];

export enum PriceBillingType {
  Transfer = 'Transfer',
  Other = 'Other',
  TransportationMetro = 'TransportationMetro',
  TransportationLocal = 'TransportationLocal',
  TransportationRegional = 'TransportationRegional',
  TransportationShort = 'TransportationShort',
  TransportationLong = 'TransportationLong',
  ExpeditedTransportationMetro = 'ExpeditedTransportationMetro',
  ExpeditedTransportationLocal = 'ExpeditedTransportationLocal',
  ExpeditedTransportationRegional = 'ExpeditedTransportationRegional',
  ExpeditedTransportationShort = 'ExpeditedTransportationShort',
  ExpeditedTransportationLong = 'ExpeditedTransportationLong',
  ClinicToClinicLocal = 'ClinicToClinicLocal',
  ClinicToClinicNationwide = 'ClinicToClinicNationwide',
  AdditionalTransferFee = 'AdditionalTransferFee',
  AdditionalStorageFee = 'AdditionalStorageFee',
  TransferServiceGuarantee = 'TransferServiceGuarantee',
  ExtraProtectionProgram = 'ExtraProtectionProgram',
  ServiceGuarantee = 'ServiceGuarantee',
}

export const PriceBillingTypeTitle: Record<string, string> = {
  [PriceBillingType.Transfer]: 'Storage Transfer Fees',
  [PriceBillingType.Other]: 'Other fees',
  [PriceBillingType.AdditionalStorageFee]: 'Other Storage Fee',
  [PriceBillingType.AdditionalTransferFee]: 'Other Transfer Fee',
  [PriceBillingType.ClinicToClinicLocal]: 'Clinic to Clinic (Local / Regional)',
  [PriceBillingType.ClinicToClinicNationwide]: 'Clinic to Clinic (National)',
  [PriceBillingType.TransferServiceGuarantee]: 'Transfer Service Guarantee',
  [PriceBillingType.ExtraProtectionProgram]: 'Extra Protection Program',
  [PriceBillingType.ServiceGuarantee]: 'Service Guarantees',
};

export const billingStatusList = [
  { label: 'Upcoming', value: 'Upcoming' },
  { label: 'Created', value: 'Created' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Succeeded', value: 'Succeeded' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Requires Action', value: 'RequiresAction' },
  { label: 'Failed', value: 'Failed' },
];

export const EPP_LINK = 'https://cryofuture.com/epp/';

export const noticeTypeList = [
  { value: 'UpcomingPayment', label: 'Upcoming Payment' },
  { value: 'FollowUp', label: 'Follow Up' },
  { value: 'ThankYou', label: 'Thank You' },
  { value: 'FinalPaymentReminder', label: 'Final Payment Reminder' },
  { value: 'FinalNotice', label: 'Final Notice' },
  { value: 'PaymentFailed', label: 'Payment Failed' },
  { value: 'CardExpiring', label: 'Card Expiring' },
];

export const noticeStatusList = [
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Bounced', value: 'Bounced' },
  { label: 'Failed', value: 'Failed' },
];

export const noticeMethods = ['All', 'Email', 'Call', 'Mail', 'SMS', 'Other'];
