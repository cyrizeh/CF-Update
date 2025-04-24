import { useContext } from 'react';
import { SigningContext } from './SigningContext';
import { ViewTypes } from '@/types';

export const useSigningContext = (): ViewTypes.SigningContextProps => {
  const context = useContext(SigningContext);

  if (typeof context === 'undefined') {
    throw new Error('useSigningContext should be used within the useSigningContext provider!');
  }

  return context;
};
