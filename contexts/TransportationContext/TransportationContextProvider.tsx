import { useState, PropsWithChildren, useEffect } from 'react';

import { TransportationContext } from './TransportationContext';
import { useGetTransportationPatients } from '@/api/queries/transportation.queries';
import { useTableControls } from '@/hooks/useTableControls';
import { ApiTypes } from '@/types';
import { convertFilterToString } from '@/utils/filterUtils';

export const TransportationContextProvider = ({ children }: PropsWithChildren) => {
  const [transportationRequests, setTransportationRequests] = useState<null | ApiTypes.TransportationResponse>(null);

  const { filters, pagination, search } = useTableControls(transportationRequests, {
    BilledTo: '',
    BillingStatus: '',
    TransportationStatus: '',
    WitnessId: '',
  });

  const {
    data: transportationData,
    isLoading,
    mutate,
  } = useGetTransportationPatients({
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    q: search.searchTerm,
    filters: {
      Payer: convertFilterToString(filters.actualFilters.BilledTo),
      PaymentStatus: convertFilterToString(filters.actualFilters.BillingStatus),
      TransportationStatus: convertFilterToString(filters.actualFilters.TransportationStatus),
      WitnessId: convertFilterToString(filters.actualFilters.Witness),
    },
  });

  useEffect(() => {
    if (!isLoading && transportationData) {
      setTransportationRequests(transportationData);
    }
  }, [transportationData, isLoading]);

  return (
    <TransportationContext.Provider
      value={{
        filters,
        transportationRequests,
        search,
        pagination,
        mutate,
        isLoading,
      }}>
      {children}
    </TransportationContext.Provider>
  );
};
