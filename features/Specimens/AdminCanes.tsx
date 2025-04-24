import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import useTransfersMutation from '@/api/mutations/useTransfersMutation';
import { useGetCaneById, useGetCanes, useGetCanesStatistics } from '@/api/queries/speciment.queries';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import {
  buildAdminCaneDetailsPageRoute,
  buildAdminClinicDetailsPageRoute,
  buildAdminGeneralPatientPageRoute,
} from '@/constants/buildRoutes';
import {
  fdaEligibilityTypesFilter,
  IdLabTypeFilter,
  locationStatusesFilter,
  ReactiveTypeListFilter,
  tissueTypeListFilter,
} from '@/constants/filters';
import { consentList, inventoryStatistics, LocationStatus, locationStatuses } from '@/constants/specimens';
import { useTableControls } from '@/hooks/useTableControls';
import useToggleModal from '@/hooks/useToggleModal';
import dots from '@/public/icons/dots-vertical.svg';
import { Filter } from '@/types/view/Filters.type';
import { hasPermission, isSmallScreen } from '@/utils';
import { conditionComponent } from '@/utils/conditionComponent';
import {
  convertFilterToString,
  convertFilterToTrimmedLabelString,
  useFilterAutocompleteOptions,
} from '@/utils/filterUtils';
import { formatDate } from '@/utils/formatDate';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toPascalCase } from '@/utils/toPascalCase';
import { addTransfersSchema, updateCaneStatusSchema } from '@/validations/transportation';
import classNames from 'classnames';
import { Button, Dropdown } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { HiCheck, HiPlus, HiSearch } from 'react-icons/hi';
import { MdDelete, MdPrint } from 'react-icons/md';
import { toast } from 'react-toastify';
import AddTransferModal from './AddTransferModal';
import PrintRFIDModal from './PrintRFID/PrintRFIDModal';
import ProcessCanesModal from './ProcessCanesModal';
import PencilAlt from '@/public/icons/PencilAlt';
import EditCaneModal from './SpecimenDetails/EditCaneModal/EditCaneModal';
import { defaultEditCaneModalFormValues } from './SpecimenDetails/EditCaneModal/EditCaneModal.utils';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const Canes = ({ withTransfers = true, patientIdProps }: { withTransfers?: boolean; patientIdProps?: string }) => {
  const { t } = useTranslation('specimens');
  const [rowSelectionModel, setRowSelectionModel] = useState<Array<string>>([]);
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const [canesCount, setCanesCount] = useState<any>([]);
  const [selectedCane, setSelectedCane] = useState<any | null>(null);

  const [specimens, setSpecimens] = useState<any>(null);
  const [openAlert, toggleAlert] = useState(false);
  const [activeId, setActiveId] = useState('');
  const { transfersToClinic } = useTransfersMutation();
  const {
    isModalOpen: isProcessModalOpen,
    onCloseModal: onCloseProcessModal,
    onOpenModal: onOpenProcessModal,
  } = useToggleModal();

  const { filters, pagination, search } = useTableControls(
    specimens,
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
      idLabResult: '',
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
    mutate,
  } = useGetCanes({
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      PatientId: patientIdProps ? patientIdProps : convertFilterToString(filters.actualFilters.patientId),
      FacilityId: convertFilterToString(filters.actualFilters.facilityId),
      RfId: filters.actualFilters.rfId || '',
      SpecimenType: convertFilterToString(filters.actualFilters.specimenType) || '',
      Vault: filters.actualFilters.vault || '',
      Tank: filters.actualFilters.tank || '',
      Canister: filters.actualFilters.canister || '',
      Pie: filters.actualFilters.pie || '',
      Cane: filters.actualFilters.cane || '',
      IdLabResult: convertFilterToString(filters.actualFilters.idLabResult) || '',
      LocationStatus:
        convertFilterToString(filters.actualFilters.locationStatus) === 'All Statuses'
          ? ''
          : convertFilterToString(filters.actualFilters.locationStatus),
      FdaEligibility: convertFilterToString(filters.actualFilters.fdaEligibility) || '',
      ReactiveStatus: convertFilterToString(filters.actualFilters.reactiveStatus) || '',
      Reactivity: filters.actualFilters.reactivity || '',
      PrimaryIdentifier: convertFilterToTrimmedLabelString(filters.actualFilters.primaryIdentifier) || '',
      SecondaryIdentifierId: convertFilterToString(filters.actualFilters.secondaryIdentifier) || '',
      ReceiptDate: filters.actualFilters.receiptDate || '',
    },
  });

  const { deleteCane, disposeCanes } = useInventoryMutation();

  const patientsAutocomplete = useFilterAutocompleteOptions('/admin/patients', undefined, 'firstAndLast');
  const facilitiesAutocomplete = useFilterAutocompleteOptions('/facilities');
  const primaryIdentifierFilter = useFilterAutocompleteOptions('/specimenIdentifiers', undefined, 'email');
  const secondaryIdentifierFilter = useFilterAutocompleteOptions('/users/admins', undefined, 'email');

  const { data: cane } = useGetCaneById(activeId as string);
  const {
    isModalOpen: isPrintRFIDModalOpen,
    onCloseModal: onClosePrintRFIDModal,
    onOpenModal: onOpenPrintRFIDModal,
  } = useToggleModal();
  const {
    isModalOpen: isEditCaneModalOpen,
    onCloseModal: onEditCaneCloseModal,
    onOpenModal: onEditCaneOpenModal,
  } = useToggleModal();

  const { userPermissions } = usePermissions();
  const isUserCanReadTransfers = hasPermission(userPermissions, 'read:transfer');

  // We cannot edit/delete cane if it has Thawed/Discarded/Donated status
  const isNotDisposedStatus = (status: LocationStatus | undefined): boolean => {
    if (!status) return false;
    const disposedStatuses = [LocationStatus.Thawed, LocationStatus.Discarded, LocationStatus.Donated];
    return !disposedStatuses.includes(status);
  };

  const filtersConfig: Array<Filter & { show: boolean }> = [
    {
      type: 'autocomplete',
      value: 'patientId',
      autocompleteData: patientsAutocomplete,
      placeholder: 'Patient',

      show: !patientIdProps, // Show only if patientIdProps does not exist
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
      type: 'autocomplete',
      value: 'facilityId',
      autocompleteData: facilitiesAutocomplete,
      placeholder: 'Facility',

      show: true,
    },
    {
      type: 'text',
      value: 'vault',
      placeholder: 'Vault',
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
      type: 'autocomplete',
      value: 'primaryIdentifier',
      autocompleteData: primaryIdentifierFilter,
      placeholder: 'Primary Identifier',
      show: true,
    },
    {
      type: 'autocomplete',
      value: 'secondaryIdentifier',
      autocompleteData: secondaryIdentifierFilter,
      placeholder: 'Secondary Identifier',
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
            href={buildAdminGeneralPatientPageRoute(row.patient.id)}
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
          <TableLink href={buildAdminCaneDetailsPageRoute(row.id)} name={row.rfid || 'View Cane'} />
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
      headerName: t('table.clinic'),
      field: 'clinicName',
      renderCell: row =>
        row.clinicId ? (
          <TableLink href={buildAdminClinicDetailsPageRoute(row.clinicId)} name={row.clinicName} />
        ) : (
          <p>{row.clinicName}</p>
        ),
      wrapText: true,
    },
    {
      headerName: t('table.specimen'),
      field: 'tissueType',
      renderCell: row => (row.specimenTypes.length ? getSpecimenLabels(row.specimenTypes) : '-'),
      wrapText: true,
    },
    {
      headerName: t('table.facility'),
      field: 'facilityId',
      renderCell: row =>
        row.facilityId ? (
          <TableLink href={`/admin/facilities/${row.facilityId}`} name={row.facilityName} />
        ) : (
          <p>{row.facilityName}</p>
        ),
      wrapText: true,
    },
    { headerName: t('table.vault'), field: 'vault' },
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
      headerName: t('table.primaryIdentifier'),
      field: 'primaryIdentifier',
      wrapText: true,
    },
    {
      headerName: t('table.secondaryIdentifier'),
      field: 'secondaryIdentifier',
      wrapText: true,
    },
    {
      field: 'action',
      headerName: 'Actions',
      align: 'center',
      renderCell: row => (
        <Dropdown
          label=""
          placement="right-start"
          dismissOnClick={false}
          renderTrigger={() => (
            <div className="w-10 hover:cursor-pointer">
              <Image src={dots} alt="actions" />
            </div>
          )}>
          <div className="rounded-lg  bg-[#4F4F4F] p-[1px]">
            {isNotDisposedStatus(row?.locationStatus) && (
              <Dropdown.Item className="hover:cursor-pointer" onClick={() => openModalToEditCane(row)}>
                <PencilAlt />
                <p className="hover:bg-blue mx-2">Edit</p>
              </Dropdown.Item>
            )}
            <Dropdown.Item
              className="hover:cursor-pointer"
              onClick={() => {
                setActiveId(row.id);
                onOpenPrintRFIDModal();
              }}>
              <MdPrint />
              <p className="hover:bg-blue mx-2">Print label</p>
            </Dropdown.Item>

            {isNotDisposedStatus(row?.locationStatus) && (
              <Dropdown.Item className="hover:cursor-pointer" onClick={() => onOpenAlert(row.id)}>
                <MdDelete />
                <p className="mx-2">Delete</p>
              </Dropdown.Item>
            )}
          </div>
        </Dropdown>
      ),
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

  const onDeleteCane = () => {
    deleteCane
      .trigger({ id: activeId })
      .then(() => {
        toast.success(`${t('errors.deleteCaneSuccess')}`);
        // @ts-ignore
        mutate(undefined, { revalidate: true });
      })
      .catch(reason => {
        if (reason?.response?.data) {
          toast.error(reason.response.data?.errors?.CaneId[0]);
        }
      })
      .finally(() => {
        onCloseAlert();
      });
  };

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

  const onConfirm = (data: any) => {
    const transfersDate = data?.date ? formatDate(new Date(data?.date)) : '';
    const transfers = {
      caneIds: rowSelectionModel,
      shipmentDate: transfersDate,
      clinicId: data?.clinic?.id,
    };

    transfersToClinic(transfers)
      .then(() => {
        toast.success('Transfer request created successfully');
        // @ts-ignore
        mutate(undefined, { revalidate: true });
      })
      .catch((reason: any) => {
        if (reason?.response?.data) {
          if (!_.isEmpty(reason?.response?.data?.errors)) {
            handleBackendErrors(reason?.response?.data?.errors);
          } else if (!_.isEmpty(reason?.response?.data?.detail)) {
            toast.error(reason?.response?.data?.detail);
          } else {
            toast.error('Cannot make transfer request');
          }
        }
      })
      .finally(() => {
        onCloseModal();
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

  const openModalToEditCane = (caneData: any) => {
    const mappedCane = {
      receiptDate: caneData?.receiptDate || null,
      expectedDeviceQty: caneData?.expectedNumberOfDevices || 1,
      caneDescription: caneData?.caneDescription || '',
      caneLabel: caneData?.caneLabel || '',
      id: caneData?.id || '',
      primaryIdentifier: {
        id: caneData?.primaryIdentifierId || '',
        email: caneData?.primaryIdentifier || '',
      },
      idLabResult: caneData?.idLabResult || '',
      fdaEligibility: caneData?.fdaEligibility || defaultEditCaneModalFormValues.FDAEligibility,
      reactivity: caneData?.reactivity || false,
      reactiveStatus: caneData?.reactiveStatus || defaultEditCaneModalFormValues.reactive,
    };
    setSelectedCane(mappedCane);
    onEditCaneOpenModal();
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
        onCloseProcessModal();
        toast.success('Canes status updated successfully');
        // @ts-ignore
        mutate(undefined, { revalidate: true });
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
        onCloseProcessModal();
      });
    setRowSelectionModel([]);
    setSelectedItemsByPage({});
  };

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
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseAlert}
        onConfirm={onDeleteCane}
        isLoading={deleteCane.isMutating}
        title={t('common:delete')}
        message={t('common:deleteConfirmation')}
      />
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

          <div className="flex flex-row gap-2">
            {isUserCanReadTransfers && withTransfers && (
              <>
                <Button
                  onClick={onOpenModal}
                  className="border-0"
                  size="sm"
                  gradientDuoTone="primary"
                  disabled={totalSelectedItems === 0}>
                  <HiPlus className="mr-2 text-lg" />
                  {t('addTransfers')}
                </Button>

                <Button
                  onClick={onOpenProcessModal}
                  className="border-0"
                  size="sm"
                  gradientDuoTone="primary"
                  disabled={totalSelectedItems === 0}>
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
                  <span className="mr-2 text-xs font-bold leading-[18px]  text-gray-300">{item.count}</span>
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
        selectClinic={true}
        validationSchema={addTransfersSchema}
        title={'Transfer request'}
        message={`Please choose the transfer date and receiving clinic for the ${rowSelectionModel.length} ${
          rowSelectionModel.length !== 1 ? 'selected inventories' : 'selected inventory.'
        }`}
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
      <PrintRFIDModal key={activeId} isOpen={isPrintRFIDModalOpen} onClose={onClosePrintRFIDModal} caneData={cane} />
      <EditCaneModal
        isOpen={isEditCaneModalOpen}
        onClose={onEditCaneCloseModal}
        refetchCaneInfo={mutate}
        caneData={selectedCane}
      />
    </>
  );
};

export default Canes;
