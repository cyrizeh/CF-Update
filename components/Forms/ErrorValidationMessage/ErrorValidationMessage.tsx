import { joinValues } from '@/utils/joinValues';
import { CSSProperties, ReactNode } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

type ErrorValidationMessageProps = {
  message?: string | string[] | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  touched: boolean | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  children?: ReactNode;
  style?: {
    container?: CSSProperties;
    label?: CSSProperties;
  };
};

const ErrorValidationMessage = ({ message, touched, children, style }: ErrorValidationMessageProps) => {
  const errorMessage = joinValues([Array.isArray(message) ? message : [message]], ' ');
  const invalid = Boolean(message && touched);

  return (
    <div style={style?.container}>
      {children}
      {invalid && errorMessage && (
        <p className="h-6 py-1 text-xs text-red-400" style={style?.label}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export { ErrorValidationMessage };
