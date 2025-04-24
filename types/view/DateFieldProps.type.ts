import { FieldError } from 'react-hook-form';

export type DateFieldProps = {
  error: FieldError | undefined;
  control: any;
  name: string;
  placeholder: string;
  setError: any;
  clearErrors: any;
  isDisabled?: boolean;
  value?: any;
  minDate?: any;
  maxDate?: any;
  onChange?: any;
  dataTestId?: string;
};
