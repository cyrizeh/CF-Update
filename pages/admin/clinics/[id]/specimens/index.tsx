import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ClinicPageLayout } from '../index';

import { DataTableMobile } from '@/features/Specimens/SpecimensTableMobile';

import { useScreenWidth } from '@/hooks';

import { useGetClinicSpecimens } from '@/api/queries/clinic.queries';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import { SpecimensResponse } from '@/types/api';
import useTranslation from 'next-translate/useTranslation';
import { HiSearch } from 'react-icons/hi';
import { IdLabTypeFilter, tissueTypeListFilter } from '@/constants/filters';
import { convertFilterToString } from '@/utils/filterUtils';
import { toPascalCase } from '@/utils/toPascalCase';
function ClinicSpecimens() {
  const { t } = useTranslation('specimens');
  const router = useRouter();
  const { isSmallScreen } = useScreenWidth();
  const [specimens, setSpecimens] = useState<null | SpecimensResponse>(null);

  const { filters, pagination, search } = useTableControls(specimens, {
    tissue: '',
    freezeDate: '',
    idLabResult: '',
  });

  const { data: specimensData, isLoading } = useGetClinicSpecimens({
    id: router.query.id as string,
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      SpecimenType: convertFilterToString(filters.actualFilters.tissue),
      FreezeDate: convertFilterToString(filters.actualFilters.freezeDate),
      IdLabResult: filters.actualFilters.idLabResult,
    },
  });

  useEffect(() => {
    if (!isLoading && specimensData) {
      setSpecimens(specimensData);
    }
  }, [isLoading, specimensData]);

  const filtersConfig = [
    { type: 'select', value: 'tissue', placeholder: 'Tissue Type', options: tissueTypeListFilter },
    { type: 'select', value: 'idLabResult', placeholder: 'ID Lab type', options: IdLabTypeFilter },
    { type: 'date', value: 'freezeDate' },
  ];

  const columns: ColDefType[] = [
    {
      headerName: t('table.patient'),
      field: 'patient.id',
      renderCell: row => <p className="sensitive">{toPascalCase(row.patient.firstAndLast)}</p>,
    },
    {
      headerName: t('table.RFID'),
      field: 'rfid',
    },
    { headerName: t('table.specimen'), field: 'specimenType' },
    {
      headerName: t('table.facility'),
      field: 'facilityId',
      renderCell: row => <div>{row.facilityName}</div>,
    },
    { headerName: t('table.Cane'), field: 'cane' },
    { headerName: t('table.cane_description'), field: 'caneDescription' },
  ];

  return (
    <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
      <div className="table-header mb-4 flex flex-wrap items-center md:mb-4">
        <div className="mr-0 flex w-full items-center gap-4 md:mr-4 md:basis-2/5">
          <TextInput
            full
            adornments={{
              position: 'end',
              content: HiSearch,
            }}
            inputstyles="truncate ... md:min-w-[250px] sensitive"
            type="text"
            placeholder={'Search specimens'}
            onChange={search.handleSearch}
          />
          <div className="h-5 border-r border-dark-grey-300 md:visible"></div>

          <div className="flex">
            <FilterDropdown
              {...filters}
              isFiltering={filters.isFiltering}
              state={filters.tempFilters}
              filters={filtersConfig}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        {filters.isFiltering && (
          <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filtersConfig} />
        )}
      </div>

      {!isSmallScreen && <DataGridTable columns={columns} rows={specimens?.items || []} isLoading={isLoading} />}

      {isSmallScreen && <DataTableMobile items={specimens?.items || []} />}

      {specimens?.items.length ? <Pagination {...pagination} /> : null}
    </div>
  );
}

ClinicSpecimens.getLayout = ClinicPageLayout;

export default ClinicSpecimens;
