import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import { useGetClinicDevices } from '@/api/queries/speciment.queries';
import { useGetUsers } from '@/api/queries/user.queries';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { buildClinicAdminCaneDetailsPageRoute, buildClinicPatientProfilePageRoute } from '@/constants/buildRoutes';
import {
  fdaEligibilityTypesFilter,
  locationStatusesFilter,
  ReactiveTypeListFilter,
  tissueTypeListFilter,
} from '@/constants/filters';
import { consentList, LocationStatusTitle } from '@/constants/specimens';
import { useTableControls } from '@/hooks/useTableControls';
import useToggleModal from '@/hooks/useToggleModal';
import { SpecimensResponse } from '@/types/api';
import { Filter } from '@/types/view/Filters.type';
import { conditionComponent } from '@/utils/conditionComponent';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { formatDate } from '@/utils/formatDate';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toPascalCase } from '@/utils/toPascalCase';
import { updateCaneStatusSchema } from '@/validations/transportation';
import classNames from 'classnames';
import { Button } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { HiCheck, HiSearch } from 'react-icons/hi';
import { toast } from 'react-toastify';
import ProcessCanesModal from '../ProcessCanesModal';

const Devices = ({ withTransfers = true, patientIdProps }: { patientIdProps?: string; withTransfers?: boolean }) => {
  const { t } = useTranslation('specimens');
  const [rowSelectionModel, setRowSelectionModel] = useState<Array<string>>([]);
  const [specimens, setSpecimens] = useState<null | SpecimensResponse>(null);
  const { data: usersData } = useGetUsers();
  const { disposeDevices } = useInventoryMutation();
  const {
    isModalOpen: isProcessModalOpen,
    onCloseModal: onCloseProcessModal,
    onOpenModal: onOpenProcessModal,
  } = useToggleModal();

  const { filters, pagination, search } = useTableControls(specimens, {
    patientId: '',
    rfId: '',
    specimenType: '',
    dateOfReceipt: '',
    freezeDate: '',
    tank: '',
    pie: '',
    canister: '',
    cane: '',
    color: '',
    pgtResults: '',
  });

  const [selectedItemsByPage, setSelectedItemsByPage] = useState<{ [key: number]: Array<string> }>({});
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);

  const {
    data: specimensData,
    isLoading,
    mutate: refetchDevices,
  } = useGetClinicDevices({
    id: usersData?.clinicId,
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      PatientId: patientIdProps ? patientIdProps : convertFilterToString(filters.actualFilters.patientId),
      RfId: filters.actualFilters.rfId || '',
      FreezeDate: filters.actualFilters.freezeDate || '',
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
      FdaEligibility: convertFilterToString(filters.actualFilters.fdaEligibility) || '',
      ReactiveStatus: convertFilterToString(filters.actualFilters.reactiveStatus) || '',
      Reactivity: filters.actualFilters.reactivity || '',
      DonorOocyte: filters.actualFilters.donorOocyte || '',
      DonorSperm: filters.actualFilters.donorSperm || '',
      ReceiptDate: filters.actualFilters.receiptDate || '',
      SpecimenType: convertFilterToString(filters.actualFilters.specimenType) || '',
    },
  });
  const patientsAutocomplete = useFilterAutocompleteOptions(
    `/Clinics/${usersData?.clinicId}/patients`,
    undefined,
    'firstAndLast'
  );

  useEffect(() => {
    if (!isLoading && specimensData) {
      setSpecimens({
        ...specimensData,
        items: specimensData?.items?.map((item: any) => {
          return {
            ...item,
            processed:
              (item.locationStatus === 'Thawed' ||
                item.locationStatus === 'Discarded' ||
                item.locationStatus === 'Donated' ||
                item.locationStatus === 'PickedUp') &&
              withTransfers,
          };
        }),
      });
    }
  }, [isLoading, specimensData]);

  const filtersConfig: Array<Filter & { show: boolean }> = [
    {
      type: 'autocomplete',
      value: 'patientId',
      autocompleteData: patientsAutocomplete,
      placeholder: 'Patient',

      show: !patientIdProps, // Show only if patientIdProps does not exist
    },
    {
      type: 'text',
      value: 'rfId',
      placeholder: 'RfId',
      show: true,
    },
    {
      type: 'select',
      value: 'specimenType',
      placeholder: 'Specimen Type',
      options: tissueTypeListFilter,
      show: true,
    },
    {
      type: 'date',
      value: 'receiptDate',
      placeholder: 'Receipt Date',
      label: 'Receipt Date',
      show: true,
    },
    {
      type: 'text',
      value: 'tank',
      placeholder: 'Tank',
      show: true,
    },
    {
      type: 'text',
      value: 'canister',
      placeholder: 'Canister',
      show: true,
    },
    {
      type: 'text',
      value: 'pie',
      placeholder: 'Pie',
      show: true,
    },
    {
      type: 'text',
      value: 'cane',
      placeholder: 'Slot',
      show: true,
    },
    {
      type: 'text',
      value: 'color',
      placeholder: 'Straw Color',
      show: true,
    },
    {
      type: 'date',
      value: 'freezeDate',
      placeholder: 'Freeze Date',
      label: 'Freeze Date',
      show: true,
    },
    {
      type: 'date',
      value: 'receiptDate',
      placeholder: 'Receipt Date',
      label: 'Receipt Date',
      show: true,
    },
    {
      type: 'select',
      value: 'fdaEligibility',
      placeholder: 'FDA Eligibility',
      options: fdaEligibilityTypesFilter,
      show: true,
    },
    {
      type: 'select',
      value: 'reactivity',
      placeholder: 'Reactivity',
      options: consentList,
      show: true,
    },
    {
      type: 'select',
      value: 'reactiveStatus',
      placeholder: 'Reactive Status',
      options: ReactiveTypeListFilter,
      show: true,
    },
    {
      type: 'select',
      value: 'donorSperm',
      placeholder: 'Donor Sperm',
      options: consentList,
      show: true,
    },
    {
      type: 'select',
      value: 'donorOocyte',
      placeholder: 'Donor Oocyte',
      options: consentList,
      show: true,
    },
    {
      type: 'select',
      value: 'locationStatus',
      placeholder: 'Status',
      options: locationStatusesFilter,
      show: true,
    },
  ].filter(filter => filter.show);

  const columns: ColDefType[] = [
    {
      headerName: t('table.patient'),
      field: 'patient.id',
      renderCell: row =>
        row.patient.id && !patientIdProps ? (
          <TableLink
            href={buildClinicPatientProfilePageRoute(row.patient.id)}
            name={toPascalCase(row.patient.firstAndLast)}
            styles={{ name: 'sensitive' }}
          />
        ) : (
          <p className="sensitive">{toPascalCase(row.patient.firstAndLast)}</p>
        ),
    },
    {
      headerName: t('table.patientDOB'),
      field: 'patient.dateOfBirth',
      renderCell: row => (row?.patient?.dateOfBirth ? formatDateWithSlashSeparator(row?.patient?.dateOfBirth) : '-'),
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
      renderCell: row => <p>{LocationStatusTitle[row.locationStatus]}</p>,
    },
    {
      headerName: t('specimenTable.strawNumber'),
      field: 'numberDescription',
      wrapText: true,
    },
    { headerName: t('table.Tank'), field: 'tank' },
    { headerName: t('table.Pie'), field: 'pie' },
    { headerName: t('table.Canister'), field: 'canister' },
    { headerName: t('table.CaneNum'), field: 'cane' },
    { headerName: t('table.canetabLabel'), field: 'caneLabel', wrapText: true },
    {
      headerName: t('table.canetabColor'),
      field: 'caneDescription',
      wrapText: true,
    },
    {
      headerName: t('table.receiptDate'),
      field: 'receiptDate',
      renderCell: row => (row?.receiptDate ? formatDateWithSlashSeparator(row?.receiptDate) : '-'),
      wrapText: true,
    },
    {
      headerName: t('table.idLabResult'),
      field: 'idLabResult',
      wrapText: true,
    },
    {
      headerName: t('table.FDAEligibility'),
      field: 'fdaEligibility',
      wrapText: true,
    },
    {
      headerName: t('table.reactivity'),
      field: 'reactivity',
      renderCell: row => conditionComponent(row.reactivity),
      wrapText: true,
    },
    {
      headerName: t('table.reactive'),
      field: 'reactiveStatus',
      wrapText: true,
    },
    {
      headerName: t('table.numberOfSpecimens.1stPart'),
      field: 'numberOfSpecimens',
      renderHeader: () => (
        <p className="text-center">
          {t('table.numberOfSpecimens.1stPart')} <br /> {t('table.numberOfSpecimens.2ndPart')}
        </p>
      ),
    },
    {
      headerName: t('specimenTable.strawColor'),
      field: 'color',
    },
    {
      headerName: t('specimenTable.dateFreeze'),
      field: 'freezeDate',
      renderCell: (row: any) => (row.freezeDate ? <span>{formatDateWithSlashSeparator(row.freezeDate)}</span> : '-'),
    },

    {
      headerName: t('table.specimen'),
      field: 'specimenType',
      renderHeader: () => (
        <p className="text-center">
          {t('table.specimenTypes.1stPart')} <br /> {t('table.specimenTypes.2ndPart')}
        </p>
      ),
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
    },
    {
      headerName: t('specimenTable.donorOocyte'),
      field: 'oocyteDonor.name',
      renderCell: (row: any) => conditionComponent(row?.donorOocyte),
    },
    {
      headerName: t('specimenTable.donorSperm'),
      field: 'spermDonor.name',
      renderCell: (row: any) => conditionComponent(row?.donorSperm),
    },
    {
      headerName: t('specimenTable.strawNotes'),
      field: 'notes',
    },
    {
      headerName: 'Dispose Date',
      field: 'disposeDate',
      renderCell: (row: any) => (row?.disposeDate ? formatDateWithSlashSeparator(row?.disposeDate) : '-'),
    },
    {
      headerName: 'Disposed By',
      field: 'disposedBy',
    },
    {
      headerName: 'Notes',
      field: 'notes',
    },
  ];

  const onSelectRow = (id: string) => {
    const updatedSelection = rowSelectionModel.includes(id)
      ? rowSelectionModel.filter(item => item !== id)
      : [...rowSelectionModel, id];

    setRowSelectionModel(updatedSelection);
  };

  const onSelectAll = () => {
    // select only not processed
    const pageItems =
      _.reduce<any, string[]>(
        specimens?.items,
        (result, { processed, id }) => {
          if (!processed) result.push(id);
          return result;
        },
        []
      ) || [];
    // select all on current page
    const allSelected = selectedItemsByPage[currentPage]?.length === pageItems.length;

    const updatedSelection = allSelected
      ? []
      : [...rowSelectionModel, ...pageItems.filter(id => !rowSelectionModel.includes(id))];

    setRowSelectionModel(allSelected ? rowSelectionModel.filter(id => !pageItems.includes(id)) : updatedSelection);
  };

  const selectedItemsStats = Object.keys(selectedItemsByPage)
    .filter(page => selectedItemsByPage[parseInt(page)].length > 0)
    .map(
      page =>
        `Selected items: ${selectedItemsByPage[parseInt(page)].length} on ${getOrdinalSuffix(parseInt(page))} page`
    )
    .join('; ');

  const totalSelectedItems = rowSelectionModel.length;

  useEffect(() => {
    if (specimens) {
      const currentPageItemsIds = specimens.items.map((item: any) => item.id);
      const updatedSelection = rowSelectionModel.filter(id => currentPageItemsIds.includes(id));

      setSelectedItemsByPage(prev => ({
        ...prev,
        [currentPage]: updatedSelection,
      }));
    }
  }, [currentPage, specimens, rowSelectionModel]);

  useEffect(() => {
    setRowSelectionModel([]);
    setSelectedItemsByPage({});
  }, [pagination.size, filters.actualFilters, search?.searchTerm]);

  useEffect(() => {
    setCurrentPage(pagination?.currentPage);
  }, [pagination.currentPage]);

  const handleDisposeDevices = (data: any) => {
    disposeDevices
      .trigger({
        deviceIds: rowSelectionModel,
        date: data?.date ? formatDate(new Date(data?.date)) : '',
        disposeStatus: data?.status,
        notes: data?.notes,
        TechnicalSpecialist: data?.initials,
      })
      .then(() => {
        toast.success('Devices status updated successfully');
        // @ts-ignore
        refetchDevices(undefined, { revalidate: true });
        onCloseProcessModal();
      })
      .catch((reason: any) => {
        if (reason?.response?.data.detail) {
          toast.error(reason.response.data.detail);
        } else {
          handleBackendErrors(reason.response.data.errors);
        }
      });
    setRowSelectionModel([]);
  };

  return (
    <>
      <div
        className={classNames('grid w-full grid-cols-1 items-center justify-between md:flex', {
          'mb-4': filters.isFiltering,
          'mb-8': !filters.isFiltering,
        })}>
        <div className="mb-4 flex w-full flex-col items-end justify-between gap-4 md:mb-0 md:flex-row md:items-center lg:gap-0">
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

            <FilterDropdown
              {...filters}
              isFiltering={filters.isFiltering}
              state={filters.tempFilters}
              filters={filtersConfig}
            />
          </div>
        </div>

        {withTransfers && (
          <div className="flex flex-row justify-end gap-2">
            <Button
              onClick={onOpenProcessModal}
              className="border-0"
              size="sm"
              gradientDuoTone="primary"
              disabled={!rowSelectionModel.length}>
              <HiCheck className="mr-2 text-lg" />
              Thaw/Discard/Donate
            </Button>
          </div>
        )}
      </div>

      {(filters.isFiltering || !!totalSelectedItems) && (
        <div>
          {filters.isFiltering && (
            <div className="mb-2">
              <FilterBadges
                filters={filters.actualFilters}
                removeFilter={filters.removeFilter}
                config={filtersConfig}
              />
            </div>
          )}

          {!!totalSelectedItems && (
            <div className="dark:br-[#212121] mt-2 flex w-auto flex-nowrap rounded-md bg-[#212121] px-2.5">
              <p className="mr-2 text-xs font-medium leading-[18px] text-gray-300">
                {selectedItemsStats} {totalSelectedItems > 0 && `| Total selected: ${totalSelectedItems}`}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
        <DataGridTable
          checkboxSelection={withTransfers}
          checkedIds={selectedItemsByPage[currentPage]}
          onCheck={onSelectRow}
          onCheckAll={onSelectAll}
          columns={columns}
          rows={specimens?.items || []}
          isLoading={isLoading}
        />
        {specimens?.items.length ? <Pagination {...pagination} /> : null}
      </div>
      <ProcessCanesModal
        isOpen={isProcessModalOpen}
        onClose={onCloseProcessModal}
        onConfirm={handleDisposeDevices}
        validationSchema={updateCaneStatusSchema}
        message={`Please choose the action for the ${rowSelectionModel.length} ${
          rowSelectionModel.length !== 1 ? 'selected inventories' : 'selected inventory.'
        }`}
      />
    </>
  );
};

export default Devices;
