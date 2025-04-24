import * as Yup from 'yup';
import { emailRegex } from './general';
import dayjs from 'dayjs';
import { autoCompleteValidation } from './autoComplete';
import { fieldIsRequiredMessage, maxLengthMessage } from './validationUtils';
import { createNumberValidation } from '@/utils/createNumberValidation';
import { OnboardingType } from '@/types/view/OnBoardingType.type';

export const getValidationPatientSchema = (activeStep: number, skip?: boolean, skipEmergency?: boolean) => {
  return Yup.object().shape({
    patient: activeStep === 1 ? createPatientSchema : Yup.object().notRequired(),
    partner: activeStep === 2 ? (skip ? Yup.object().notRequired() : createPatientSchema) : Yup.object().notRequired(),
    emergencyInfo:
      activeStep === 3 ? (skipEmergency ? Yup.object().notRequired() : emergencySchema) : Yup.object().notRequired(),
    billingInfo: activeStep === 4 ? billingSchema : Yup.object().notRequired(),
    donorInfo: activeStep === 5 ? donorSchema : Yup.object().notRequired(),
  });
};

export const getRegistrationPatientSchema = (activeStep: number, skip?: boolean, skipEmergency?: boolean) => {
  return Yup.object().shape({
    patient: activeStep === 1 ? registerPatientSchema : Yup.object().notRequired(),
    partner:
      activeStep === 2 ? (skip ? Yup.object().notRequired() : registerPartnerSchema) : Yup.object().notRequired(),
    emergencyInfo:
      activeStep === 3
        ? skipEmergency
          ? Yup.object().notRequired()
          : registerEmergencySchema
        : Yup.object().notRequired(),
  });
};

function subtractYears(date: Date, years: number): Date {
  date.setFullYear(date.getFullYear() - years);
  return date;
}

export const signupSchema = Yup.object().shape(
  {
    firstName: Yup.string().required('First Name is required').max(40, maxLengthMessage(40, 'First Name')),
    lastName: Yup.string().required('Last Name is required').max(40, maxLengthMessage(40, 'Last Name')),
    email: Yup.string()
      .required('Email is required')
      .when('email', {
        is: (val: string) => (val ? val.length > 0 : false),
        then: schema =>
          schema
            .trim()
            .email('Invalid email')
            .matches(emailRegex, 'Invalid email')
            .max(100, maxLengthMessage(100, 'Email')),
      }),
    phoneNumber: Yup.string().when('phoneNumber', {
      is: (val: any) => (val ? val.length > 0 : false),
      then: schema => schema.nullable().min(10, 'Phone Number must be at least 10 characters'),
    }),
  },
  [
    ['phoneNumber', 'phoneNumber'],
    ['email', 'email'],
  ]
);

export const createPatientSchema = Yup.object().shape(
  {
    firstName: Yup.string().required('First Name is required').max(40, maxLengthMessage(40, 'First Name')),
    middleName: Yup.string().nullable().max(40, maxLengthMessage(40, 'Middle Name')),
    dateOfBirth: Yup.date()
      .transform((value, originalValue) => {
        return originalValue === '' || originalValue === null ? null : value;
      })
      .nullable()
      .typeError('Invalid date')
      .min(subtractYears(new Date(), 80), `Date of birth must be after the year ${new Date().getFullYear() - 80}`)
      .max(new Date(), 'Date of birth cannot be in the future'),
    lastName: Yup.string().required('Last Name is required').max(40, maxLengthMessage(40, 'Last Name')),
    email: Yup.string().when('email', {
      is: (val: string) => (val ? val.length > 0 : false),
      then: schema =>
        schema
          .trim()
          .email('Invalid email')
          .matches(emailRegex, 'Invalid email')
          .max(100, maxLengthMessage(100, 'Email')),
    }),
    alternativeEmail: Yup.string().when('alternativeEmail', {
      is: (val: string) => (val ? val.length > 0 : false),
      then: schema =>
        schema
          .trim()
          .required('Required')
          .email('Invalid email')
          .matches(emailRegex, 'Invalid email')
          .max(100, maxLengthMessage(100, 'Alternative Email')),
    }),
    note: Yup.string().max(255, maxLengthMessage(255, 'Note')),
    phoneNumber: Yup.string().when('phoneNumber', {
      is: (val: any) => (val ? val.length > 0 : false),
      then: schema => schema.nullable().min(10, 'Phone Number must be at least 10 characters'),
    }),
    address: Yup.object().shape({
      street1: Yup.string().max(100, maxLengthMessage(100, 'Address 1')),
      street2: Yup.string().max(100, maxLengthMessage(100, 'Address 2')),
      city: Yup.string().nullable().max(100, maxLengthMessage(100, 'City')),
      state: Yup.string().nullable(),
      zipCode: Yup.string().nullable().max(15, maxLengthMessage(15, 'Zip Code')),
    }),
  },
  [
    ['alternativeEmail', 'alternativeEmail'],
    ['phoneNumber', 'phoneNumber'],
    ['email', 'email'],
  ]
);

export const registerPartnerSchema = Yup.object().shape(
  {
    firstName: Yup.string().required('First Name is required').max(40, maxLengthMessage(40, 'First Name')),
    middleName: Yup.string().nullable().max(40, maxLengthMessage(40, 'Middle Name')),
    lastName: Yup.string().required('Last Name is required').max(40, maxLengthMessage(40, 'Last Name')),
    email: Yup.string()
      .required('Email is required')
      .when('email', {
        is: (val: string) => (val ? val.length > 0 : false),
        then: schema =>
          schema
            .trim()
            .email('Invalid email')
            .matches(emailRegex, 'Invalid email')
            .max(100, maxLengthMessage(100, 'Email')),
      })
      .required('Email is required'),
  },
  [['email', 'email']]
);

export const registerPatientSchema = Yup.object().shape(
  {
    firstName: Yup.string().required('First Name is required').max(40, maxLengthMessage(40, 'First Name')),
    middleName: Yup.string().nullable().max(40, maxLengthMessage(40, 'Middle Name')),
    dateOfBirth: Yup.date()
      .nullable()
      .typeError('Invalid date')
      .min(subtractYears(new Date(), 80), `Date of birth must be after the year ${new Date().getFullYear() - 80}`)
      .max(new Date(), 'Date of birth cannot be in the future'),
    lastName: Yup.string().required('Last Name is required').max(40, maxLengthMessage(40, 'Last Name')),
    email: Yup.string()
      .required('Email is required')
      .when('email', {
        is: (val: string) => (val ? val.length > 0 : false),
        then: schema =>
          schema
            .trim()
            .email('Invalid email')
            .matches(emailRegex, 'Invalid email')
            .max(100, maxLengthMessage(100, 'Email')),
      }),
    alternativeEmail: Yup.string().when('alternativeEmail', {
      is: (val: string) => (val ? val.length > 0 : false),
      then: schema =>
        schema
          .trim()
          .email('Invalid email')
          .matches(emailRegex, 'Invalid email')
          .max(100, maxLengthMessage(100, 'Alternative Email')),
    }),
    phoneNumber: Yup.string().when('phoneNumber', {
      is: (val: any) => (val ? val.length > 0 : false),
      then: schema => schema.nullable().min(10, 'Phone Number must be at least 10 characters'),
    }),
    address: Yup.object()
      .required()
      .shape({
        street1: Yup.string().required('Address 1 is required').max(100, maxLengthMessage(100, 'Address 1')),
        street2: Yup.string().nullable().max(100, maxLengthMessage(100, 'Address 2')),
        city: Yup.string().required('City is required').max(100, maxLengthMessage(100, 'City')),
        state: Yup.string().required('State is required'),
        zipCode: Yup.string().required('Zip code is required').max(15, maxLengthMessage(15, 'Zip Code')),
      }),
  },
  [
    ['alternativeEmail', 'alternativeEmail'],
    ['phoneNumber', 'phoneNumber'],
    ['email', 'email'],
  ]
);

export const emergencySchema = Yup.object().shape(
  {
    contactName: Yup.string().required('Contact Name is required').max(40, maxLengthMessage(40, 'Contact Name')),
    contactEmail: Yup.string()
      .required('Email is required')
      .when('contactEmail', {
        is: (val: string) => (val ? val.length > 0 : false),
        then: schema =>
          schema
            .trim()
            .email('Invalid email')
            .matches(emailRegex, 'Invalid email')
            .max(100, maxLengthMessage(100, 'Contact Email')),
      }),
    contactAddress: Yup.string()
      .required('Contact Address is required')
      .max(100, maxLengthMessage(100, 'Contact Address')),
  },
  [['contactEmail', 'contactEmail']]
);

export const registerEmergencySchema = Yup.object().shape(
  {
    contactName: Yup.string().required('Contact Name is required').max(40, maxLengthMessage(40, 'Contact Name')),
    contactEmail: Yup.string()
      .required('Contact Email is required')
      .when('contactEmail', {
        is: (val: string) => (val ? val.length > 0 : false),
        then: schema =>
          schema
            .trim()
            .required('Required')
            .email('Invalid email')
            .matches(emailRegex, 'Invalid email')
            .max(100, maxLengthMessage(100, 'Contact Email')),
      }),
    contactAddress: Yup.string()
      .required('Contact Address is required')
      .max(100, maxLengthMessage(100, 'Contact Address')),
  },
  [['contactEmail', 'contactEmail']]
);

export const billingSchema = Yup.object().shape(
  {
    clinicId: autoCompleteValidation('Please select a clinic from the dropdown list'),
    facilityId: Yup.string().required('Please select a facility from the dropdown list'),
    billingStartDate: Yup.date()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' || dayjs(originalValue, 'MM/DD/YYYY', true).isValid() ? value : null;
      })
      .when('billingStartDate', {
        is: (val: any) => val !== undefined && val !== null,
        then: schema =>
          schema
            .min(dayjs().subtract(6, 'month').subtract(1, 'day'), 'Date cannot be more than 6 months in the past')
            .nullable(),
      }),
  },
  [['billingStartDate', 'billingStartDate']]
);

export const donorSchema = Yup.object()
  .shape({
    specimenTypes: Yup.mixed()
      .test('is-array-or-string', 'At least one specimen type must be selected', function (value) {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        if (typeof value === 'string') {
          return false;
        }
        return false;
      })
      .required('Specimen type is required'),
    numberOfCanes: createNumberValidation('Number of canes', 1, 99),
    isPreTreatment: Yup.boolean(),
    onBoardingType: Yup.string().required('Please select Onboarding type'),
    witness: Yup.mixed()
      .nullable()
      .when('onBoardingType', {
        is: (value: any) => value === OnboardingType.FullOnboard,
        then: () => autoCompleteValidation('Please select a witness from the dropdown list'),
        otherwise: schema => schema.notRequired(),
      }),
  })
  .test('test-type', 'Please add an email to this patient before selecting an onboarding type', function (value) {
    const patient = this.parent?.patient;
    const email = patient?.email;
    const onboardingType = value?.onBoardingType;

    if (onboardingType != OnboardingType.NoLoginOnboarding && !email) {
      return this.createError({
        message: 'Please add an email to this patient before selecting an onboarding type',
        path: `${this.path}.onBoardingType`,
      });
    }
    return true;
  });

export const editProfileShema = Yup.object().shape(
  {
    email: Yup.string()
      .required(fieldIsRequiredMessage('Email'))
      .when('email', {
        is: (val: string) => (val ? val.length > 0 : false),
        then: schema =>
          schema
            .trim()
            .email('Invalid email')
            .matches(emailRegex, 'Invalid email')
            .max(100, maxLengthMessage(100, 'Email')),
      }),
    alternativeEmail: Yup.string().when('alternativeEmail', {
      is: (val: string) => (val ? val.length > 0 : false),
      then: schema =>
        schema
          .trim()
          .nullable()
          .required('Required')
          .email('Invalid email')
          .matches(emailRegex, 'Invalid email')
          .max(100, maxLengthMessage(100, 'Alternative Email')),
    }),
    phoneNumber: Yup.string()
      .when('phoneNumber', {
        is: (val: any) => (val ? val.length > 0 : false),
        then: schema => schema.nullable().min(10, 'Phone Number must be at least 10 characters'),
      })
      .required(fieldIsRequiredMessage('Phone Number')),
    address: Yup.object().shape({
      street1: Yup.string()
        .max(100, maxLengthMessage(100, 'Address 1'))
        .required(fieldIsRequiredMessage('Address Line 1')),
      street2: Yup.string().max(100, maxLengthMessage(100, 'Address 2')),
      city: Yup.string().nullable().max(100, maxLengthMessage(100, 'City')).required(fieldIsRequiredMessage('City')),
      state: Yup.string().nullable().required(fieldIsRequiredMessage('State')),
      zipCode: Yup.string()
        .nullable()
        .max(15, maxLengthMessage(15, 'Zip Code'))
        .required(fieldIsRequiredMessage('Zip Code')),
    }),
  },
  [
    ['alternativeEmail', 'alternativeEmail'],
    ['phoneNumber', 'phoneNumber'],
    ['email', 'email'],
  ]
);

export const editPatientProfileShema = Yup.object().shape(
  {
    firstName: Yup.string().required(fieldIsRequiredMessage('First Name')).max(40, maxLengthMessage(40, 'First Name')),
    middleName: Yup.string().max(40, maxLengthMessage(40, 'Middle Name')).nullable(),
    dateOfBirth: Yup.lazy(value =>
      value === null || value === ''
        ? Yup.mixed().nullable()
        : Yup.date()
            .nullable()
            .typeError('Invalid date')
            .min(subtractYears(new Date(), 80), 'Date of birth cannot be more than 80 years ago')
            .max(new Date(), 'Date of birth cannot be in the future')
    ),
    lastName: Yup.string().required(fieldIsRequiredMessage('Last Name')).max(40, maxLengthMessage(40, 'Last Name')),
    email: Yup.string().when('email', {
      is: (val: string) => (val ? val.length > 0 : false),
      then: schema =>
        schema
          .trim()
          .email('Invalid email')
          .matches(emailRegex, 'Invalid email')
          .max(100, maxLengthMessage(100, 'Email')),
    }),
    alternativeEmail: Yup.string().when('alternativeEmail', {
      is: (val: string) => (val ? val.length > 0 : false),
      then: schema =>
        schema
          .trim()
          .nullable()
          .required('Required')
          .email('Invalid email')
          .matches(emailRegex, 'Invalid email')
          .max(100, maxLengthMessage(100, 'Alternative Email')),
    }),
    phoneNumber: Yup.string()
      .nullable()
      .when('phoneNumber', {
        is: (val: any) => (val ? val.length > 0 : false),
        then: schema => schema.nullable().min(10, 'Phone Number must be at least 10 characters'),
      }),
    address: Yup.object().shape({
      street1: Yup.string().max(100, maxLengthMessage(100, 'Address 1')),
      street2: Yup.string().max(100, maxLengthMessage(100, 'Address 2')),
      city: Yup.string().nullable().max(100, maxLengthMessage(100, 'City')),
      state: Yup.string().nullable(),
      zipCode: Yup.string().nullable().max(15, maxLengthMessage(15, 'Zip Code')),
    }),
  },
  [
    ['alternativeEmail', 'alternativeEmail'],
    ['phoneNumber', 'phoneNumber'],
    ['email', 'email'],
  ]
);

export const editPatientDonorSchema = Yup.object().shape({
  specimenTypes: Yup.array(),
  numberOfCanes: Yup.string()
    .notRequired()
    .nullable()
    .test('numberOfCanes-check', 'Number of Canes is not required', function (value) {
      if (value && (isNaN(Number(value)) || parseInt(value.toString()) < 0)) {
        return this.createError({
          message: 'Number of Canes must be a valid number and greater than 0',
          path: this.path,
        });
      }
      if (value && (isNaN(Number(value)) || parseInt(value.toString()) > 99)) {
        return this.createError({
          message: 'Number of Canes must be a valid number and less than 99',
          path: this.path,
        });
      }
      return true;
    }),
});

export const confirmPatientDetailsSchema = Yup.object().shape(
  {
    firstName: Yup.string().required('First Name is required').max(40, maxLengthMessage(40, 'First Name')),
    middleName: Yup.string().max(40, maxLengthMessage(40, 'Middle Name')).nullable(),
    dateOfBirth: Yup.lazy(value =>
      value === null || value === ''
        ? Yup.mixed().nullable()
        : Yup.date()
            .nullable()
            .typeError('Invalid date')
            .min(subtractYears(new Date(), 80), 'Date of birth cannot be more than 80 years ago')
            .max(new Date(), 'Date of birth cannot be in the future')
    ),
    lastName: Yup.string().required('Last Name is required').max(40, maxLengthMessage(40, 'Last Name')),
    email: Yup.string()
      .required('Email is required')
      .when('email', {
        is: (val: string) => (val ? val.length > 0 : false),
        then: schema =>
          schema
            .trim()
            .email('Invalid email')
            .matches(emailRegex, 'Invalid email')
            .max(100, maxLengthMessage(100, 'Email')),
      }),
    alternativeEmail: Yup.string().when('alternativeEmail', {
      is: (val: string) => (val ? val.length > 0 : false),
      then: schema =>
        schema
          .trim()
          .nullable()
          .required('Required')
          .email('Invalid email')
          .matches(emailRegex, 'Invalid email')
          .max(100, maxLengthMessage(100, 'Alternative Email')),
    }),
    phoneNumber: Yup.string()
      .nullable()
      .when('phoneNumber', {
        is: (val: any) => (val ? val.length > 0 : false),
        then: schema => schema.nullable().min(10, 'Phone Number must be at least 10 characters'),
      }),
    address: Yup.object()
      .required()
      .shape({
        street1: Yup.string().required('Address 1 is required').max(100, maxLengthMessage(100, 'Address 1')),
        street2: Yup.string().nullable().max(100, maxLengthMessage(100, 'Address 2')),
        city: Yup.string().required('City is required').max(100, maxLengthMessage(100, 'City')),
        state: Yup.string().required('State is required'),
        zipCode: Yup.string().required('Zip code is required').max(15, maxLengthMessage(15, 'Zip Code')),
      }),
  },
  [
    ['alternativeEmail', 'alternativeEmail'],
    ['phoneNumber', 'phoneNumber'],
    ['email', 'email'],
  ]
);
