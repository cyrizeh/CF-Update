import { useGetCanesStatistics, useGetClinicCanes } from '@/api/queries/speciment.queries';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { HiCheck, HiPlus, HiSearch } from 'react-icons/hi';

import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import useTransfersMutation from '@/api/mutations/useTransfersMutation';
import { useGetClinicById } from '@/api/queries/clinic.queries';
import { useGetUsers } from '@/api/queries/user.queries';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import { buildClinicAdminCaneDetailsPageRoute, buildClinicPatientProfilePageRoute } from '@/constants/buildRoutes';
import {
  fdaEligibilityTypesFilter,
  IdLabTypeFilter,
  locationStatusesFilter,
  ReactiveTypeListFilter,
  tissueTypeListFilter,
} from '@/constants/filters';
import { consentList, inventoryStatistics, locationStatuses } from '@/constants/specimens';
import useToggleModal from '@/hooks/useToggleModal';
import { Filter } from '@/types/view/Filters.type';
import { hasPermission, isSmallScreen } from '@/utils';
import { conditionComponent } from '@/utils/conditionComponent';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { formatDate } from '@/utils/formatDate';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toPascalCase } from '@/utils/toPascalCase';
import { addTransfersToClinicSchema, editDateSchema, updateCaneStatusSchema } from '@/validations/transportation';
import classNames from 'classnames';
import { Button } from 'flowbite-react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import AddTransferModal from '../AddTransferModal';
import ProcessCanesModal from '../ProcessCanesModal';
import TransferToClinicModal from '../TransferToClinicModal';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const Canes = ({ withTransfers = true, patientIdProps }: { withTransfers?: boolean; patientIdProps?: string }) => {
  const { t } = useTranslation('specimens');
  const [rowSelectionModel, setRowSelectionModel] = useState<Array<string>>([]);
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const [canesCount, setCanesCount] = useState<any>([]);

  const {
    isModalOpen: isTransferToClinicModalOpen,
    onCloseModal: onCloseTransferToClinicModal,
    onOpenModal: onOpenTransferToClinicModal,
  } = useToggleModal();
  const {
    isModalOpen: isProcessModalOpen,
    onCloseModal: onCloseProcessModal,
    onOpenModal: onOpenProcessModal,
  } = useToggleModal();
  const { data: usersData } = useGetUsers();
  const [specimens, setSpecimens] = useState<any>(null);
  const { transfersToClinic } = useTransfersMutation();
  const { disposeCanes } = useInventoryMutation();

  const { data: clinic } = useGetClinicById(usersData?.clinicId as string);
  const { filters, pagination, search } = useTableControls(
    specimens,
    {
      patientId: '',
      rfId: '',
      specimenType: '',
      tank: '',
      pie: '',
      canister: '',
      cane: '',
      cycleNumber: '',
      locationStatus: {
        labelBadge: 'At Location',
        keyBadge: 'AtLocation',
      },
    },
    10,
    true
  );

  const [selectedItemsByPage, setSelectedItemsByPage] = useState<{ [key: number]: Array<string> }>({});
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);

  const { data: statistics } = useGetCanesStatistics();
  const {
    data: specimensData,
    isLoading,
    mutate: refetchCanes,
  } = useGetClinicCanes({
    id: usersData?.clinicId,
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      PatientId: patientIdProps ? patientIdProps : convertFilterToString(filters.actualFilters.patientId),
      RfId: filters.actualFilters.rfId || '',
      SpecimenType: convertFilterToString(filters.actualFilters.specimenType) || '',
      Tank: filters.actualFilters.tank || '',
      Canister: filters.actualFilters.canister || '',
      Pie: filters.actualFilters.pie || '',
      Cane: filters.actualFilters.cane || '',
      CycleNumber: filters.actualFilters.cycleNumber || '',
      LocationStatus:
        convertFilterToString(filters.actualFilters.locationStatus) === 'All Statuses'
          ? ''
          : convertFilterToString(filters.actualFilters.locationStatus),
      FdaEligibility: convertFilterToString(filters.actualFilters.fdaEligibility) || '',
      ReactiveStatus: convertFilterToString(filters.actualFilters.reactiveStatus) || '',
      Reactivity: filters.actualFilters.reactivity || '',
      ReceiptDate: filters.actualFilters.receiptDate || '',
    },
  });

  const patientsAutocomplete = useFilterAutocompleteOptions(
    `/Clinics/${usersData?.clinicId}/patients`,
    undefined,
    'firstAndLast'
  );

  const { userPermissions } = usePermissions();
  const isUserCanReadTransfers = hasPermission(userPermissions, 'read:transfer');

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
      type: 'date',
      value: 'receiptDate',
      placeholder: 'Receipt Date',
      label: 'Receipt Date',
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
      type: 'select',
      value: 'idLabResult',
      placeholder: 'ID Lab Result',
      options: IdLabTypeFilter,
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
        row.patient?.id && !patientIdProps ? (
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
        row.id ? (
          <TableLink href={buildClinicAdminCaneDetailsPageRoute(row.id)} name={row.rfid || 'View Cane'} />
        ) : (
          <p>{row.rfid}</p>
        ),
    },
    {
      headerName: t('table.locationStatus'),
      field: 'locationStatus',
      renderCell: row => <p>{locationStatuses.find((item: any) => item.value === row.locationStatus)?.label}</p>,
    },
    {
      headerName: t('table.specimen'),
      field: 'tissueType',
      renderCell: row => (row.specimenTypes?.length ? getSpecimenLabels(row.specimenTypes) : '-'),
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
      headerName: t('table.numberOfDevices'),
      field: 'numberOfDevices',
      renderHeader: () => (
        <p className="text-center">
          {t('table.numberOfDevices.1stPart')} <br /> {t('table.numberOfDevices.2ndPart')}
        </p>
      ),
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
      headerName: t('modal.notes'),
      field: 'notes',
      wrapText: true,
    },
  ];

  useEffect(() => {
    if (!isLoading && specimensData) {
      setSpecimens({
        ...specimensData,
        items: specimensData?.items?.map((item: any) => {
          return {
            ...item,
            processed: item.locationStatus !== 'AtLocation' && withTransfers,
          };
        }),
      });
    }
  }, [isLoading, specimensData]);

  const onConfirm = (data: any) => {
    const transfers = {
      caneIds: rowSelectionModel,
      shipmentDate: data?.date ? formatDate(new Date(data?.date)) : '',
      clinicId: clinic?.id,
    };

    transfersToClinic(transfers)
      .then(() => {
        toast.success('Transfer request created successfully');
        // @ts-ignore
        refetchCanes(undefined, { revalidate: true });
        onCloseModal();
      })
      .catch((reason: any) => {
        if (reason?.response?.data) {
          if (!_.isEmpty(reason.response.data.errors)) {
            handleBackendErrors(reason.response.data.errors);
          } else if (!_.isEmpty(reason?.response?.data?.detail)) {
            toast.error(reason?.response?.data?.detail);
          } else {
            toast.error('Cannot make transfer request');
          }
        }
        onCloseModal();
      });
    setRowSelectionModel([]);
    setSelectedItemsByPage({});
  };

  const onTransferToClinic = (data: any) => {
    transfersToClinic({
      caneIds: rowSelectionModel,
      shipmentDate: data?.date ? formatDate(new Date(data?.date)) : '',
      clinicName: data?.receivingClinic || clinic?.name,
      clinicId: clinic?.id,
      notes: data?.notes,
      techInitials: data?.initials,
    })
      .then(() => {
        toast.success('Transfer request created successfully');
        // @ts-ignore
        refetchCanes(undefined, { revalidate: true });

        onCloseTransferToClinicModal();
      })
      .catch((reason: any) => {
        if (reason?.response?.data) {
          if (!_.isEmpty(reason.response.data.errors)) {
            handleBackendErrors(reason.response.data.errors);
          } else if (!_.isEmpty(reason?.response?.data?.detail)) {
            toast.error(reason?.response?.data?.detail);
          } else {
            toast.error('Transfer request failed');
          }
        }
        onCloseTransferToClinicModal();
      });
    setRowSelectionModel([]);
    setSelectedItemsByPage({});
  };

  const onCaneStateUpdate = (data: any) => {
    disposeCanes
      .trigger({
        caneIds: rowSelectionModel,
        date: data?.date ? formatDate(new Date(data?.date)) : '',
        locationStatus: data?.status,
        notes: data?.notes,
        TechnicalSpecialist: data?.initials,
      })
      .then(() => {
        toast.success('Canes status updated successfully');
        // @ts-ignore
        refetchCanes(undefined, { revalidate: true });
        onCloseProcessModal();
      })
      .catch((reason: any) => {
        if (reason?.response?.data) {
          if (!_.isEmpty(reason.response.data.errors)) {
            handleBackendErrors(reason.response.data.errors);
          } else if (!_.isEmpty(reason?.response?.data?.detail)) {
            toast.error(reason?.response?.data?.detail);
          } else {
            toast.error('Status update failed');
          }
        }
        onCloseProcessModal();
      });
    setRowSelectionModel([]);
    setSelectedItemsByPage({});
  };

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

  useEffect(() => {
    if (statistics) {
      const mappedStatistics = inventoryStatistics.map(item => {
        const count = statistics[item.key] || 0;
        return {
          ...item,
          count,
        };
      });

      setCanesCount(mappedStatistics);
    }
  }, [statistics]);

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

  const selectedItemsStats = Object.keys(selectedItemsByPage)
    .filter(page => selectedItemsByPage[parseInt(page)].length > 0)
    .map(
      page =>
        `Selected items: ${selectedItemsByPage[parseInt(page)].length} on ${getOrdinalSuffix(parseInt(page))} page`
    )
    .join('; ');

  const totalSelectedItems = rowSelectionModel.length;

  useEffect(() => {
    setRowSelectionModel([]);
    setSelectedItemsByPage({});
  }, [pagination.size, filters.actualFilters, search?.searchTerm]);

  useEffect(() => {
    setCurrentPage(pagination?.currentPage);
  }, [pagination.currentPage]);

  return (
    <>
      <div
        className={classNames('grid w-full grid-cols-1 items-center justify-between md:flex', {
          'mb-4': filters.isFiltering,
          'mb-8': !filters.isFiltering,
        })}>
        <div className="mb-4 flex w-full flex-col items-center justify-between gap-4 md:mb-0 lg:flex-row lg:gap-0">
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
          <div className="flex flex-row flex-wrap justify-end gap-2">
            {isUserCanReadTransfers && withTransfers && (
              <>
                <Button
                  onClick={onOpenModal}
                  className="border-0"
                  size="sm"
                  gradientDuoTone="primary"
                  disabled={!rowSelectionModel.length}>
                  <HiPlus className="mr-2 text-lg" />
                  {t('transferToCryoFuture')}
                </Button>

                <Button
                  onClick={onOpenTransferToClinicModal}
                  className="border-0"
                  size="sm"
                  gradientDuoTone="primary"
                  disabled={!rowSelectionModel.length}>
                  <HiPlus className="mr-2 text-lg" />
                  <span className="max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap">{`Transfer to ${
                    clinic?.name || 'clinic'
                  }`}</span>
                </Button>
                <Button
                  onClick={onOpenProcessModal}
                  className="border-0"
                  size="sm"
                  gradientDuoTone="primary"
                  disabled={!rowSelectionModel.length}>
                  <HiCheck className="mr-2 text-lg" />
                  {t('dispose')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        {filters.isFiltering && (
          <div className="mb-4">
            <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filtersConfig} />
          </div>
        )}

        {!patientIdProps ? (
          <div className="dark:br-[#212121] flex w-auto flex-wrap rounded-md bg-[#212121] px-2.5">
            {canesCount.map((item: any, index: number) => (
              <div key={item.label} className="">
                <div className="flex text-center">
                  <span className="mr-2 whitespace-nowrap text-xs font-medium  capitalize leading-[18px] text-gray-300">
                    <p>{item.label}:</p>
                  </span>
                  <span className="mr-2 text-xs font-bold leading-[18px] text-gray-300">{item.count}</span>
                  {!isSmallScreen()
                    ? index < canesCount.length - 1 && (
                        <span className="mr-2 text-xs font-medium text-[#828282]">|</span>
                      )
                    : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="min-h-[20px]">
          {
            <div className="dark:br-[#212121] mt-2 flex w-auto flex-nowrap rounded-md bg-[#212121] px-2.5">
              <p className="mr-2 text-xs font-medium leading-[18px] text-gray-300">
                {selectedItemsStats} {totalSelectedItems > 0 && `| Total selected: ${totalSelectedItems}`}
              </p>
            </div>
          }
        </div>
      </div>

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
        {specimens?.items?.length ? <Pagination {...pagination} /> : null}
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
      <TransferToClinicModal
        isOpen={isTransferToClinicModalOpen}
        onClose={onCloseTransferToClinicModal}
        onConfirm={onTransferToClinic}
        validationSchema={addTransfersToClinicSchema}
        message={`Please fill the form for transfer the ${rowSelectionModel.length} ${
          rowSelectionModel.length !== 1 ? 'selected inventories' : 'selected inventory.'
        }`}
        clinicName={clinic?.name}
      />
      <ProcessCanesModal
        isOpen={isProcessModalOpen}
        onClose={onCloseProcessModal}
        onConfirm={onCaneStateUpdate}
        validationSchema={updateCaneStatusSchema}
        message={`Please choose the action for the ${rowSelectionModel.length} ${
          rowSelectionModel.length !== 1 ? 'selected inventories' : 'selected inventory.'
        }`}
      />
    </>
  );
};

export default Canes;
