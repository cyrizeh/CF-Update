import { useGetAccountCanes, useGetCanesStatistics } from '@/api/queries/speciment.queries';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';

import { useGetUsers } from '@/api/queries/user.queries';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import {
  buildAccountClinicProfilePageRoute,
  buildAccountPatientProfilePageRoute,
  buildNetworkAdminCaneDetailsPageRoute,
} from '@/constants/buildRoutes';
import {
  fdaEligibilityTypesFilter,
  IdLabTypeFilter,
  locationStatusesFilter,
  ReactiveTypeListFilter,
  tissueTypeListFilter,
} from '@/constants/filters';
import { consentList, inventoryStatistics, locationStatuses } from '@/constants/specimens';
import { Filter } from '@/types/view/Filters.type';
import { isSmallScreen } from '@/utils';
import { conditionComponent } from '@/utils/conditionComponent';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import { toPascalCase } from '@/utils/toPascalCase';
import classNames from 'classnames';

const Canes = ({ withTransfers = true, patientIdProps }: { withTransfers?: boolean; patientIdProps?: string }) => {
  const { t } = useTranslation('specimens');
  const { data: usersData } = useGetUsers();
  const [specimens, setSpecimens] = useState<any>(null);
  const [canesCount, setCanesCount] = useState<any>([]);

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
      idLabResult: '',
      locationStatus: {
        labelBadge: 'At Location',
        keyBadge: 'AtLocation',
      },
    },
    10,
    true
  );
  const { data: statistics } = useGetCanesStatistics();

  const { data: specimensData, isLoading } = useGetAccountCanes({
    id: usersData?.accountId,
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
      IdLabResult: convertFilterToString(filters.actualFilters.idLabResult) || '',
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
    `/Accounts/${usersData?.accountId}/patients`,
    undefined,
    'firstAndLast'
  );

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
    { type: 'text', value: 'tank', placeholder: 'Tank', show: true },
    { type: 'text', value: 'canister', placeholder: 'Canister', show: true },
    { type: 'text', value: 'pie', placeholder: 'Pie', show: true },
    { type: 'text', value: 'cane', placeholder: 'Slot', show: true },
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
            href={buildAccountPatientProfilePageRoute(row.patient.id)}
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
          <TableLink href={buildNetworkAdminCaneDetailsPageRoute(row.id)} name={row.rfid || 'View Cane'} />
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
          <TableLink href={buildAccountClinicProfilePageRoute(row.clinicId)} name={row.clinicName} />
        ) : (
          <p>{row.clinicName}</p>
        ),
      wrapText: true,
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

  return (
    <>
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
      </div>

      <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
        <DataGridTable columns={columns} rows={specimens?.items || []} isLoading={isLoading} />
        {specimens?.items?.length ? <Pagination {...pagination} /> : null}
      </div>
    </>
  );
};

export default Canes;
