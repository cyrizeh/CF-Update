import * as Yup from 'yup';
import { fieldIsRequiredMessage, maxLengthMessage } from './validationUtils';

export const getValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().required(fieldIsRequiredMessage('Name')).max(100, maxLengthMessage(100, 'Facility name')),
    address: Yup.object().shape({
      street1: Yup.string().required(fieldIsRequiredMessage('Address 1')).max(100, maxLengthMessage(100, 'Address 1')),
      street2: Yup.string().max(100, maxLengthMessage(100, 'Address 2')),
      city: Yup.string().required(fieldIsRequiredMessage('City')).max(100, maxLengthMessage(100, 'City')),
      state: Yup.string().required(fieldIsRequiredMessage('State')),
      zipCode: Yup.string().required(fieldIsRequiredMessage('Zip code')).max(15, maxLengthMessage(15, 'Zip code')),
    }),
  });
