export type UpdateClinicAffiliateRequest = {
  clinicId: string;
  transportPerPatient: string | null;
  storagePrices: [
    {
      storageDuration: 'OneYear';
      price: string | null;
    },
    {
      storageDuration: 'FiveYears';
      price: string | null;
    },
    {
      storageDuration: 'TenYears';
      price: string | null;
    }
  ];
};
