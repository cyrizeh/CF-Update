import { TableData } from '@/components/DataGrid/TableComponents';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { transferInStatuses } from '@/constants/transfers';
import { useTableControls } from '@/hooks/useTableControls';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';

import { useGetClinicById } from '@/api/queries/clinic.queries';
import { useGetToClinic } from '@/api/queries/transfers.queries';
import { useGetUsers } from '@/api/queries/user.queries';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { transferInStatusesFilter } from '@/constants/filters';
import { TransferResponse } from '@/types/api';
import classNames from 'classnames';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';

const TransferIn = () => {
  const { t } = useTranslation('transfers');
  const { data: usersData } = useGetUsers();
  const [specimens, setSpecimens] = useState<TransferResponse | null>(null);
  const { data: clinic } = useGetClinicById(usersData?.clinicId as string);

  const { filters, pagination, search, sort } = useTableControls(specimens, {
    clinicId: '',
    clinicTransferStatus: '',
  });

  const { data: specimensData, isLoading } = useGetToClinic({
    id: usersData?.clinicId,
    q: search.searchTerm,
    sort: sort.dataSort,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      ClinicId: convertFilterToString(filters.actualFilters.clinicId),
      ClinicTransferStatus: convertFilterToString(filters.actualFilters.clinicTransferStatus),
    },
  });

  useEffect(() => {
    if (!isLoading && specimensData) {
      setSpecimens(specimensData);
    }
  }, [isLoading, specimensData]);
  const clinicsAutocomplete = useFilterAutocompleteOptions('/clinics');
  const filtersConfig = [
    {
      type: 'autocomplete',
      value: 'clinicId',
      autocompleteData: clinicsAutocomplete,
      placeholder: 'Receiving Clinic',
    },
    {
      type: 'select',
      value: 'clinicTransferStatus',
      placeholder: 'Transfer Status',
      options: transferInStatusesFilter,
    },
  ];

  const columns: ColDefType[] = [
    {
      headerName: t('table.order'),
      field: 'order',
      renderCell: row => (
        <Link href={`/admin/transfer-in/${row.id}`}>
          <div className="flex max-w-[205px] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <Button size={'sm'} gradientDuoTone="primary">
              <span>{`View details ${row.orderNumber || ''}`}</span>
            </Button>
          </div>
        </Link>
      ),
    },
    {
      headerName: t('table.status'),
      field: 'status',
      renderCell: row => transferInStatuses.find(el => el.value === row.clinicTransferStatus)?.label,
    },
    {
      headerName: t('table.creationDate'),
      sortable: true,
      field: 'created',
      renderCell: row => <TableData date={row?.created} />,
    },
    {
      headerName: t('table.receivingClinic'),
      field: 'clinicName',
      wrapText: true,
    },
    { headerName: t('table.createdBy'), field: 'createdBy' },
    {
      headerName: t('table.numberOfCanes'),
      field: 'caneIds',
      renderCell: row => <p>{row.numberOfCanes}</p>,
    },
    {
      headerName: t('table.shipmentDate'),
      sortable: true,
      field: 'shipmentDate',
      renderCell: row => <TableData date={row.shipmentDate} />,
    },
  ];

  return (
    <>
      <div className="mb-12 flex flex-col gap-4 text-[40px] font-light leading-[60px] md:flex-row md:items-center">
        <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text pb-2 text-5xl text-transparent">
          {clinic?.name ? clinic?.name : t('transferIn')}
        </p>
      </div>
      {clinic?.name && (
        <p className="mb-8 w-[420px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light text-transparent">
          {t('transferIn')}
        </p>
      )}

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
              inputstyles="truncate md:min-w-[250px]"
              type="text"
              placeholder={'Search by clinic name'}
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
          rows={specimens?.items || []}
          isLoading={isLoading}
          sortBy={sort.dataSort}
          changeSort={sort.changeSort}
        />

        {specimens?.items.length ? <Pagination {...pagination} /> : null}
      </div>
    </>
  );
};

export default TransferIn;
