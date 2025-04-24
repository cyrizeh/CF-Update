import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import { useGetDevices, useGetPatientsDevices } from '@/api/queries/speciment.queries';
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
  locationStatusesFilter,
  ReactiveTypeListFilter,
  tissueTypeListFilter,
} from '@/constants/filters';
import { consentList, LocationStatusTitle } from '@/constants/specimens';
import { useTableControls } from '@/hooks/useTableControls';
import useToggleModal from '@/hooks/useToggleModal';
import dots from '@/public/icons/dots-vertical.svg';
import PencilAlt from '@/public/icons/PencilAlt';
import { SpecimensResponse } from '@/types/api';
import { Filter } from '@/types/view/Filters.type';
import { SpecimanDetailsByCane } from '@/types/view/Specimen.interface';
import { conditionComponent } from '@/utils/conditionComponent';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { formatDate } from '@/utils/formatDate';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toPascalCase } from '@/utils/toPascalCase';
import { updateCaneStatusSchema } from '@/validations/transportation';
import classNames from 'classnames';
import { Button, Dropdown } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { HiCheck, HiSearch } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import ProcessCanesModal from './ProcessCanesModal';
import AddSpecimenModal from './SpecimenDetails/AddSpecimenModal/AddSpecimenModal';
import EditDeviceModal from './SpecimenDetails/EditDeviceModal/EditDeviceModal';

const AdminPatientsDevices = ({
  patientIdProps,
  withTransfers = true,
}: {
  patientIdProps?: string;
  withTransfers?: boolean;
}) => {
  const { t } = useTranslation('specimens');
  const [rowSelectionModel, setRowSelectionModel] = useState<Array<string>>([]);
  const [specimens, setSpecimens] = useState<null | SpecimensResponse>(null);
  const [selectedSpecimen, setSelectedSpecimen] = useState<SpecimanDetailsByCane | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<SpecimanDetailsByCane | null>(null);
  const [openAlert, toggleAlert] = useState(false);
  const [activeId, setActiveId] = useState('');
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
    facilityId: '',
    dateOfReceipt: '',
    freezeDate: '',
    vault: '',
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
    mutate,
  } = useGetPatientsDevices({
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    patientId: patientIdProps,
    filters: {
      PatientId: patientIdProps ? patientIdProps : convertFilterToString(filters.actualFilters.patientId),
      FacilityId: convertFilterToString(filters.actualFilters.facilityId),
      RfId: filters.actualFilters.rfId || '',
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
      FdaEligibility: convertFilterToString(filters.actualFilters.fdaEligibility) || '',
      ReactiveStatus: convertFilterToString(filters.actualFilters.reactiveStatus) || '',
      Reactivity: filters.actualFilters.reactivity || '',
      DonorOocyte: filters.actualFilters.donorOocyte || '',
      DonorSperm: filters.actualFilters.donorSperm || '',
      ReceiptDate: filters.actualFilters.receiptDate || '',
      SpecimenType: convertFilterToString(filters.actualFilters.specimenType) || '',
    },
  });

  const { deleteDevice } = useInventoryMutation();
  const patientsAutocomplete = useFilterAutocompleteOptions('/admin/patients', undefined, 'firstAndLast');
  const facilitiesAutocomplete = useFilterAutocompleteOptions('/facilities');

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

  const {
    isModalOpen: isModalAddSpecimenToStrawOpen,
    onCloseModal: onCloseAddSpecimenToStrawModal,
    onOpenModal: onOpeAddSpecimenToStrawModal,
  } = useToggleModal();

  const openModalToAddSpecimenToStraw = (data: any) => {
    setSelectedSpecimen(data);
    onOpeAddSpecimenToStrawModal();
  };

  const {
    isModalOpen: isEditDeviceModalOpen,
    onCloseModal: onEditDeviceCloseModal,
    onOpenModal: onEditDeviceOpenModal,
  } = useToggleModal();

  const openModalToEditDevice = (data: any) => {
    setSelectedDevice(data);
    onEditDeviceOpenModal();
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
        row.caneId ? (
          <TableLink href={buildAdminCaneDetailsPageRoute(row.caneId)} name={row.rfid || 'View Cane'} />
        ) : (
          <p>{row.rfid}</p>
        ),
    },
    {
      headerName: t('table.locationStatus'),
      field: 'locationStatus',
      renderCell: row => <p>{LocationStatusTitle[row.locationStatus]}</p>,
      wrapText: true,
    },
    {
      headerName: t('specimenTable.strawNumber'),
      field: 'numberDescription',
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
    { headerName: t('table.canetabLabel'), field: 'caneLabel' },
    {
      headerName: t('table.canetabColor'),
      field: 'caneDescription',
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
      headerName: 'Type',
      field: 'type',
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
      field: 'action',
      headerName: 'Actions',
      align: 'center',
      renderCell: (row: any) => (
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
            <Dropdown.Item className="hover:cursor-pointer" onClick={() => openModalToEditDevice(row)}>
              <PencilAlt />
              <p className="hover:bg-blue mx-2">Edit</p>
            </Dropdown.Item>
            <Dropdown.Item
              className="hover:cursor-pointer"
              onClick={() => {
                if (row?.expectedSpecimenQty > row?.numberOfSpecimens) {
                  openModalToAddSpecimenToStraw({ deviceId: row.id, specimenType: row.specimenType });
                } else {
                  toast.error(
                    `Sorry, but the maximum number of specimens has been reached. If you'd like to add more, please update your device's data`
                  );
                }
              }}>
              <FaPlus />
              <p className="hover:bg-blue mx-2">Add Specimen</p>
            </Dropdown.Item>

            <Dropdown.Item className="hover:cursor-pointer" onClick={() => onOpenAlert(row.id)}>
              <MdDelete />
              <p className="mx-2">Delete</p>
            </Dropdown.Item>
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

  const onDeleteSpecimen = () => {
    deleteDevice
      .trigger({ id: activeId })
      .then(() => {
        // @ts-ignore
        mutate(undefined, { revalidate: true });
      })
      .catch(reason => {
        if (reason?.response?.data) {
          toast.error(reason.response.data?.errors?.Specimen[0]);
        }
      })
      .finally(() => {
        onCloseAlert();
      });
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
        mutate(undefined, { revalidate: true });
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
    setSelectedItemsByPage({});
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

  return (
    <>
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseAlert}
        onConfirm={onDeleteSpecimen}
        isLoading={deleteDevice.isMutating}
        title={t('common:delete')}
        message={t('common:deleteConfirmation')}
      />
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

            <div className="h-5 border-r border-dark-grey-300 md:visible"></div>

            <FilterDropdown
              {...filters}
              isFiltering={filters.isFiltering}
              state={filters.tempFilters}
              filters={filtersConfig}
            />
          </div>
          {withTransfers && (
            <div className="flex flex-row gap-2">
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
      <AddSpecimenModal
        isOpen={isModalAddSpecimenToStrawOpen}
        onClose={onCloseAddSpecimenToStrawModal}
        refetchPatientInfo={() => {
          mutate();
        }}
        specimenData={selectedSpecimen}
      />
      <EditDeviceModal
        isOpen={isEditDeviceModalOpen}
        onClose={onEditDeviceCloseModal}
        refetchPatientInfo={() => {
          mutate();
        }}
        caneId={selectedDevice?.caneId as string}
        deviceData={selectedDevice}
      />
    </>
  );
};

export default AdminPatientsDevices;
