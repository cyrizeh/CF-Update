import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

import useBilling from './useBilling';

import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';

import { HiSearch } from 'react-icons/hi';

import useBillingsMutation from '@/api/mutations/useBillingMutation';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableData, TableLink } from '@/components/DataGrid/TableComponents';
import { buildAdminGeneralPatientPageRoute } from '@/constants/buildRoutes';
import { exportToCSV } from '@/utils/exportToCSV';
import { toPascalCase } from '@/utils/toPascalCase';
import { Button } from 'flowbite-react';
import { TbFileImport } from 'react-icons/tb';
import { toast } from 'react-toastify';
const Billing = () => {
  const { t } = useTranslation('billing');
  const {
    filters,
    search,
    pagination,
    billingsList,
    filterConfig,
    isBillingLoading,
    selectedItemsByPage,
    rowSelectionModel,
    currentPage,
    selectedItemsStats,
    totalSelectedItems,
    onSelectRow,
    onSelectAll,
  } = useBilling();
  const { handleExportBillings } = useBillingsMutation();

  const exportCSV = () => {
    if (!!rowSelectionModel.length) {
      handleExportBillings.trigger({ selectedIds: rowSelectionModel }).then(response => {
        exportToCSV(response?.data);
      });
    } else {
      const errorMessage = t('selectBillings');
      toast.error(errorMessage);
    }
  };

  const columns: ColDefType[] = [
    {
      headerName: 'Patient',
      field: 'patient.firstAndLast',
      renderCell: row => (
        <TableLink
          href={buildAdminGeneralPatientPageRoute(row.patient.id)}
          name={toPascalCase(row.patient.firstAndLast)}
          styles={{ name: 'sensitive' }}
        />
      ),
    },
    {
      headerName: 'Clinic',
      field: 'clinicName',
      renderCell: row =>
        row.clinicName ? <TableLink href={`/admin/clinics/${row.clinicId}/general`} name={row.clinicName} /> : ' - ',
      wrapText: true,
    },
    {
      headerName: 'Facility',
      field: 'facilityId',
      renderCell: row =>
        row.facilityName ? <TableLink href={`/admin/facilities/${row.facilityId}`} name={row.facilityName} /> : ' - ',
    },
    { headerName: 'Charge name', field: 'name' },
    { headerName: 'Status', field: 'status' },
    {
      headerName: 'Due date (payment date)',
      field: 'dueDate',
      renderCell: row => <TableData date={row.dueDate} />,
    },
    {
      headerName: 'Payment Date',
      field: 'paymentDate',
      renderCell: row => <TableData date={row.paymentDate} />,
    },
    { headerName: 'Gross amount', field: 'grossAmount' },
    { headerName: 'Discount', field: 'discountAmount' },
    { headerName: 'Processing fee', field: 'processingFee' },
    { headerName: 'Net amount', field: 'netAmount' },
    { headerName: 'Payment number', field: 'paymentNumber' },
    {
      headerName: 'Next payment date',
      field: 'nextBillingDate',
      renderCell: row => <TableData date={row.nextBillingDate} />,
    },
    // { headerName: 'Note', field: 'note' },
  ];

  return (
    <>
      <h1 className="mb-4 h-14 w-48 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
        {t('title')}
      </h1>

      <div
        className={classNames('grid w-full grid-cols-1 items-center justify-between md:flex', {
          'mb-4': filters.isFiltering,
          'mb-8 ': !filters.isFiltering,
        })}>
        <div className="mb-4 flex w-full flex-col items-end justify-between gap-3 sm:flex-row sm:items-center sm:gap-0 md:mb-0">
          <div className="flex items-center justify-between gap-4 md:mr-4 md:max-w-[500px]">
            <TextInput
              full
              adornments={{
                position: 'end',
                content: HiSearch,
              }}
              inputstyles="truncate ... md:min-w-[250px] sensitive"
              type="text"
              placeholder="Search by name, clinic, title"
              onChange={search.handleSearch}
            />

            <div className="h-5 w-1 border-l border-neutral-600" />

            <FilterDropdown
              {...filters}
              isFiltering={filters.isFiltering}
              state={filters.tempFilters}
              filters={filterConfig}
            />
          </div>
          <div className="flex justify-center gap-2.5">
            <Button onClick={exportCSV} color={'outlineOne'} size="sm" className="w-full md:w-[136px]">
              <TbFileImport className="mr-2 text-lg" />
              {t('exportCSV')}
            </Button>
          </div>
        </div>
      </div>

      {filters.isFiltering && (
        <div className="mb-4">
          <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filterConfig} />
        </div>
      )}

      <div className="mb-4 min-h-[20px]">
        {
          <div className="dark:br-[#212121] mt-2 flex w-auto flex-nowrap rounded-md bg-[#212121] px-2.5">
            <p className="mr-2 text-xs font-medium leading-[18px] text-gray-300">
              {selectedItemsStats} {totalSelectedItems > 0 && `| Total selected: ${totalSelectedItems}`}
            </p>
          </div>
        }
      </div>

      <div className="rounded-md bg-dark-grey-400 p-4 md:p-8">
        <DataGridTable
          checkboxSelection
          rows={billingsList?.items || []}
          columns={columns}
          isLoading={isBillingLoading}
          checkedIds={selectedItemsByPage[currentPage] || []}
          onCheck={onSelectRow}
          onCheckAll={onSelectAll}
        />

        {billingsList?.items.length ? (
          <div className="flex pt-5">
            <Pagination {...pagination} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Billing;
