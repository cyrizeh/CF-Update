import { PriceBillingType } from '@/constants/billing';

export function groupByPropertyBilling<T, K extends keyof T>(
  items: T[],
  property: K
): Record<string, (T & { serviceIndex: number; itemKey: string })[]> {
  const grouped = items.reduce(
    (acc: Record<string, (T & { serviceIndex: number; itemKey: string })[]>, item, index) => {
      let propValue = item[property];

      if (
        [PriceBillingType.ExtraProtectionProgram, PriceBillingType.TransferServiceGuarantee].includes(propValue as any)
      ) {
        propValue = PriceBillingType.ServiceGuarantee as T[K];
      } else if (
        [
          PriceBillingType.TransportationMetro,
          PriceBillingType.TransportationLocal,
          PriceBillingType.TransportationRegional,
          PriceBillingType.ClinicToClinicLocal,
        ].includes(propValue as any)
      ) {
        propValue = PriceBillingType.ClinicToClinicLocal as T[K];
      } else if (
        [
          PriceBillingType.ClinicToClinicNationwide,
          PriceBillingType.TransportationShort,
          PriceBillingType.TransportationLong,
        ].includes(propValue as any)
      ) {
        propValue = PriceBillingType.ClinicToClinicNationwide as T[K];
      } else if (
        [
          PriceBillingType.ExpeditedTransportationMetro,
          PriceBillingType.ExpeditedTransportationLocal,
          PriceBillingType.ExpeditedTransportationRegional,
          PriceBillingType.ExpeditedTransportationShort,
          PriceBillingType.ExpeditedTransportationLong,
          PriceBillingType.AdditionalTransferFee,
        ].includes(propValue as any)
      ) {
        propValue = PriceBillingType.AdditionalTransferFee as T[K];
      }

      if (propValue === undefined || propValue === null) return acc;
      const key = String(propValue);

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ ...item, serviceIndex: index, itemKey: key });
      return acc;
    },
    {}
  );

  // Sorting logic for the 'ServiceGuarantee' group
  if (grouped[PriceBillingType.ServiceGuarantee]) {
    grouped[PriceBillingType.ServiceGuarantee] = grouped[PriceBillingType.ServiceGuarantee].sort((a, b) => {
      // Place ExtraProtectionProgram at the end
      if (
        a[property] === PriceBillingType.ExtraProtectionProgram &&
        b[property] !== PriceBillingType.ExtraProtectionProgram
      ) {
        return 1;
      }
      if (
        b[property] === PriceBillingType.ExtraProtectionProgram &&
        a[property] !== PriceBillingType.ExtraProtectionProgram
      ) {
        return -1;
      }
      return 0; // keep the original order if both are the same
    });
  }

  return grouped;
}


export function sortObjectByKeysOrder<T>(obj: Record<string, T[]>, order: string[]): Record<string, T[]> {
  const sortedObj: Record<string, T[]> = {};

  order.forEach(key => {
    if (obj.hasOwnProperty(key)) {
      sortedObj[key] = obj[key];
    } else if (key === 'Other') {
      sortedObj[key] = [];
    }
  });

  Object.keys(obj).forEach(key => {
    if (!order.includes(key)) {
      if (!sortedObj['Other']) {
        sortedObj['Other'] = [];
      }
      sortedObj['Other'] = sortedObj['Other'].concat(obj[key]);
    }
  });

  return sortedObj;
}

export const getSortedGroupedServicePrices = (serviceFields: any[]) => {
  const grouped = groupByPropertyBilling(serviceFields, 'type');
  const keysOrder = [
    'Transfer',
    'ServiceGuarantee',
    'TransferServiceGuarantee',
    'ExtraProtectionProgram',
    'ClinicToClinicLocal',
    'ClinicToClinicNationwide',
    'AdditionalTransferFee',
    'AdditionalStorageFee',
    'Other',
  ];
  return sortObjectByKeysOrder(grouped, keysOrder);
};
