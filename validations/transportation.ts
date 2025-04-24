import * as Yup from 'yup';
import { emailRegex } from './general';
import { autoCompleteValidation } from './autoComplete';
import { maxLengthMessage } from './validationUtils';
import { createNumberValidation } from '@/utils/createNumberValidation';

export const getValidationTransportationSchema = (activeStep: number, skipPartner: boolean) => {
  return Yup.object().shape({
    transportation: activeStep === 1 ? patientInfoSchema : Yup.object().notRequired(),
    partner:
      activeStep === 2 ? (skipPartner ? Yup.object().notRequired() : partnerInfoSchema) : Yup.object().notRequired(),
    clinicInfo: activeStep === 3 ? clinicsSchema() : Yup.object().notRequired(),
    shipment: activeStep === 4 ? shipmentInfoSchema : Yup.object().notRequired(),
  });
};

export const patientInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required').max(40, maxLengthMessage(40, 'First Name')),
  lastName: Yup.string().required('Last Name is required').max(40, maxLengthMessage(40, 'Last Name')),
  note: Yup.string().max(255, maxLengthMessage(255, 'Notes')),
  email: Yup.string()
    .trim()
    .required('Email is required')
    .email('Invalid email')
    .matches(emailRegex, 'Invalid email')
    .max(100, maxLengthMessage(100, 'Email')),
  phoneNumber: Yup.string().required('Phone Number is required').min(10, 'Phone Number must be at least 10 characters'),
  hasPartner: Yup.boolean(),
});

export const partnerInfoSchema = Yup.object().shape(
  {
    firstName: Yup.string().required('First Name is required').max(40, maxLengthMessage(40, 'First Name')),
    lastName: Yup.string().required('Last Name is required').max(40, maxLengthMessage(40, 'Last Name')),
    email: Yup.string()
      .trim()
      .required('Email is required')
      .email('Invalid email')
      .matches(emailRegex, 'Invalid email')
      .max(100, maxLengthMessage(100, 'Email')),
    phoneNumber: Yup.string()
      .required('Phone Number is required')
      .min(10, 'Phone Number must be at least 10 characters'),
    isValidPartner: Yup.boolean()
      .oneOf([true], 'This user is already a partner') // Ensures it's always `true`
      .default(true), // Sets the default value to `true`
  },
  [['email', 'email']]
);

export const shipmentInfoSchema = Yup.object().shape({
  typeOfSpecimen: Yup.array()
    .transform((value, originalValue) => (typeof originalValue === 'string' ? [] : value))
    .min(1, 'At least one specimen type must be selected')
    .required('At least one specimen type must be selected'),
  requestingClinic: autoCompleteValidation('Please select a clinic from the dropdown list'),
  payer: Yup.string().required('Please select a payer from the dropdown list'),
  witness: autoCompleteValidation('Please select a witness from the dropdown list'),
  isRequestinClinicValid: Yup.boolean().test({
    name: 'is-requestin-clinic-valid',
    message: `Requesting clinic must have a valid address`,
    test: (value, { createError }) => {
      if (!value) {
        return createError({
          message: `Requesting clinic must have a valid address`,
          path: 'shipment.requestingClinic',
        });
      }
      return true;
    },
  }),
});

export const addSendingReceivingClinicSchema = (pathName: string) =>
  Yup.object()
    .shape({
      clinic: autoCompleteValidation('Please select a clinic from the dropdown list'),
    })
    .test('manual', 'Sending and Receiving clinics must be different', function (value) {
      const { createError } = this;
      const { sending, receiving } = this.parent;
      if (sending && receiving && sending.clinic && receiving.clinic && sending.clinic.id === receiving.clinic.id) {
        return createError({
          path: pathName,
          message: 'Sending and Receiving clinics must be different',
          params: { ref: { name: pathName } },
        });
      }
      return true;
    });

export const urlPattern =
  /^(https?:\/\/(www\.)?[-a-z0-9@:%._\+~#=]{1,256}\.[a-z0-9()]{2,6}\b([-a-z0-9()@:%_\+.~#?&\/=]*)?)?$/i;

export const editTrakingUrlSchema = Yup.object().shape({
  url: Yup.string()
    .required()
    .matches(urlPattern, 'The tracking link you entered is not valid. Please enter a valid tracking link.'),
});

export const editDateSchema = Yup.object().shape({
  date: Yup.date().required('Please select a date'),
});

export const addTransfersSchema = Yup.object().shape({
  date: Yup.date().required(),
  clinic: autoCompleteValidation('Please select a clinic from the dropdown list').test(
    'status-check',
    'Cannot create a transfer request for an incomplete clinic',
    value => {
      // @ts-ignore
      return !(value && value.status === 'Draft');
    }
  ),
});

export const addTransfersToClinicSchema = Yup.object().shape({
  receivingClinic: Yup.string().max(100, maxLengthMessage(100, 'Clinic name')),
  notes: Yup.string().required('Please type a note').max(255, maxLengthMessage(255, 'Notes')),
  initials: Yup.string()
    .required('Initials are required')
    .max(50, maxLengthMessage(50, 'Technical Specialist initials')),
  date: Yup.date().required('Please select a date'),
});

export const updateCaneStatusSchema = Yup.object().shape({
  status: Yup.string().required('Please select a status from the dropdown list'),
  notes: Yup.string().required('Please type a note').max(255, maxLengthMessage(255, 'Notes')),
  initials: Yup.string()
    .required('Initials are required')
    .max(100, maxLengthMessage(100, 'Technical Specialist initials')),
  date: Yup.date().required('Date is required'),
});

export const addTransportationDetailsSchema = Yup.object().shape({
  // account: Yup.object().required('Required'),
  // facility: Yup.object().required('Required'),
  // shipmentType: Yup.string().required('Required'),
  // shipmentSentDate: Yup.date().required(),
  // shipmentReceivedDate: Yup.date().required(),
  // transportationMethod: Yup.string().required('Required'),
  trackingUrl: Yup.string().matches(
    urlPattern,
    'The tracking link you entered is not valid. Please enter a valid tracking link.'
  ),
  shipperNumber: Yup.string().max(40, maxLengthMessage(40, 'Shipper Number')),
  //   .required('Required')
  //   .matches(/^(\S+$)/, ''),
  numberOfCanes: createNumberValidation('Number of canes', 1, 99),
  numberOfDevice: createNumberValidation('Number of devices', 1, 99),
});

export const addInfoSchema = Yup.object().shape({
  clinic: autoCompleteValidation('Please select a clinic from the dropdown list'),
});

interface Clinic {
  name: string;
  id?: string;
}

export const clinicsSchema = () =>
  Yup.object()
    .shape({
      facility: autoCompleteValidation('Please select a facility from the dropdown list'),
      sending: Yup.object().shape({
        clinic: autoCompleteValidation('Please select a sending clinic from the dropdown list'),
        address: Yup.object()
          .nullable()
          .test('address-not-null', 'Sending clinic must have a valid address', function (value: any) {
            const { clinic } = this.parent;
            if (!clinic?.id) return true;
            if (!value || Object.keys(value).length === 0) {
              return this.createError({
                path: 'clinicInfo.sending.clinic',
                message: 'Sending clinic must have a valid address',
              });
            }
            if (!value || !value?.isValid) {
              return this.createError({
                path: 'clinicInfo.sending.clinic',
                message: 'Sending clinic must have a valid address',
              });
            }
            return true;
          }),
      }),
      receiving: Yup.object().shape({
        clinic: autoCompleteValidation('Please select a receiving clinic from the dropdown list'),
        address: Yup.object()
          .nullable()
          .test('address-not-null', 'Receiving clinic must have a valid address', function (value: any) {
            const { clinic } = this.parent;
            if (!clinic?.id) return true;
            if (!value || Object.keys(value).length === 0) {
              return this.createError({
                path: 'clinicInfo.receiving.clinic',
                message: 'Receiving clinic must have a valid address',
              });
            }
            if (!value || !value?.isValid) {
              return this.createError({
                path: 'clinicInfo.receiving.clinic',
                message: 'Receiving clinic must have a valid address',
              });
            }
            return true;
          }),
      }),
      distance: Yup.object().shape({
        sendingToRecieving: Yup.number()
          .moreThan(0, 'All distances must be greater than 0')
          .required('All distances must be greater than 0'),
        recievingToCryo: Yup.number()
          .moreThan(0, 'All distances must be greater than 0')
          .required('All distances must be greater than 0'),
        cryoToSending: Yup.number()
          .moreThan(0, 'All distances must be greater than 0')
          .required('All distances must be greater than 0'),
      }),
    })
    .test('clinics-different', 'Sending and Receiving clinics must be different', function (value) {
      const { sending, receiving } = value || {};

      if (typeof value?.sending === 'string' || typeof value?.receiving === 'string') return true;
      // Check if both clinics are defined and have IDs
      if (sending?.clinic && receiving?.clinic && (sending.clinic as Clinic)?.id === (receiving.clinic as Clinic)?.id) {
        return this.createError({
          path: 'clinicInfo.receiving.clinic',
          message: 'Sending and Receiving clinics must be different',
        });
      }

      return true;
    });

export const confirmAddressSchema = Yup.object().shape({
  address: Yup.object()
    .required()
    .shape({
      street1: Yup.string().required('Address 1 is required').max(100, maxLengthMessage(100, 'Address 1')),
      street2: Yup.string().nullable().max(100, maxLengthMessage(100, 'Address 2')),
      city: Yup.string().required('City is required').max(100, maxLengthMessage(100, 'City')),
      state: Yup.string().required('State is required'),
      zipCode: Yup.string().required('Zip code is required').max(15, maxLengthMessage(15, 'Zip Code')),
    }),
});
