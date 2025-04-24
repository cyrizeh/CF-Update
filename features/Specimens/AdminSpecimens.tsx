import { useGetSpecimens } from '@/api/queries/speciment.queries';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import { SpecimensResponse } from '@/types/api';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import {
  buildAdminCaneDetailsPageRoute,
  buildAdminClinicDetailsPageRoute,
  buildAdminFacilityDetailsPageRoute,
  buildAdminGeneralPatientPageRoute,
} from '@/constants/buildRoutes';
import { tissueTypeListFilter } from '@/constants/filters';
import { consentList } from '@/constants/specimens';
import { Filter } from '@/types/view/Filters.type';
import { conditionComponent } from '@/utils/conditionComponent';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { toPascalCase } from '@/utils/toPascalCase';
import classNames from 'classnames';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Dropdown } from 'flowbite-react';
import PencilAlt from '@/public/icons/PencilAlt';
import Image from 'next/image';
import AddSpecimenModal from './SpecimenDetails/AddSpecimenModal/AddSpecimenModal';
import useToggleModal from '@/hooks/useToggleModal';
import { SpecimanDetailsByCane } from '@/types/view/Specimen.interface';
import dots from '@/public/icons/dots-vertical.svg';

const Specimens = ({ patientIdProps }: { patientIdProps?: string }) => {
  const { t } = useTranslation('specimens');

  const [specimens, setSpecimens] = useState<null | SpecimensResponse>(null);
  const [openAlert, toggleAlert] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [selectedSpecimen, setSelectedSpecimen] = useState<SpecimanDetailsByCane | null>(null);

  const { filters, pagination, search } = useTableControls(specimens, {
    patientId: '',
    rfId: '',
    specimenType: '',
    facilityId: '',
    freezeDate: '',
    vault: '',
    tank: '',
    pie: '',
    canister: '',
    cane: '',
    color: '',
    pgtResults: '',
  });

  const {
    isModalOpen: isModalAddSpecimenToStrawOpen,
    onCloseModal: onCloseAddSpecimenToStrawModal,
    onOpenModal: onOpeAddSpecimenToStrawModal,
  } = useToggleModal();

  const openModalToEditSpecimen = (data: any) => {
    setSelectedSpecimen(data);
    onOpeAddSpecimenToStrawModal();
  };

  const {
    data: specimensData,
    isLoading,
    mutate,
  } = useGetSpecimens({
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      PatientId: patientIdProps ? patientIdProps : convertFilterToString(filters.actualFilters.patientId),
      FacilityId: convertFilterToString(filters.actualFilters.facilityId),
      RfId: filters.actualFilters.rfId || '',
      SpecimenType: convertFilterToString(filters.actualFilters.specimenType) || '',
      FreezeDate: filters.actualFilters.freezeDate || '',
      Vault: filters.actualFilters.vault || '',
      Tank: filters.actualFilters.tank || '',
      Canister: filters.actualFilters.canister || '',
      Pie: filters.actualFilters.pie || '',
      Cane: filters.actualFilters.cane || '',
      Color: filters.actualFilters.color || '',
      PgtResults: filters.actualFilters.pgtResults || '',
      DonorOocyte: filters.actualFilters.donorOocyte || '',
      DonorSperm: filters.actualFilters.donorSperm || '',
    },
  });

  const { deleteSpecimen } = useInventoryMutation();
  const patientsAutocomplete = useFilterAutocompleteOptions('/admin/patients', undefined, 'firstAndLast');
  const facilitiesAutocomplete = useFilterAutocompleteOptions('/facilities');

  useEffect(() => {
    if (!isLoading && specimensData) {
      setSpecimens(specimensData);
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
      type: 'text',
      value: 'pgtResults',
      placeholder: 'Pgt Results',
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
          <TableLink href={buildAdminFacilityDetailsPageRoute(row.facilityId)} name={row.facilityName} />
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
    { headerName: t('table.canetabColor'), field: 'caneDescription' },
    {
      headerName: t('specimenTable.strawColor'),
      field: 'color',
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
      wrapText: true,
    },
    { headerName: t('table.embryoNumber'), field: 'embryoOocyteNumber' },
    {
      headerName: t('table.gradeMaturity'),
      field: 'gradeMaturity',
    },
    {
      headerName: t('specimenTable.strawPTGRezults'),
      field: 'pgtResults',
    },
    {
      headerName: t('specimenTable.strawNotes'),
      field: 'notes',
      wrapText: true,
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
            <Dropdown.Item className="hover:cursor-pointer" onClick={() => openModalToEditSpecimen(row)}>
              <PencilAlt />
              <p className="hover:bg-blue mx-2">Edit</p>
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
    deleteSpecimen
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

  return (
    <>
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
        {specimens?.items.length ? <Pagination {...pagination} /> : null}
      </div>
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseAlert}
        onConfirm={onDeleteSpecimen}
        isLoading={deleteSpecimen.isMutating}
        title={t('common:delete')}
        message={t('common:deleteConfirmation')}
      />
      <AddSpecimenModal
        isOpen={isModalAddSpecimenToStrawOpen}
        onClose={onCloseAddSpecimenToStrawModal}
        refetchPatientInfo={() => {
          mutate();
        }}
        specimenData={selectedSpecimen}
      />
    </>
  );
};

export default Specimens;
