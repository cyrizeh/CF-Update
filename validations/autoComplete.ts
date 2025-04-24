import * as Yup from 'yup';
export const autoCompleteValidation = (message: string, isAutoCompleteRequired = true) => {
  return Yup.mixed().test('clinic-check', `${message}`, value => {
    // by default autoComplete set value a string type
    // if field id required value cannot be a string type, only object
    if (typeof value === 'string') return !isAutoCompleteRequired;
    // check id if user entered data
    return Yup.object({
      name: isAutoCompleteRequired ? Yup.string().required() : Yup.string().notRequired(),
      id: Yup.string().when('name', {
        is: (value: any) => !!value,
        then: schema => schema.required(),
        otherwise: schema => schema.notRequired(),
      }),
    }).isValidSync(value);
  });
};
