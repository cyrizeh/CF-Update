import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import { NotificationsResponse } from '@/types/api';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';

import { useGetNotifications } from '@/api/queries/notifications.queries';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import { NotificationsTypeSelectFilter } from '@/constants/filters';
import { NotificationsTypeTableMapper, NotificationType } from '@/constants/notifications';
import { convertFilterToString } from '@/utils/filterUtils';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import classNames from 'classnames';
import { buildAdminGeneralPatientPageRoute } from '@/constants/buildRoutes';
import { toPascalCase } from '@/utils/toPascalCase';

const ReadNotifications = () => {
  const { t } = useTranslation('notifications');

  const [notifications, setNotifications] = useState<null | NotificationsResponse>(null);
  const { filters, pagination, search } = useTableControls(notifications, {
    type: '',
  });

  const { data: notificationsData, isLoading } = useGetNotifications({
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    isRead: true,
    filters: {
      Type: convertFilterToString(filters.actualFilters.type),
    },
  });

  useEffect(() => {
    if (!isLoading && notificationsData) {
      setNotifications(notificationsData);
    }
  }, [isLoading, notificationsData]);

  const filtersConfig = [
    {
      type: 'select',
      value: 'type',
      placeholder: 'Notification Type',
      options: NotificationsTypeSelectFilter,
    },
  ];

  const columns: ColDefType[] = [
    {
      headerName: t('table.patient'),
      field: 'patient.id',
      renderCell: row =>
        row.patient.id ? (
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
      headerName: t('table.creation_date'),
      field: 'created',
      renderCell: row => <span className="text-sm font-normal text-gray-300">{formatDataWithTime(row.created)}</span>,
    },
    {
      headerName: t('table.type'),
      field: 'type',
      renderCell: row => (
        <span className="text-sm font-normal text-gray-300">
          {NotificationsTypeTableMapper[row.type as NotificationType]}
        </span>
      ),
    },
    {
      headerName: t('table.requested_by'),
      field: 'requestedBy',
      renderCell: row => (
        <span className="text-sm font-normal text-gray-300">
          {row.type === NotificationType.TransportationRequested ? row.requestedBy : `Patient`}
        </span>
      ),
      wrapText: true,
    },
    { headerName: t('table.processed_by'), field: 'processedBy' },
    {
      headerName: t('table.link'),
      field: 'entityId',
      renderCell: row =>
        row.entityId ? (
          <TableLink
            href={
              row.type === NotificationType.TransportationRequested
                ? `/admin/transportation/request/${row.entityId}`
                : `/admin/terminations/${row.entityId}`
            }
            name={t('table.request_link')}
            styles={{ name: 'sensitive' }}
          />
        ) : (
          <p className="sensitive">{row.entityId}</p>
        ),
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
              placeholder={t('searchBar')}
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
        <DataGridTable columns={columns} rows={notifications?.items || []} isLoading={isLoading} />

        {notifications?.items.length ? <Pagination {...pagination} /> : null}
      </div>
    </>
  );
};

export default ReadNotifications;
