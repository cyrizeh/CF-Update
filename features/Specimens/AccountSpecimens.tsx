import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import FilterBadges from '@/components/Filters/FilterBadges';
import { IdLabType, TissueType } from '@/constants/patients';
import { HiSearch } from 'react-icons/hi';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { SpecimensResponse } from '@/types/api';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';

import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import classNames from 'classnames';
import _ from 'lodash';
import { useGetSpecimensByAccountId } from '@/api/queries/account.queries';
import { useGetUsers } from '@/api/queries/user.queries';
import { useGetAccountById } from '@/api/queries/account.queries';
import { buildNetworkAdminCaneDetailsPageRoute } from '@/constants/buildRoutes';
import { toPascalCase } from '@/utils/toPascalCase';

const AccountSpecimens = () => {
  const { t } = useTranslation('specimens');
  const { data: usersData } = useGetUsers();
  const [specimens, setSpecimens] = useState<null | SpecimensResponse>(null);

  const { data: account } = useGetAccountById(usersData?.accountId as string);

  const { filters, pagination, search } = useTableControls(specimens, {
    tissue: '',
    idLabResult: '',
  });

  const { data: specimensData, isLoading } = useGetSpecimensByAccountId({
    id: usersData?.accountId,
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      SpecimenType: filters.actualFilters.tissue,
      FreezeDate: filters.actualFilters.freezeDate,
      IdLabResult: filters.actualFilters.idLabResult,
    },
  });

  useEffect(() => {
    if (!isLoading && specimensData) {
      setSpecimens(specimensData);
    }
  }, [isLoading, specimensData]);

  const filtersConfig = [
    { type: 'select', value: 'tissue', placeholder: 'Specimen Type', options: TissueType },
    { type: 'select', value: 'idLabResult', placeholder: 'ID Lab type', options: IdLabType },
  ];

  const columns: ColDefType[] = [
    {
      headerName: t('table.patient'),
      field: 'patient.id',
      renderCell: row =>
        row.patient.id ? (
          <TableLink
            href={`/clinic/patients/${row.patient.id}`}
            name={toPascalCase(row.patient.firstAndLast)}
            styles={{ name: 'sensitive' }}
          />
        ) : (
          <p className="sensitive">{toPascalCase(row.patient.firstAndLast)}</p>
        ),
    },
    {
      headerName: t('table.RFID'),
      field: 'rfid',
      renderCell: row =>
        row.caneId ? (
          <TableLink href={buildNetworkAdminCaneDetailsPageRoute(row.caneId)} name={row.rfid || 'View Cane'} />
        ) : (
          <p>{row.rfid}</p>
        ),
    },
    { headerName: t('table.specimen'), field: 'tissueType' },
    {
      headerName: t('table.facility'),
      field: 'facilityId',
      renderCell: row => <div>{row.facilityName}</div>,
    },
    { headerName: t('table.Cane'), field: 'cane' },
    { headerName: t('table.cane_description'), field: 'caneDescription' },
  ];

  return (
    <>
      <div className="mb-0 flex  flex-col gap-4 text-[40px] font-light leading-[60px] md:mb-4 md:flex-row md:items-center">
        <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text pb-2 text-5xl text-transparent md:h-14">
          {account?.name}
        </p>
      </div>
      <p className="mb-8 w-48 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light text-transparent">
        {t('title')}
      </p>

      <div
        className={classNames('grid w-full grid-cols-1 items-center justify-between md:flex', {
          'mb-4': filters.isFiltering,
          'mb-8': !filters.isFiltering,
        })}>
        <div className="mb-4 w-full md:mb-0">
          <div className="flex w-full items-center justify-between gap-4 md:mr-4 md:max-w-[500px]">
            <TextInput
              full
              adornments={{
                position: 'end',
                content: HiSearch,
              }}
              inputstyles="truncate md:min-w-[250px] sensitive"
              type="text"
              placeholder={'Search by patient name, RFID'}
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
        <DataGridTable columns={columns} rows={specimens?.items || []} isLoading={isLoading} />

        {/* <CustomTable tableConfig={tableConfig} data={specimens?.items || []} /> */}

        {specimens?.items.length ? <Pagination {...pagination} /> : null}
      </div>
    </>
  );
};

export default AccountSpecimens;
