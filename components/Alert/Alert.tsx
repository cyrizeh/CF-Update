import { Alert as AlertFlowbite } from 'flowbite-react';
import { ViewTypes } from '@/types';

export const Alert = ({ variant, icon, message, onDismiss, children }: ViewTypes.Alert) => {
  return (
    <AlertFlowbite color={variant} icon={icon} onDismiss={onDismiss}>
      {message && (
        <span>
          <p>{message}</p>
        </span>
      )}
      {children}
    </AlertFlowbite>
  );
};
