import * as Yup from 'yup';
import { emailRegex } from './general';
import { autoCompleteValidation } from './autoComplete';
import { maxLengthMessage } from './validationUtils';

export const getValidationSchema = (activeStep: number) =>
  Yup.object().shape({
    details: activeStep === 0 ? createClinicSchema : Yup.object().notRequired(),
    address: activeStep === 1 ? updateClinicAddressScheme : Yup.object().notRequired(),
    affiliate: activeStep === 2 ? updateClinicAffiliateScheme : Yup.object().notRequired(),
  });

export const createClinicSchema = Yup.object().shape({
  name: Yup.string().required("Clinic Name is required").max(100, maxLengthMessage(100, 'Clinic Name')),
  accountId: autoCompleteValidation('Please select a clinic from the dropdown list', false),
  clinicType: Yup.string().required("Clinic Type is required").max(100, maxLengthMessage(100, 'Clinic Type')),
  contactDetails: Yup.object().shape(
    {
      firstName: Yup.string().nullable().max(100, maxLengthMessage(100, 'First Name')),
      lastName: Yup.string().nullable().max(100, maxLengthMessage(100, 'Last Name')),
      email: Yup.string()
        .nullable()
        .when('email', {
          is: (val: string) => (val ? val.length > 0 : false),
          then: schema =>
            schema
              .trim()
              .email('Invalid email')
              .matches(emailRegex, 'Invalid email')
              .max(100, maxLengthMessage(100, 'Email')),
        }),
      phoneNumber: Yup.string()
        .nullable()
        .when('phoneNumber', {
          is: (val: any) => (val ? val.length > 0 : false),
          then: scheme => scheme.nullable().min(10, 'Phone Number must be at least 10 characters'),
        }),
      jobTitle: Yup.string().nullable().max(100, maxLengthMessage(100, 'Job Title')),

    },
    [
      ['email', 'email'],
      ['phoneNumber', 'phoneNumber'],
    ]
  ),
  secondaryContactDetails: Yup.object().shape(
    {
      firstName: Yup.string().nullable().max(100, maxLengthMessage(100, 'First Name')),
      lastName: Yup.string().nullable().max(100, maxLengthMessage(100, 'Last Name')),
      email: Yup.string()
        .nullable()
        .when('email', {
          is: (val: string) => (val ? val.length > 0 : false),
          then: schema =>
            schema
              .trim()
              .email('Invalid email')
              .matches(emailRegex, 'Invalid email')
              .max(100, maxLengthMessage(100, 'Email')),
        }),
      phoneNumber: Yup.string()
        .nullable()
        .when('phoneNumber', {
          is: (val: any) => (val ? val.length > 0 : false),
          then: scheme => scheme.nullable().min(10, 'Phone Number must be at least 10 characters'),
        }),
      jobTitle: Yup.string().nullable().max(100, maxLengthMessage(100, 'Job Title')),
    },
    [
      ['email', 'email'],
      ['phoneNumber', 'phoneNumber'],
    ]
  ),
});

export const addClinicAddressScheme =  Yup.object().shape(
  {
    address: Yup.object().shape({
      street1: Yup.string().required("Address 1 is required").max(100, maxLengthMessage(100, 'Address 1')),
      street2: Yup.string().max(100, maxLengthMessage(100, 'Address 2')),
      city: Yup.string().required("City is required").max(100, maxLengthMessage(100, 'City')),
      state: Yup.string().required("State is required"),
      zipCode: Yup.string().required("Zip code is required").max(100, maxLengthMessage(15, 'Zip code')),
    }),
    billingAddress: Yup.object().when('address.sameBilling', {
      is: (val: boolean) => !val,
      then: scheme =>
        scheme.shape({
          street1: Yup.string().required("Address 1 is required").max(100, maxLengthMessage(100, 'Address 1')),
          street2: Yup.string().max(100, maxLengthMessage(100, 'Address 2')),
          city: Yup.string().required("City is required").max(100, maxLengthMessage(100, 'City line 1')),
          state: Yup.string().required("State is required"),
          zipCode: Yup.string().required("Zip code is required").max(100, maxLengthMessage(15, 'Zip code')),
        }),
    }),
  },
  [['address.sameBilling', 'address.sameBilling']]
);

export const updateClinicAddressScheme = Yup.object().shape(
  {
    address: Yup.object().shape({
      street1: Yup.string().required("Address 1 is required").max(100, maxLengthMessage(100, 'Address 1')),
      street2: Yup.string().max(100, maxLengthMessage(100, 'Address 2')),
      city: Yup.string().required("City is required").max(100, maxLengthMessage(100, 'City')),
      state: Yup.string().required("State is required"),
      zipCode: Yup.string().required("Zip code is required").max(15, maxLengthMessage(15, 'Zip code')),
    }),
    billingAddress: Yup.object().when('address.sameBilling', {
      is: (val: boolean) => !val,
      then: scheme =>
        scheme.shape({
          street1: Yup.string().required("Address 1 is required").max(100, maxLengthMessage(100, 'Address 1')),
          street2: Yup.string().max(100, maxLengthMessage(100, 'Address 2')),
          city: Yup.string().required("City is required").max(100, maxLengthMessage(100, 'City')),
          state: Yup.string().required("State is required"),
          zipCode: Yup.string().required("Zip code is required").max(15, maxLengthMessage(15, 'Zip code')),
        }),
    }),
  },
  [['address.sameBilling', 'address.sameBilling']]
);

export const updateClinicAffiliateScheme = Yup.object().shape({
  transportPerPatient: Yup.number().required().min(0).max(9999.99),
  storagePrices: Yup.array().of(
    Yup.object().shape({
      price: Yup.number().required().min(0).max(9999.99),
    })
  ),
});

export const billingScheme = Yup.object().shape({
  servicePrices: Yup.object().shape({
    InitialPickupFee: Yup.number().required(),
    ReturnTransportationFee: Yup.number().required(),
    ClinicToClinicTransportationFee: Yup.number().required(),
    ThirdPartyCourierAdminFee: Yup.number().required(),
    OtherTransportationAdminFee: Yup.number().required(),
  }),
  discounts: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required(),
      amount: Yup.number().required(),
      name: Yup.string().required(),
    })
  ),
  storagePrices: Yup.object().shape({
    OneMonth: Yup.object().shape({
      embryoPrice: Yup.number().required(),
      spermPrice: Yup.number().required(),
      oocytePrice: Yup.number().required(),
    }),
    Quarter: Yup.object().shape({
      embryoPrice: Yup.number().required(),
      spermPrice: Yup.number().required(),
      oocytePrice: Yup.number().required(),
    }),
    SixMonth: Yup.object().shape({
      embryoPrice: Yup.number().required(),
      spermPrice: Yup.number().required(),
      oocytePrice: Yup.number().required(),
    }),
    OneYear: Yup.object().shape({
      embryoPrice: Yup.number().required(),
      spermPrice: Yup.number().required(),
      oocytePrice: Yup.number().required(),
    }),
    TwoYears: Yup.object().shape({
      embryoPrice: Yup.number().required(),
      spermPrice: Yup.number().required(),
      oocytePrice: Yup.number().required(),
    }),
    ThreeYear: Yup.object().shape({
      embryoPrice: Yup.number().required(),
      spermPrice: Yup.number().required(),
      oocytePrice: Yup.number().required(),
    }),
    FiveYears: Yup.object().shape({
      embryoPrice: Yup.number().required(),
      spermPrice: Yup.number().required(),
      oocytePrice: Yup.number().required(),
    }),
    TenYears: Yup.object().shape({
      embryoPrice: Yup.number().required(),
      spermPrice: Yup.number().required(),
      oocytePrice: Yup.number().required(),
    }),
  }),
});

export const pricingPlanClinicScheme = Yup.object().shape({
  plan: Yup.object().shape({
    id: Yup.string().required('Please select a plan from the dropdown list'),
    name: Yup.string().required('Please select a plan from the dropdown list'),
    version: Yup.string(),
  }),
});