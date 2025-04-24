import * as Yup from 'yup';
export const createNumberValidation = (fieldName: string, min: number, max: number) => {
  return Yup.string()
    .required(`${fieldName} is required`)
    .test('min', `Minimum ${fieldName.toLowerCase()} is ${min}.`, value => parseInt(value, 10) >= min)
    .test('max', `Maximum ${fieldName.toLowerCase()} is ${max}.`, value => parseInt(value, 10) <= max);
};