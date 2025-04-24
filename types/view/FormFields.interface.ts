export interface FormFields {
  form: Array<{
    year: number;
    values: {
      servicePrices: Array<{
        name: string;
        price: string | number | undefined;
        isCustom?: boolean | undefined;
        description: string | undefined;
        BillingSchedule: any;
        priceType?: string | undefined;
        type?: string | undefined;
      }>;
      discounts: Array<{ type: string; amount: string | number | undefined; name: string }>;
      chargeType: string;
      subscriptionType: string;
      storagePrices: {
        [key: string]: {
          isEnabled: boolean;
          embryoPrice: string | number | undefined;
          spermPrice: string | number | undefined;
          oocytePrice: string | number | undefined;
          patientPrice: string | number | undefined;
          canePrice: string | number | undefined;
        };
      };
    };
  }>;
}
