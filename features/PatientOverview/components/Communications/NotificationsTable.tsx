import PatientComponentLayout from '@/features/PatientOverview/components/PatientComponentLayout';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import Pagination from '@/components/Pagination/Pagination';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { useTableControls } from '@/hooks/useTableControls';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import classNames from 'classnames';
import FilterBadges from '@/components/Filters/FilterBadges';
import { convertFilterToString } from '@/utils/filterUtils';
import { noticeStatusListFilter, noticeTypeListFilter } from '@/constants/filters';
import { noticeStatusList, noticeTypeList, noticeMethods } from '@/constants/billing';
import { useGetBillingNotifications } from '@/api/queries/notifications';
import useTranslation from 'next-translate/useTranslation';

const NotificationsTable = ({ patientId }: { patientId: string }) => {
  const { t } = useTranslation('billing');
  const [billingNotifications, setBillingNotifications] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState('All');
  const { filters, pagination, search, sort } = useTableControls(billingNotifications, {
    noticeType: '',
    method: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const { data, isLoading } = useGetBillingNotifications({
    patientId: patientId,
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    sort: sort.dataSort,
    filters: {
      type: convertFilterToString(filters.actualFilters.noticeType) || '',
      status: convertFilterToString(filters.actualFilters.status) || '',
      dateFrom: filters.actualFilters.dateFrom || '',
      dateTo: filters.actualFilters.dateTo || '',
      method: selectedMethod === 'All' ? '' : selectedMethod,
    },
  });

  useEffect(() => {
    if (!isLoading && data) {
      setBillingNotifications(data);
    }
  }, [isLoading, data]);

  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
  };

  const columns: Array<ColDefType & { show: boolean }> = [
    {
      headerName: 'Date',
      field: 'sentAt',
      renderCell: (row: any) => formatDataWithTime(row?.sentAt),
      sortable: true,
      show: true,
    },
    {
      headerName: 'Method',
      field: 'method',
      show: true,
    },
    {
      headerName: 'Notice Type',
      field: 'type',
      renderCell: (row: any) => {
        return noticeTypeList.find((item: any) => item.value === row.type)?.label;
      },
      show: true,
    },
    {
      headerName: 'Notice No.',
      field: 'noticeNumber',
      show: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      renderCell: (row: any) => {
        return noticeStatusList.find((item: any) => item.value === row.status)?.label || '-';
      },
      show: true,
    },
    {
      headerName: 'Sender',
      field: 'sender',
      show: true,
    },
  ].filter(filter => filter.show);

  const filtersConfig = [
    { type: 'select', value: 'noticeType', placeholder: 'Notice Type', options: noticeTypeListFilter },
    { type: 'select', value: 'status', placeholder: 'Status', options: noticeStatusListFilter },
    { type: 'date', value: 'dateFrom', placeholder: 'Date From', label: 'Date From' },
    { type: 'date', value: 'dateTo', placeholder: 'Date To', label: 'Date To' },
  ];

  return (
    <>
      <PatientComponentLayout col>
        <div className="mb-6 flex items-start">
          <span className="text-2xl font-normal text-white"> {t('billingNotifications')}</span>
        </div>
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
                  position: 'start',
                  content: HiSearch,
                }}
                inputstyles="truncate ... md:min-w-[250px] sensitive"
                type="text"
                placeholder="Search by date, method, notice type, status, sender"
                onChange={search.handleSearch}
              />

              <div className="h-5 w-1 border-l border-neutral-600" />

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
          <div className="mb-4">
            <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filtersConfig} />
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-4 pb-2 pl-2 text-gray-700 lg:gap-8">
          {noticeMethods.map(method => (
            <span
              key={method}
              onClick={() => handleMethodChange(method)}
              className={` text-sm font-medium ${
                selectedMethod === method
                  ? 'border-b-[1px] border-blue-600 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text font-medium text-transparent'
                  : 'cursor-pointer text-[#F9FAFB] hover:underline'
              }`}>
              {method}
            </span>
          ))}
        </div>

        {!!billingNotifications?.items?.length && (
          <div className="rounded-md bg-dark-grey-100 p-4 md:p-8">
            <DataGridTable
              rows={billingNotifications?.items || []}
              columns={columns}
              isLoading={isLoading}
              sortBy={sort.dataSort}
              changeSort={sort.changeSort}
            />
          </div>
        )}

        {!!billingNotifications?.items?.length && billingNotifications ? (
          <div className="flex justify-center pb-8">
            <Pagination {...pagination} />
          </div>
        ) : null}
      </PatientComponentLayout>
    </>
  );
};

export default NotificationsTable;
