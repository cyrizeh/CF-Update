import { IconType } from 'react-icons';

export type Alert = {
  variant: string; 
  icon: IconType;
  message?: string;
  onDismiss: () => void;
  children?: React.ReactNode;
};