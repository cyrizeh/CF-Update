import { ReactNode } from 'react';

export interface BadgeProps {
  textColor: string;
  children: ReactNode;
  endIcon?: ReactNode;
}
