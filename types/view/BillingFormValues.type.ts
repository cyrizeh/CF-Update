export type BillingFormValues = {
  servicePrices: {
    InitialPickupFee: number;
    ReturnTransportationFee: number;
    ClinicToClinicTransportationFee: number;
    ThirdPartyCourierAdminFee: number;
    OtherTransportationAdminFee: number;
  };
  discounts: Array<{ type: string; amount: number; name: string }>;
  storagePrices: {
    OneMonth: {
      embryoPrice: number;
      spermPrice: number;
      oocytePrice: number;
      chargeType: string;
    };
    Quarter: {
      embryoPrice: number;
      spermPrice: number;
      oocytePrice: number;
      chargeType: string;
    };
    SixMonth: {
      embryoPrice: number;
      spermPrice: number;
      oocytePrice: number;
      chargeType: string;
    };
    OneYear: {
      embryoPrice: number;
      spermPrice: number;
      oocytePrice: number;
      chargeType: string;
    };
    TwoYears: {
      embryoPrice: number;
      spermPrice: number;
      oocytePrice: number;
      chargeType: string;
    };
    ThreeYears: {
      embryoPrice: number;
      spermPrice: number;
      oocytePrice: number;

      chargeType: string;
    };
    FiveYears: {
      embryoPrice: number;
      spermPrice: number;
      oocytePrice: number;

      chargeType: string;
    };
    TenYears: {
      embryoPrice: number;
      spermPrice: number;
      oocytePrice: number;

      chargeType: string;
    };
  };
};
