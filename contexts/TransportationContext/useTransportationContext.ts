import { useContext } from 'react';
import { TransportationContext } from './TransportationContext';

export const useTransportationContext = () => {
  const context = useContext(TransportationContext);

  if (typeof context === 'undefined') {
    throw new Error('useTransportationContext should be used within the TransportationContext provider!');
  }

  return context;
};
