import _ from 'lodash';
import * as Yup from 'yup';
import { fieldIsRequiredMessage, maxLengthMessage, maxNumberMessage, minNumberMessage } from './validationUtils';
import dayjs from 'dayjs';

export const getValidationSchema = (years: any, activeStep: number) => {
  const generateSchema = Yup.object().shape({
    form: Yup.array().of(
      Yup.lazy(item => {
        if (item.year === activeStep) return Yup.object().shape({ values: billingYearValidation });
        else return Yup.object().notRequired();
      })
    ),
  });

  return generateSchema;
};

export const billingYearValidation = Yup.object().shape({
  servicePrices: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(fieldIsRequiredMessage('Name')).max(100, maxNumberMessage(100, 'Name')),
      price: Yup.number()
        .transform((value: any) => (Number.isNaN(value) ? null : value))
        .when(['isEnabled', 'priceType'], {
          is: (isEnabled: any, priceType: string) => isEnabled && priceType !== 'Quoted',
          then: schema => schema.max(9999, maxNumberMessage(9999, 'Price')).required(fieldIsRequiredMessage('Price')),
          otherwise: schema => schema.nullable().max(9999, maxNumberMessage(9999, 'Price')),
        }),
    })
  ),
  discounts: Yup.array().of(
    Yup.object().shape(
      {
        type: Yup.string().when('amount', {
          is: (val: string) => _.isFinite(val),
          then: schema => schema.required(fieldIsRequiredMessage('Price')),
        }),
        amount: Yup.number()
          .when('amount', {
            is: (val: string) => _.isFinite(val),
            then: schema => schema.max(9999, maxNumberMessage(9999, 'Price')).required(fieldIsRequiredMessage('Price')),
          })
          .nullable()
          .transform((value: any) => (Number.isNaN(value) ? null : value)),
        name: Yup.string().required(fieldIsRequiredMessage('Name')).max(100, maxNumberMessage(100, 'Name')),
      },
      [['amount', 'amount']]
    )
  ),
  chargeType: Yup.string().required(fieldIsRequiredMessage('Price')),
  storagePrices: Yup.object()
    .when('chargeType', {
      is: (type: any) => type === 'Patient',
      then: scheme =>
        scheme.shape({
          OneMonth: Yup.object().shape({
            isEnabled: Yup.boolean(),
            patientPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          Quarter: Yup.object().shape({
            isEnabled: Yup.boolean(),
            patientPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          SixMonth: Yup.object().shape({
            isEnabled: Yup.boolean(),
            patientPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          OneYear: Yup.object().shape({
            isEnabled: Yup.boolean(),
            patientPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          TwoYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            patientPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          ThreeYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            patientPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          FiveYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            patientPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          TenYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            patientPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
        }),
    })
    .when('chargeType', {
      is: (type: any) => type === 'SpecimenTypes',
      then: scheme =>
        scheme.shape({
          OneMonth: Yup.object().shape({
            isEnabled: Yup.boolean(),
            embryoPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            spermPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            oocytePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          Quarter: Yup.object().shape({
            isEnabled: Yup.boolean(),
            embryoPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            spermPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            oocytePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          SixMonth: Yup.object().shape({
            isEnabled: Yup.boolean(),
            embryoPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            spermPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            oocytePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          OneYear: Yup.object().shape({
            isEnabled: Yup.boolean(),
            embryoPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            spermPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            oocytePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          TwoYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            embryoPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            spermPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            oocytePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          ThreeYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            embryoPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            spermPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            oocytePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          FiveYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            embryoPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            spermPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            oocytePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          TenYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            embryoPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            spermPrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
            oocytePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
        }),
    })
    .when('chargeType', {
      is: (type: any) => type === 'NumberOfCanes',
      then: scheme =>
        scheme.shape({
          OneMonth: Yup.object().shape({
            isEnabled: Yup.boolean(),
            canePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          Quarter: Yup.object().shape({
            isEnabled: Yup.boolean(),
            canePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          SixMonth: Yup.object().shape({
            isEnabled: Yup.boolean(),
            canePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          OneYear: Yup.object().shape({
            isEnabled: Yup.boolean(),
            canePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          TwoYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            canePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          ThreeYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            canePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          FiveYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            canePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
          TenYears: Yup.object().shape({
            isEnabled: Yup.boolean(),
            canePrice: Yup.number()
              .max(9999, maxNumberMessage(9999, 'Price'))
              .when('isEnabled', {
                is: (value: any) => value,
                then: schema =>
                  schema
                    .transform((value: any) => (Number.isNaN(value) ? null : value))
                    .required(fieldIsRequiredMessage('Price')),
                otherwise: schema =>
                  schema.transform((value: any) => (Number.isNaN(value) ? null : value)).notRequired(),
              }),
          }),
        }),
    }),
});

export const customChargeSchema = Yup.object().shape({
  customPayment: Yup.object().shape({
    name: Yup.string().required(fieldIsRequiredMessage('Name')).max(100, maxLengthMessage(100, 'Name')),
    price: Yup.number()
      .transform((value: any) => (Number.isNaN(value) ? null : value))
      .required(fieldIsRequiredMessage('Price'))
      .max(9999, maxNumberMessage(9999, 'Price'))
      .min(1, minNumberMessage(0, 'Price')),
    description: Yup.string().notRequired(),
    date: Yup.string()
      .nullable()
      .required('Date is required')
      .test({
        name: 'date-is-not-required',
        message: `Date is invalid`,
        test: (value, { path, createError }) => {
          const date = dayjs(value);
          const yesterday = dayjs().add(-1, 'day');

          if (!_.isEmpty(value) && date.isBefore(yesterday)) {
            return createError({
              message: `Date must be today or later`,
              path: path,
            });
          }
          if (!_.isEmpty(value) && !date.isValid()) {
            return createError({
              message: `Date is invalid`,
              path: path,
            });
          }

          return true;
        },
      }),
  }),
});
