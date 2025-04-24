import { useContext } from 'react';
import { SidebarContext } from './SidebarContext';
import { ViewTypes } from '@/types';

export const useSidebarContext = (): ViewTypes.SidebarContextProps => {
  const context = useContext(SidebarContext);

  if (typeof context === 'undefined') {
    throw new Error('useSidebarContext should be used within the SidebarContext provider!');
  }

  return context;
};
