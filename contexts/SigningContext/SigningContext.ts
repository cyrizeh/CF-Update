import { ViewTypes } from '@/types';
import { createContext } from 'react';

export const SigningContext  = createContext<ViewTypes.SigningContextProps>(undefined!);
