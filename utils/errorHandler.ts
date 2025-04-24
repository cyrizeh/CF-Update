import { toast } from 'react-toastify';
import { toCamelCase } from './toCamelCase';

export const errorHandler = (error: any, setError: any, field: string) => {
  const errorList = error?.response?.data?.errors;
  const generalError = error?.response?.data?.detail;

  if (generalError) {
    setError({
      field: `${field}.`,
      error: {
        type: 'general',
        message: generalError,
      },
    });
  }

  if (errorList) {
    // @ts-ignore
    const convertedErrors = Object.entries(errorList).map(el => ({ field: toCamelCase(el[0]), message: el[1][0] }));
    convertedErrors.forEach(el => {
      setError({
        field: `${field}.` + el.field,
        error: {
          type: 'custom',
          message: el.message,
        },
      });
      toast.error(el.message);
    });
  }
};
