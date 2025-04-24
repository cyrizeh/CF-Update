import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import FilterBadges from '@/components/Filters/FilterBadges';
import { IdLabType, TissueType } from '@/constants/patients';
import { HiPlus, HiSearch } from 'react-icons/hi';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';

import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import classNames from 'classnames';
import _ from 'lodash';
import { useGetClinicSpecimens } from '@/api/queries/clinic.queries';
import { useGetUsers } from '@/api/queries/user.queries';
import { useGetClinicById } from '@/api/queries/clinic.queries';
import { buildClinicAdminCaneDetailsPageRoute } from '@/constants/buildRoutes';
import { Button } from 'flowbite-react';
import useToggleModal from '@/hooks/useToggleModal';
import AddTransferModal from './AddTransferModal';
import useTransfersMutation from '@/api/mutations/useTransfersMutation';
import { formatDate } from '@/utils/formatDate';
import { toast } from 'react-toastify';
import { hasPermission } from '@/utils';
import { editDateSchema } from '@/validations/transportation';
import { locationStatuses } from '@/constants/specimens';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toPascalCase } from '@/utils/toPascalCase';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const ClinicsSpecimens = () => {
  const { t } = useTranslation('specimens');
  const { data: usersData } = useGetUsers();
  const [specimens, setSpecimens] = useState<any>(null);
  const [rowSelectionModel, setRowSelectionModel] = useState<Array<string>>([]);
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const { transfersToClinic } = useTransfersMutation();
  const { data: clinic } = useGetClinicById(usersData?.clinicId as string);

  const { userPermissions } = usePermissions();
  const isUserCanReadTransfers = hasPermission(userPermissions, 'read:transfer');

  const { filters, pagination, search } = useTableControls(specimens, {
    tissue: '',
    idLabResult: '',
  });

  const { data: specimensData, isLoading } = useGetClinicSpecimens({
    id: usersData?.clinicId,
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      SpecimenType: filters.actualFilters.tissue,
      FreezeDate: filters.actualFilters.freezeDate,
      IdLabResult: filters.actualFilters.idLabResult,
      Status: filters.actualFilters.status,
    },
  });

  useEffect(() => {
    if (!isLoading && specimensData) {
      setSpecimens({
        ...specimensData,
        items: specimensData.items.map(item => ({
          ...item,
          id: item.caneId,
          processed: item.locationStatus !== 'AtLocation',
        })),
      });
    }
  }, [isLoading, specimensData]);

  const filtersConfig = [
    { type: 'select', value: 'tissue', placeholder: 'Specimen Type', options: TissueType },
    { type: 'select', value: 'idLabResult', placeholder: 'ID Lab type', options: IdLabType },
  ];

  const onConfirm = (data: any) => {
    const transfersDate = data?.date ? formatDate(new Date(data?.date)) : '';
    const transfers = {
      caneIds: rowSelectionModel,
      shipmentDate: transfersDate,
      clinicId: clinic?.id,
    };

    transfersToClinic(transfers)
      .then(() => {
        toast.success('Transfer request created successfully');
        onCloseModal();
      })
      .catch((reason: any) => {
        if (reason?.response?.data) {
          handleBackendErrors(reason.response.data.errors);
        }
      });
    setRowSelectionModel([]);
  };

  const onSelectRow = (id: string) => {
    const copied = [...rowSelectionModel];

    if (rowSelectionModel.includes(id)) {
      var index = copied.indexOf(id);
      if (index >= 0) copied.splice(index, 1);
      setRowSelectionModel(copied);
    } else setRowSelectionModel([...copied, id]);
  };

  const onSelectAll = () => {
    const copied = [...rowSelectionModel];
    const copiedData = [...specimens].filter(item => !item.processed).map(el => el.id);

    if (_.isEmpty(rowSelectionModel) || rowSelectionModel.length !== copiedData.length) {
      setRowSelectionModel(_.union(copied, copiedData));
    } else {
      setRowSelectionModel([]);
    }
  };

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
          <TableLink href={buildClinicAdminCaneDetailsPageRoute(row.caneId)} name={row.rfid || 'View Cane'} />
        ) : (
          <p>{row.rfid}</p>
        ),
    },
    {
      headerName: t('table.locationStatus'),
      field: 'locationStatus',
      renderCell: row => <p>{locationStatuses.find((item: any) => item.value === row.locationStatus)?.label}</p>,
    },
    { headerName: t('table.specimen'), field: 'specimen' },
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
      <div className="mb-12 flex flex-col gap-4 text-[40px] font-light leading-[60px] md:flex-row md:items-center">
        <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text pb-2 text-5xl text-transparent">
          {clinic?.name}
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
          {isUserCanReadTransfers && (
            <Button
              onClick={onOpenModal}
              className="border-0"
              size="sm"
              gradientDuoTone="primary"
              disabled={!rowSelectionModel.length}>
              <HiPlus className="mr-2 text-lg" />
              {t('addTransfers')}
            </Button>
          )}
        </div>
      </div>

      {filters.isFiltering && (
        <div className="mb-2">
          <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filtersConfig} />
        </div>
      )}

      <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
        <DataGridTable
          checkboxSelection
          checkedIds={rowSelectionModel}
          onCheck={onSelectRow}
          onCheckAll={onSelectAll}
          columns={columns}
          rows={specimens?.items || []}
          isLoading={isLoading}
        />

        {/* <CustomTable tableConfig={tableConfig} data={specimens?.items || []} /> */}

        {specimens?.items.length ? <Pagination {...pagination} /> : null}
      </div>
      <AddTransferModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onConfirm={onConfirm}
        validationSchema={editDateSchema}
        title={'Transfer request'}
        message={`Please choose the transfer date for the ${rowSelectionModel.length} ${
          rowSelectionModel.length !== 1 ? 'selected inventories' : 'selected inventory.'
        }`}
      />
    </>
  );
};

export default ClinicsSpecimens;
