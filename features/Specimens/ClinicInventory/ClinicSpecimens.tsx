import { useGetClinicSpecimens } from '@/api/queries/speciment.queries';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import { SpecimensResponse } from '@/types/api';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';

import { useGetUsers } from '@/api/queries/user.queries';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import { buildClinicAdminCaneDetailsPageRoute, buildClinicPatientProfilePageRoute } from '@/constants/buildRoutes';
import { tissueTypeListFilter } from '@/constants/filters';
import { consentList } from '@/constants/specimens';
import { Filter } from '@/types/view/Filters.type';
import { conditionComponent } from '@/utils/conditionComponent';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { toPascalCase } from '@/utils/toPascalCase';
import classNames from 'classnames';

const Specimens = ({ patientIdProps }: { patientIdProps?: string }) => {
  const { t } = useTranslation('specimens');

  const [specimens, setSpecimens] = useState<null | SpecimensResponse>(null);
  const { data: usersData } = useGetUsers();
  const { filters, pagination, search } = useTableControls(specimens, {
    patientId: '',
    rfId: '',
    specimenType: '',
    freezeDate: '',
    embryoDonor: '',
    spermDonor: '',
    oocyteDonor: '',
    tank: '',
    pie: '',
    canister: '',
    cane: '',
    color: '',
    pgtResults: '',
  });

  const { data: specimensData, isLoading } = useGetClinicSpecimens({
    id: usersData?.clinicId,
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      PatientId: patientIdProps ? patientIdProps : convertFilterToString(filters.actualFilters.patientId),
      RfId: filters.actualFilters.rfId || '',
      SpecimenType: convertFilterToString(filters.actualFilters.specimenType) || '',
      EmbryoDonorId: convertFilterToString(filters.actualFilters.embryoDonor) || '',
      SpermDonorId: convertFilterToString(filters.actualFilters.spermDonor) || '',
      OocyteDonorId: convertFilterToString(filters.actualFilters.oocyteDonor) || '',
      FreezeDate: filters.actualFilters.freezeDate || '',
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

  const patientsAutocomplete = useFilterAutocompleteOptions(
    `/Clinics/${usersData?.clinicId}/patients`,
    undefined,
    'firstAndLast'
  );

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
      headerName: t('specimenTable.strawNumber'),
      field: 'numberDescription',
      wrapText: true,
    },
    {
      headerName: t('table.caneCycle'),
      field: 'cycleNumber',
    },
    { headerName: t('table.Tank'), field: 'tank' },
    { headerName: t('table.Pie'), field: 'pie' },
    { headerName: t('table.Canister'), field: 'canister' },
    { headerName: t('table.CaneNum'), field: 'cane' },
    { headerName: t('table.canetabLabel'), field: 'caneLabel' },
    { headerName: t('table.canetabColor'), field: 'caneDescription', wrapText: true },
    {
      headerName: t('specimenTable.strawColor'),
      field: 'color',
      wrapText: true,
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
  ];

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
    </>
  );
};

export default Specimens;
