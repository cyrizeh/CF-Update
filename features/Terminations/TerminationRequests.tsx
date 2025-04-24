import { useEffect, useState } from 'react';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import FilterBadges from '@/components/Filters/FilterBadges';
import { HiSearch } from 'react-icons/hi';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import { terminationStatuses } from '@/constants/terminations';
import { useGetTerminationRequests } from '@/api/queries/termination.queries';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import classNames from 'classnames';
import _ from 'lodash';
import { useGetUsers } from '@/api/queries/user.queries';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import { TableLink } from '@/components/DataGrid/TableComponents';
import { ApiTypes } from '@/types';
import { buildAdminGeneralPatientPageRoute } from '@/constants/buildRoutes';
import { terminationStatusesFilter, tissueTypeListFilter } from '@/constants/filters';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';

const TerminationRequests = () => {
  const { data: usersData } = useGetUsers();
  const [terminations, setTerminations] = useState<ApiTypes.TerminationResponse>();

  const { filters, pagination, search, sort } = useTableControls(terminations, {
    patientId: '',
    status: '',
    specimenType: '',
    facilityId: '',
    clinicId: '',
  });
  const { data: terminationRequests, isLoading } = useGetTerminationRequests({
    id: usersData?.clinicId,
    q: search.searchTerm,
    sort: sort.dataSort,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      PatientId: convertFilterToString(filters.actualFilters.patientId || ''),
      ClinicId: convertFilterToString(filters.actualFilters.clinicId) || '',
      FacilityId: convertFilterToString(filters.actualFilters.facilityId) || '',
      Status: convertFilterToString(filters.actualFilters.status) || '',
      SpecimenType: convertFilterToString(filters.actualFilters.specimenType) || '',
    },
  });

  useEffect(() => {
    if (!isLoading && terminationRequests) {
      setTerminations(terminationRequests);
    }
  }, [isLoading, terminationRequests]);
  const patientsAutocomplete = useFilterAutocompleteOptions('/admin/patients', undefined, 'firstAndLast');
  const clinicsAutocomplete = useFilterAutocompleteOptions('/clinics');
  const facilitiesAutocomplete = useFilterAutocompleteOptions('/facilities');
  const filtersConfig = [
    {
      type: 'autocomplete',
      value: 'patientId',
      autocompleteData: patientsAutocomplete,
      placeholder: 'Patient',
    },
    {
      type: 'select',
      value: 'status',
      placeholder: 'Status',
      options: terminationStatusesFilter,
    },
    {
      type: 'select',
      value: 'specimenType',
      placeholder: 'Specimen Type',
      options: tissueTypeListFilter,
    },
    {
      type: 'autocomplete',
      value: 'clinicId',
      autocompleteData: clinicsAutocomplete,
      placeholder: 'Clinic',
    },
    {
      type: 'autocomplete',
      value: 'facilityId',
      autocompleteData: facilitiesAutocomplete,
      placeholder: 'Stored At',
    },
  ];

  const columns: ColDefType[] = [
    {
      headerName: 'Request',
      field: 'id',
      renderCell: row => (
        <Link href={`/admin/terminations/${row.id}`}>
          <div className="flex max-w-[205px] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <Button size={'sm'} gradientDuoTone="primary">
              <span>{`View details ${row.orderNumber || ''}`}</span>
            </Button>
          </div>
        </Link>
      ),
    },
    {
      headerName: 'Patient',
      field: 'patient',
      renderCell: row => (
        <div className="sensitive">
          <TableLink href={buildAdminGeneralPatientPageRoute(row.patient.id)} name={row.patient.fullName} />
        </div>
      ),
    },
    {
      headerName: 'Termination Status',
      field: 'terminationStatuses',
      renderCell: row => (
        <td className="min-w-[260px] ">
          <div
            className="mr-2 flex items-center gap-2 overflow-hidden whitespace-pre-wrap"
            style={{ maxHeight: '4rem', position: 'relative' }}>
            <div className="overflow-hidden overflow-ellipsis">
              {row.terminationStatuses
                ?.map((value: string) => terminationStatuses.find((status: any) => status.value === value)?.label)
                .join(', ')}
            </div>
          </div>
        </td>
      ),
      align: 'left',
    },
    {
      headerName: 'Creation date',
      field: 'created',
      renderCell: row => <span className="text-sm font-normal text-gray-300">{formatDataWithTime(row.created)}</span>,
    },
    {
      headerName: 'Stored at',
      field: 'facilityName',
      wrapText: true,
    },
    {
      headerName: 'Clinic',
      field: 'clinicName',
      wrapText: true,
    },
    {
      headerName: 'Specimen Type(s)',
      field: 'specimenType',
      renderCell: row =>
        getSpecimenLabels(row.specimenTerminations.map((termination: any) => termination.specimenType)),
      wrapText: true,
    },
  ];

  return (
    <>
      <div className="mb-12 flex flex-col gap-4 text-[40px] font-light leading-[60px] md:flex-row md:items-center">
        <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text pb-2 text-5xl text-transparent">
          Termination Requests
        </p>
      </div>

      <div
        className={classNames('grid w-full grid-cols-1 items-center justify-between md:flex', {
          'mb-4': filters.isFiltering,
          'mb-8': !filters.isFiltering,
        })}>
        <div className="mb-4 flex w-full  items-center justify-between md:mb-0">
          <div className="flex w-full items-center justify-between gap-4 md:mr-4 md:max-w-[500px]">
            <TextInput
              full
              adornments={{
                position: 'end',
                content: HiSearch,
              }}
              inputstyles="truncate md:min-w-[250px] sensitive"
              type="text"
              placeholder={'Search by patient name'}
              onChange={search.handleSearch}
            />
            <div className="h-5 border-r border-dark-grey-300 md:visible"></div>

            <FilterDropdown
              {...filters}
              isFiltering={filters.isFiltering}
              state={filters.tempFilters}
              filters={filtersConfig}
            />
          </div>
        </div>
      </div>

      {filters.isFiltering && (
        <div className="mb-2">
          <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filtersConfig} />
        </div>
      )}

      <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
        <DataGridTable
          columns={columns}
          rows={terminations?.items || []}
          isLoading={isLoading}
          sortBy={sort.dataSort}
          changeSort={sort.changeSort}
        />

        {terminations?.items.length ? <Pagination {...pagination} /> : null}
      </div>
    </>
  );
};

export default TerminationRequests;
