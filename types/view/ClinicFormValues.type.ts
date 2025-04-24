export type ClinicFormValues = {
  details: {
    name: string;
    accountId: {
      id: string;
      name: string;
    };
    clinicType: string;
    contactDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      jobTitle: string;
    };
    secondaryContactDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      jobTitle: string;
    };
  };
  address: {
    address: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zipCode: string;
      sameBilling: boolean;
    };
    billingAddress: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  affiliate: {
    transportPerPatient: string | null;
    storagePrices: [
      {
        storageDuration: 'OneMonth';
        price: string | null;
      },
      {
        storageDuration: 'Quarter';
        price: string | null;
      },
      {
        storageDuration: 'SixMonth';
        price: string | null;
      },
      {
        storageDuration: 'OneYear';
        price: string | null;
      },
      {
        storageDuration: 'TwoYears';
        price: string | null;
      },
      {
        storageDuration: 'ThreeYears';
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
};
