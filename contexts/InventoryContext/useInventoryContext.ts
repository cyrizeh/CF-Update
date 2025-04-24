import { useContext } from 'react';
import { InventoryContext } from './InventoryContext';

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);

  if (typeof context === 'undefined') {
    throw new Error('useInventoryContext should be used within the InventoryContext provider!');
  }

  return context;
};
