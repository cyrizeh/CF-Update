import { ViewTypes } from '@/types';
import { createContext } from 'react';

export const SidebarContext = createContext<ViewTypes.SidebarContextProps>(undefined!);
