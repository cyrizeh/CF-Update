import { useState, PropsWithChildren, useEffect } from 'react';
import { InventoryContext } from './InventoryContext';
import { useTableControls } from '@/hooks/useTableControls';
import { convertFilterToString } from '@/utils/filterUtils';
import { useGetCanes } from '@/api/queries/speciment.queries';
import { useRouter } from 'next/router';
import { useGetDevices } from '@/api/queries/speciment.queries';
import { CanesResponse, SpecimensResponse } from '@/types/api/Responses/SpecimensResponse.interface';

export const InventoryContextProvider = ({ children }: PropsWithChildren) => {
  const [specimensData, setSpecimensData] = useState<null | CanesResponse>(null);
  const [devicesData, setDevicesData] = useState<null | SpecimensResponse>(null);
  const router = useRouter();
  const patientId = router.query.id as string;

  const { filters, pagination, search } = useTableControls(
    specimensData,
    {
      patientId: '',
      rfId: '',
      specimenType: '',
      facilityId: '',
      vault: '',
      tank: '',
      pie: '',
      canister: '',
      cane: '',
      cycleNumber: '',
      idLabResult: '',
      allAneuploidEmbryoStatus: '',
      locationStatus: {
        labelBadge: 'At Location',
        keyBadge: 'AtLocation',
      },
    },
    10,
    true
  );

  const {
    data: devices,
    isLoading: isDevicesLoading,
    mutate: refetchDevices,
  } = useGetDevices({
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      PatientId: patientId ? patientId : convertFilterToString(filters.actualFilters.patientId),
      FacilityId: convertFilterToString(filters.actualFilters.facilityId),
      RfId: filters.actualFilters.rfId || '',
      SpecimenType: convertFilterToString(filters.actualFilters.specimenType) || '',
      EmbryoDonorId: convertFilterToString(filters.actualFilters.embryoDonor) || '',
      SpermDonorId: convertFilterToString(filters.actualFilters.spermDonor) || '',
      OocyteDonorId: convertFilterToString(filters.actualFilters.oocyteDonor) || '',
      ReceiptDate: filters.actualFilters.dateOfReceipt || '',
      FreezeDate: filters.actualFilters.freezeDate || '',
      Vault: filters.actualFilters.vault || '',
      Tank: filters.actualFilters.tank || '',
      Canister: filters.actualFilters.canister || '',
      Pie: filters.actualFilters.pie || '',
      Cane: filters.actualFilters.cane || '',
      Color: filters.actualFilters.color || '',
      PgtResults: filters.actualFilters.pgtResults || '',
      LocationStatus:
        convertFilterToString(filters.actualFilters.locationStatus) === 'All Statuses'
          ? ''
          : convertFilterToString(filters.actualFilters.locationStatus),
    },
  });

  const {
    data: specimens,
    isLoading,
    mutate: refetchCanes,
  } = useGetCanes({
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      PatientId: patientId ? patientId : convertFilterToString(filters.actualFilters.patientId),
      FacilityId: convertFilterToString(filters.actualFilters.facilityId),
      RfId: filters.actualFilters.rfId || '',
      SpecimenType: convertFilterToString(filters.actualFilters.specimenType) || '',
      Vault: filters.actualFilters.vault || '',
      Tank: filters.actualFilters.tank || '',
      Canister: filters.actualFilters.canister || '',
      Pie: filters.actualFilters.pie || '',
      Cane: filters.actualFilters.cane || '',
      CycleNumber: filters.actualFilters.cycleNumber || '',
      IdLabResult: convertFilterToString(filters.actualFilters.idLabResult) || '',
      DisposeAneuploidConsent: filters.actualFilters.disposeAneuploidConsent || '',
      AbandonedTissue: filters.actualFilters.abandonedTissue || '',
      KeepAneuploid: filters.actualFilters.keepAneuploid || '',
      AllAneuploidEmbryoStatus: convertFilterToString(filters.actualFilters.allAneuploidEmbryoStatus) || '',
      EmbryoDonor: filters.actualFilters.embryoDonor || '',
      SpermDonor: filters.actualFilters.spermDonor || '',
      OocyteDonor: filters.actualFilters.oocyteDonor || '',
      LocationStatus:
        convertFilterToString(filters.actualFilters.locationStatus) === 'All Statuses'
          ? ''
          : convertFilterToString(filters.actualFilters.locationStatus),
    },
  });

  useEffect(() => {
    if (!isLoading && specimens) {
      setSpecimensData(specimens);
    }
  }, [isLoading, specimensData]);

  useEffect(() => {
    if (!isLoading && devices) {
      setDevicesData(devices);
    }
  }, [isLoading, specimensData]);

  return (
    <InventoryContext.Provider
      value={{
        filters,
        specimensData,
        search,
        pagination,
        refetchCanes,
        isLoading,
        devicesData,
        refetchDevices,
        isDevicesLoading,
      }}>
      {children}
    </InventoryContext.Provider>
  );
};
