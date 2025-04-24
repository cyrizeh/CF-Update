import { IdLabResultType, RFIDType } from '@/types/view/AddSpecimanModal.type';
import * as Yup from 'yup';
import { autoCompleteValidation } from './autoComplete';
import { fieldIsRequiredMessage, maxLengthMessage, minLengthMessage } from './validationUtils';
import { createNumberValidation } from '@/utils/createNumberValidation';

export const addSpecimenWitSteps = (activeStep: number) => {
  return Yup.object().shape({
    caneData: activeStep === 1 ? addCaneSchema : activeStep === 2 ? addCaneSchemaStep2 : Yup.object().notRequired(),
    specimensData: activeStep === 3 ? devicesDataSchema : Yup.array().notRequired(),
  });
};

//  Validation for First Step on Add Cane Modal(This for Cane)
const addCaneSchema = Yup.object().shape({
  receiptDate: Yup.date()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null ? null : value;
    })
    .nullable()
    .typeError('Invalid date')
    .required(fieldIsRequiredMessage('Receipt Date'))
    .max(new Date(), 'Date cannot be in the future')
    .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), 'Date must not be more than 100 years ago'),
  clinic: autoCompleteValidation('Please select a clinic from the dropdown list'),
  facilityId: autoCompleteValidation('Please select a facility from the dropdown list'),
  primaryIdentifier: autoCompleteValidation('Please select a Primary Identifier from the dropdown list'),
  deviceNumber: Yup.mixed().test(
    'device-number-check',
    'Device Quantity is required and must be greater than 1',
    function (value) {
      if (!value) {
        return this.createError({ message: 'Device Quantity is required', path: this.path });
      }
      if (isNaN(Number(value)) || parseInt(value.toString()) < 1) {
        return this.createError({
          message: 'Device Quantity must be a valid number and greater than 1',
          path: this.path,
        });
      }
      if (value && (isNaN(Number(value)) || parseInt(value.toString()) > 99)) {
        return this.createError({
          message: 'Device Quantity must be a valid number and not exceed 99',
          path: this.path,
        });
      }
      return true;
    }
  ),
  caneColor: Yup.string().nullable().max(50, maxLengthMessage(50, 'Cane ID (Cane color)')),
  caneLabel: Yup.string().nullable().max(150, maxLengthMessage(150, 'Cane Label')),
  rfidType: Yup.string().required('RFID Type is required'),
  rfId: Yup.string()
    .when(['rfidType'], {
      is: (rfidType: RFIDType) => rfidType === RFIDType.Manual,
      then: schema =>
        schema.required('RFID is required').max(16, maxLengthMessage(16, 'RFID')).min(4, minLengthMessage(4, 'RFID')),
      otherwise: schema => schema.notRequired(),
    })
    .test({
      name: 'rfidReaderId-is-required',
      message: `RFID is required`,
      test: (value, { path, createError, parent }) => {
        if (!!parent?.rfidType && parent?.rfidType === RFIDType.Reader) {
          if (!value || value.trim() === '') {
            return createError({
              message: `RFID is required`,
              path: path,
            });
          }
        }
        return true;
      },
    }),
  rfidReader: Yup.string().when(['rfidType'], {
    is: (rfidType: RFIDType) => rfidType === RFIDType.Reader,
    then: schema => schema.required('Reader is required'),
    otherwise: schema => schema.notRequired(),
  }),
  rfidReaderId: Yup.string().test({
    name: 'rfidReaderId-is-required',
    message: `RFID is required`,
    test: (value, { path, createError, parent }) => {
      //check this property only if rfidType is RFIDType.Reader
      if (!!parent?.rfidType && parent?.rfidType === RFIDType.Reader) {
        // if (!value || value.trim() === '') {
        //   return createError({
        //     message: `RFID is required`,
        //     path: path,
        //   });
        // }

        if (value && value === 'multiple') {
          return createError({
            message: 'Please scan only 1 item',
            path: path,
            type: 'custom',
          });
        }

        if (value && value === 'empty') {
          return createError({
            message: 'Please rescan the device',
            path: path,
            type: 'custom',
          });
        }

        if (value && value === 'error') {
          return createError({
            message: 'There is no connection. Please scan item again',
            path: path,
            type: 'custom',
          });
        }
      }
      return true;
    },
  }),
});
//  Validation for Second Step on Add Cane Modal(This for Cane)
const addCaneSchemaStep2 = Yup.object().shape({
  idLabResult: Yup.string().required('Lab Result ID is required').max(50, maxLengthMessage(50, 'Lab Result ID')),

  FDAEligibility: Yup.mixed().when('idLabResult', {
    is: (value: string) => value !== IdLabResultType.IncompleteTesting,
    then: schema =>
      schema
        .oneOf(['Yes', 'No', 'N/A'], 'FDA Eligibility must be Yes, No, or N/A')
        .required('FDA Eligibility is required'),
    otherwise: schema => schema.notRequired(),
  }),

  reactivity: Yup.boolean().when('idLabResult', {
    is: (value: string) => value !== IdLabResultType.IncompleteTesting,
    then: schema => schema.required('Reactivity is required'),
    otherwise: schema => schema.notRequired(),
  }),

  reactive: Yup.string().when(['reactivity', 'idLabResult'], {
    is: (reactivity: boolean, idLabResult: string) =>
      reactivity === true && idLabResult !== IdLabResultType.IncompleteTesting,
    then: schema =>
      schema.required('Reactive field is required when Reactivity is Yes').max(50, maxLengthMessage(50, 'Reactive')),
    otherwise: schema => schema.notRequired(),
  }),
  notes: Yup.string().when('idLabResult', {
    is: (value: IdLabResultType) => [IdLabResultType.Reactive, IdLabResultType.IncompleteTesting].includes(value),
    then: schema => schema.required('Notes text is required').max(250, maxLengthMessage(250, 'Notes text')),
  }),
});

// Validation for Third Step on Add Cane Modal(This for Device)
const deviceItemSchema = Yup.object({
  specimentype: Yup.string().required('Specimen Type is required'),
  deviceType: Yup.string().required('Device Type is required'),
  qty: createNumberValidation('Quantity', 1, 256),
  color: Yup.string().nullable().max(50, maxLengthMessage(50, 'Color')),
  rfidType: Yup.string().notRequired(),
  rfId: Yup.string()
    .when(['rfidType'], {
      is: (rfidType: RFIDType) => rfidType === RFIDType.Manual,
      then: schema =>
        schema.required('RFID is required').max(16, maxLengthMessage(16, 'RFID')).min(4, minLengthMessage(4, 'RFID')),
      otherwise: schema => schema.notRequired(),
    })
    .test({
      name: 'rfidReaderId-is-required',
      message: `RFID is required`,
      test: (value, { path, createError, parent }) => {
        if (!!parent?.rfidType && parent?.rfidType === RFIDType.Reader) {
          if (!value || value.trim() === '') {
            return createError({
              message: `RFID is required`,
              path: path,
            });
          }
        }
        return true;
      },
    }),
  rfidReader: Yup.string().when(['rfidType'], {
    is: (rfidType: RFIDType) => rfidType === RFIDType.Reader,
    then: schema => schema.required('Reader is required'),
    otherwise: schema => schema.notRequired(),
  }),
  rfidReaderId: Yup.string().test({
    name: 'rfidReaderId-is-required',
    message: `RFID is required`,
    test: (value, { path, createError, parent }) => {
      //check this property only if rfidType is RFIDType.Reader
      if (!!parent?.rfidType && parent?.rfidType === RFIDType.Reader) {
        // if (!value || value.trim() === '') {
        //   return createError({
        //     message: `RFID is required`,
        //     path: path,
        //   });
        // }

        if (value && value === 'multiple') {
          return createError({
            message: 'Please scan only 1 item',
            path: path,
            type: 'custom',
          });
        }

        if (value && value === 'empty') {
          return createError({
            message: 'Please rescan the device',
            path: path,
            type: 'custom',
          });
        }

        if (value && value === 'error') {
          return createError({
            message: 'There is no connection. Please scan item again',
            path: path,
            type: 'custom',
          });
        }
      }
      return true;
    },
  }),

  // Optional fields
  notes: Yup.string().nullable().max(255, 'Notes must be at most 255 characters'),
  description: Yup.string().nullable().max(255, 'Device ID must be at most 255 characters'),
  freesedate: Yup.date()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null ? null : value;
    })
    .nullable()
    .typeError('Invalid date')
    .max(new Date(), 'Date cannot be in the future')
    .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), 'Invalid date'),
  numberOfSpecimens: createNumberValidation('Number of specimens', 1, 99),
}).test('unique-qty', 'Quantity (qty) must be unique', function (value) {
  const specimensData = (this.options as any)?.parent || [];
  const currentIndex = (this.options as any)?.index;

  const isDuplicate = specimensData.some((item: any, index: number) => {
    return index !== currentIndex && Number(item.qty) === Number(value?.qty);
  });

  if (isDuplicate) {
    return this.createError({
      path: `${this.path}.qty`,
      message: 'Quantity must be unique',
    });
  }

  return true;
});

// Array of Devices
const devicesDataSchema = Yup.array().of(deviceItemSchema);

// Validation For Update Cane Location
export const updateCaneLocationSchema = Yup.object().shape({
  facilityId: Yup.string().trim().required('Please select a facility from the dropdown list'),
  vaultId: Yup.string().trim().required('Vault ID is required'),
  tankId: Yup.string().trim().required('Tank ID is required'),
  // pieId: Yup.string().required('Pie ID is required'),
  canisterId: Yup.string().trim().required('Canister ID is required'),
  slotId: Yup.string().trim().required('Slot ID is required'),
});

// Edit Cane Validation

export const editCaneStepsFormSchema = (activeStep: number, actualDeviceNumber: number) => {
  return activeStep === 1
    ? editCaneFormSchema(actualDeviceNumber)
    : activeStep === 2
    ? editCaneSchemaStep2
    : Yup.object().notRequired();
};

export const editCaneFormSchema = (actualDeviceNumber: number) =>
  Yup.object().shape({
    caneColor: Yup.string().nullable().max(50, maxLengthMessage(50, 'Cane ID (Cane color)')),
    caneLabel: Yup.string().nullable().max(150, maxLengthMessage(150, 'Cane Label')),
    deviceNumber: Yup.mixed().test(
      'device-number-check',
      'Device Quantity is required and must be greater than 1',
      function (value) {
        if (!value) {
          return this.createError({ message: 'Device Quantity is required', path: this.path });
        }
        if (isNaN(Number(value)) || parseInt(value.toString()) < 1) {
          return this.createError({
            message: 'Expected Device Quantity must be a valid number and greater than 1',
            path: this.path,
          });
        }
        if (value && (isNaN(Number(value)) || parseInt(value.toString()) > 99)) {
          return this.createError({
            message: 'Expected Device Quantity must be a valid number and not exceed 99',
            path: this.path,
          });
        }

        if (value && (isNaN(Number(value)) || parseInt(value.toString()) < actualDeviceNumber)) {
          return this.createError({
            message: 'Expected Device Quantity must be greater then actual Device Quantity',
            path: this.path,
          });
        }
        return true;
      }
    ),
    receiptDate: Yup.date()
      .transform((value, originalValue) => {
        return originalValue === '' || originalValue === null ? null : value;
      })
      .nullable()
      .typeError('Invalid date')
      .required(fieldIsRequiredMessage('Receipt Date'))
      .max(new Date(), 'Date cannot be in the future')
      .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), 'Invalid date'),
    primaryIdentifier: autoCompleteValidation('Please select a Primary Identifier from the dropdown list'),
  });

// Validation for Specimen when we add it to device
export const addSpecimanToStrawSchema = Yup.object().shape({
  specimentype: Yup.string().required('Specimen type is required'),
  gradeMaturity: Yup.string().nullable().max(50, maxLengthMessage(50, 'Grade/Maturity')),
  PGTResults: Yup.string().nullable().max(50, maxLengthMessage(50, 'PGT Results')),
  embryoOocyteCount: Yup.mixed().test(
    'device-number-check',
    'Embryo/Oocyte Count is required and must be greater than 1',
    function (value) {
      if (value && (isNaN(Number(value)) || parseInt(value.toString()) < 1)) {
        return this.createError({
          message: 'Embryo/Oocyte Count must be a valid number and greater than 1',
          path: this.path,
        });
      }
      if (value && (isNaN(Number(value)) || parseInt(value.toString()) > 256)) {
        return this.createError({
          message: 'Embryo/Oocyte Count must be a valid number and not exceed 256',
          path: this.path,
        });
      }
      return true;
    }
  ),
});

// Validation Schema for Edit RFID on Add Cane Modal
export const EditRFIDSchema = Yup.object().shape({
  rfidType: Yup.string().required('RFID Type is required'),
  rfId: Yup.string()
    .when(['rfidType'], {
      is: (rfidType: RFIDType) => rfidType === RFIDType.Manual,
      then: schema =>
        schema
          .required('RFID is required')
          .max(16, 'RFID should not exceed 16 characters')
          .min(4, 'RFID should be at least 4 characters'),
      otherwise: schema => schema.notRequired(),
    })
    .test({
      name: 'rfidReaderId-is-required',
      message: 'RFID is required',
      test: (value, { path, createError, parent }) => {
        if (!!parent?.rfidType && parent?.rfidType === RFIDType.Reader) {
          if (!value || value.trim() === '') {
            return createError({
              message: 'RFID is required',
              path: path,
            });
          }
        }
        return true;
      },
    }),
  rfidReader: Yup.string().when(['rfidType'], {
    is: (rfidType: RFIDType) => rfidType === RFIDType.Reader,
    then: schema => schema.required('Reader is required'),
    otherwise: schema => schema.notRequired(),
  }),
  rfidReaderId: Yup.string().test({
    name: 'rfidReaderId-is-required',
    message: 'RFID is required',
    test: (value, { path, createError, parent }) => {
      if (!!parent?.rfidType && parent?.rfidType === RFIDType.Reader) {
        if (value === 'multiple') {
          return createError({
            message: 'Please scan only 1 item',
            path: path,
            type: 'custom',
          });
        }
        if (value === 'empty') {
          return createError({
            message: 'Please rescan the device',
            path: path,
            type: 'custom',
          });
        }
        if (value === 'error') {
          return createError({
            message: 'There is no connection. Please scan item again',
            path: path,
            type: 'custom',
          });
        }
      }
      return true;
    },
  }),
});

// Add Devices Table on Cane Details Page
export const addDevicesSeparate = Yup.object().shape({
  devices: devicesDataSchema,
});

// Edit Device
export const EditDeviceItemSchema = Yup.object({
  specimentype: Yup.string().required('Specimen Type is required'),
  deviceType: Yup.string().required('Device Type is required'),
  qty: createNumberValidation('Quantity', 1, 256),
  // Optional fields
  color: Yup.string().nullable().max(50, maxLengthMessage(50, 'Color')),
  notes: Yup.string().nullable().max(255, 'Notes must be at most 255 characters'),
  description: Yup.string().nullable().max(255, 'Device ID must be at most 255 characters'),
  freesedate: Yup.date()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null ? null : value;
    })
    .nullable()
    .typeError('Invalid date')
    .max(new Date(), 'Date cannot be in the future')
    .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), 'Invalid date'),
  numberOfSpecimens: createNumberValidation('Number of specimens', 1, 99),
});

//  Validation for Second Step on Edit Cane Modal
const editCaneSchemaStep2 = Yup.object().shape({
  idLabResult: Yup.string().required('Lab Result ID is required').max(50, maxLengthMessage(50, 'Lab Result ID')),

  FDAEligibility: Yup.mixed().when('idLabResult', {
    is: (value: string) => value !== IdLabResultType.IncompleteTesting,
    then: schema =>
      schema
        .oneOf(['Yes', 'No', 'N/A'], 'FDA Eligibility must be Yes, No, or N/A')
        .required('FDA Eligibility is required'),
    otherwise: schema => schema.notRequired(),
  }),

  reactivity: Yup.boolean().when('idLabResult', {
    is: (value: string) => value !== IdLabResultType.IncompleteTesting,
    then: schema => schema.required('Reactivity is required'),
    otherwise: schema => schema.notRequired(),
  }),

  reactive: Yup.string().when(['reactivity', 'idLabResult'], {
    is: (reactivity: boolean, idLabResult: string) =>
      reactivity === true && idLabResult !== IdLabResultType.IncompleteTesting,
    then: schema =>
      schema.required('Reactive field is required when Reactivity is Yes').max(50, maxLengthMessage(50, 'Reactive')),
    otherwise: schema => schema.notRequired(),
  }),
});

export const editRfidSchema = Yup.object().shape({
  rfid: Yup.string()
    .required('RFID is required')
    .max(16, maxLengthMessage(16, 'RFID'))
    .min(4, minLengthMessage(4, 'RFID')),
});
