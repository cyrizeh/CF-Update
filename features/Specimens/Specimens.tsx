import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import FilterBadges from '@/components/Filters/FilterBadges';
import { IdLabType, TissueType } from '@/constants/patients';
import { HiSearch } from 'react-icons/hi';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { useGetSpecimens } from '@/api/queries/speciment.queries';
import { SpecimensResponse } from '@/types/api';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';

import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import classNames from 'classnames';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import { buildAdminCaneDetailsPageRoute, buildAdminGeneralPatientPageRoute } from '@/constants/buildRoutes';
import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import { toPascalCase } from '@/utils/toPascalCase';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';

const Specimens = () => {
  const { t } = useTranslation('specimens');

  const [specimens, setSpecimens] = useState<null | SpecimensResponse>(null);
  const [openAlert, toggleAlert] = useState(false);
  const [activeId, setActiveId] = useState('');

  const { filters, pagination, search } = useTableControls(specimens, {
    tissue: '',
    idLabResult: '',
  });

  const {
    data: specimensData,
    isLoading,
    mutate,
  } = useGetSpecimens({
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      SpecimenType: filters.actualFilters.tissue,
      FreezeDate: filters.actualFilters.freezeDate || '',
      IdLabResult: filters.actualFilters.idLabResult,
    },
  });

  const { deleteDevice } = useInventoryMutation();

  useEffect(() => {
    if (!isLoading && specimensData) {
      setSpecimens(specimensData);
    }
  }, [isLoading, specimensData]);

  const filtersConfig = [
    { type: 'select', value: 'tissue', placeholder: 'Tissue Type', options: TissueType },
    { type: 'select', value: 'idLabResult', placeholder: 'ID Lab type', options: IdLabType },
  ];

  const columns: ColDefType[] = [
    {
      headerName: t('table.patient'),
      field: 'patient.id',
      renderCell: row =>
        row.patient.id ? (
          <TableLink
            href={buildAdminGeneralPatientPageRoute(row.patient.id)}
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
          <TableLink href={buildAdminCaneDetailsPageRoute(row.caneId)} name={row.rfid || 'View Cane'} />
        ) : (
          <p>{row.rfid}</p>
        ),
    },
    { headerName: t('table.specimen'), field: 'tissueType' },
    {
      headerName: t('table.facility'),
      field: 'facilityId',
      renderCell: row =>
        row.facilityId ? (
          <TableLink href={`/admin/facilities/${row.facilityId}`} name={row.facilityName} />
        ) : (
          <p>{row.facilityName}</p>
        ),
    },
    { headerName: t('table.vault'), field: 'vault' },
    { headerName: t('table.Tank'), field: 'tank' },
    { headerName: t('table.Canister'), field: 'canister' },
    { headerName: t('table.Pie'), field: 'pie' },
    { headerName: t('table.Cane'), field: 'cane' },
    { headerName: t('table.cane_description'), field: 'caneDescription' },
    {
      field: 'action',
      headerName: 'Action',
      align: 'center',
      renderCell: row => <MdDelete className="cursor-pointer" onClick={() => onOpenAlert(row.id)} />,
    },
  ];

  const onOpenAlert = (id: string) => {
    setActiveId(id);
    toggleAlert(true);
  };

  const onCloseAlert = () => {
    toggleAlert(false);
    setActiveId('');
  };

  const onDeleteDevice = () => {
    deleteDevice
      .trigger({ id: activeId })
      .then(() => {
        // @ts-ignore
        mutate(undefined, { revalidate: true });
      })
      .catch(reason => {
        if (reason?.response?.data) {
          if (
            _.isArray(reason.response.data?.errors?.FacilityId) &&
            reason.response.data?.errors?.FacilityId.length > 1
          ) {
            reason.response.data?.errors?.FacilityId.forEach((el: any) => toast.error(el));
          } else {
            toast.error(reason.response.data?.errors?.FacilityId[0]);
          }
        }
      })
      .finally(() => {
        onCloseAlert();
      });
  };

  return (
    <>
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseAlert}
        onConfirm={onDeleteDevice}
        isLoading={deleteDevice.isMutating}
        title={t('common:delete')}
        message={t('common:deleteConfirmation')}
      />
      <h1 className="mb-4 h-14 w-64 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
        {t('title')}
      </h1>

      {/* <div className="my-7 flex w-full flex-wrap items-center justify-between md:my-8">
         <div className="flex w-full flex-wrap items-center justify-end gap-4">
          <Button color={'outlineOne'} size="sm" className="grow md:grow-0">
            <HiArrowUpTray className="mr-2 text-lg" /> Export
          </Button>
        </div> 
      </div> */}

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

export default Specimens;
