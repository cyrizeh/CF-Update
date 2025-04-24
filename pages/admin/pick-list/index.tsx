import { useGetPickList } from '@/api/queries/pickList.queries';
import PickListPage from '@/features/PickList/PickListPage';
import { useTableControls } from '@/hooks/useTableControls';
import { ApiTypes } from '@/types';
import {
  convertFilterToString,
  convertFilterToTrimmedFilter,
  convertFilterToTrimmedLabelString,
} from '@/utils/filterUtils';
import { useEffect, useState } from 'react';

export default function AdminPickListPage() {
  const [pickList, setPickList] = useState<null | ApiTypes.TransportationResponse>(null);
  const tableControls = useTableControls(pickList, {
    PatientId: '',
    Status: '',
    ScheduledDate: '',
    Created: '',
  });

  const { filters, pagination, search } = tableControls;

  const {
    data: transportationData,
    isLoading,
    mutate: refetchData,
  } = useGetPickList({
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    q: search.searchTerm,
    filters: {
      ClinicId: convertFilterToString(filters.actualFilters.ClinicId),
      AssignedToEmail: convertFilterToTrimmedLabelString(filters.actualFilters.AssignedToEmail),
      Status: convertFilterToTrimmedFilter(filters.actualFilters.Status),
      ScheduledDate: filters.actualFilters.ScheduledDate,
      Created: filters.actualFilters.Created,
      Type: convertFilterToTrimmedFilter(filters.actualFilters.Type),
    },
  });

  useEffect(() => {
    if (!isLoading && transportationData) {
      setPickList(transportationData);
    }
  }, [transportationData, isLoading]);
  return (
    <PickListPage pickList={pickList} tableControls={tableControls} isLoading={isLoading} refetchData={refetchData} />
  );
}
