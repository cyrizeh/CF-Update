import usePickListMutation from '@/api/mutations/usePickListMutation';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import useRole from '@/hooks/useRole';
import dots from '@/public/icons/dots-vertical.svg';
import { ApiTypes } from '@/types';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import classNames from 'classnames';
import { Button, Dropdown } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';
import { PickListStatus, PickListStatusTitle, PickListType } from './PickListPage.constants';
import { buildRouteToClinicDetailsPage, buildRouteToPickListDetailsPage } from './PickListPage.utils';
import { pickListStatusesFilter, pickListTypesFilter } from '@/constants/filters';
import { useFilterAutocompleteOptions } from '@/utils/filterUtils';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';

type PickListPageProps = {
  pickList: ApiTypes.TransportationResponse | null;
  tableControls: any;
  isLoading: boolean;
  refetchData: any;
};

const PickListPage: React.FC<PickListPageProps> = ({ pickList, tableControls, isLoading, refetchData }) => {
  const { t } = useTranslation('pickList');
  const { roles } = useRole();
  const [openAlert, toggleAlert] = useState(false);
  const [activeId, setActiveId] = useState('');
  const { filters, pagination, search } = tableControls;

  const clinicsAutocomplete = useFilterAutocompleteOptions('/clinics', undefined, 'name');
  const adminsAutocomplete = useFilterAutocompleteOptions('/users/admins', undefined, 'email');
  const filterConfig = [
    {
      type: 'autocomplete',
      value: 'ClinicId',
      autocompleteData: clinicsAutocomplete,
      placeholder: 'Clinic Name',

      show: true,
    },
    {
      type: 'autocomplete',
      value: 'AssignedToEmail',
      autocompleteData: adminsAutocomplete,
      placeholder: 'Assigned To',
      show: true,
    },
    {
      type: 'select',
      value: 'Status',
      placeholder: 'Status',
      options: pickListStatusesFilter,
      show: true,
    },
    {
      type: 'select',
      value: 'Type',
      placeholder: 'Type',
      options: pickListTypesFilter,
      show: true,
    },
    {
      type: 'date',
      value: 'ScheduledDate',
      placeholder: 'Scheduled date',
      label: 'Scheduled date',
      show: true,
    },
    {
      type: 'date',
      value: 'Created',
      placeholder: 'Created date',
      label: 'Created date',
      show: true,
    },
  ].filter(filter => filter.show);

  const columns: ColDefType[] = [
    {
      headerName: 'Ticket',
      field: 'orderNumber',
      renderHeader: () => <p className="ml-10 w-full">{'Ticket'}</p>,
      renderCell: row => (
        <Link href={row.id ? buildRouteToPickListDetailsPage(row.id, roles) : ''}>
          <div className="flex max-w-[205px] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <Button size={'sm'} gradientDuoTone="primary" className="w-[140px]">
              <span className="w-[130px] truncate text-wrap px-2">{t('view_ticket')}</span>
            </Button>
          </div>
        </Link>
      ),
      align: 'left',
    },
    {
      headerName: 'Status',
      field: 'status',
      align: 'left',
      renderCell: row => (row?.status ? <span>{PickListStatusTitle[row?.status]}</span> : '-'),
    },
    {
      headerName: 'Sheduled date',
      field: 'scheduledDate',
      align: 'left',
      renderCell: row => (!!row?.scheduledDate ? formatDateWithSlashSeparator(row?.scheduledDate) : '-'),
    },
    {
      headerName: 'Type',
      field: 'type',
      align: 'left',
    },
    {
      headerName: 'Clinic',
      field: 'clinicName',
      align: 'left',
      renderCell: row =>
        row.clinicId ? (
          <Link href={row.clinicId ? buildRouteToClinicDetailsPage(row.clinicId, roles) : ''}>
            <div className="flex max-w-[205px] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
              <span className="w-[130px] truncate text-wrap hover:underline">{row?.clinicName || 'View Clinic'}</span>
            </div>
          </Link>
        ) : (
          <span className="w-[130px] truncate text-wrap">{row?.clinicName || '-'}</span>
        ),
      wrapText: true,
    },
    {
      headerName: 'Number of Canes',
      field: 'numberOfCanes',
      align: 'left',
    },
    { headerName: 'Assigned To', field: 'assignedToEmail' },
    {
      headerName: 'Created date',
      field: 'created',
      align: 'left',
      renderCell: row => (!!row?.created ? formatDateWithSlashSeparator(row?.created) : '-'),
    },
    {
      field: 'action',
      headerName: 'Action',
      align: 'left',
      renderCell: row =>
        row?.status !== PickListStatus.Completed &&
        row?.status !== PickListStatus.InProgress &&
        row?.type != PickListType.Create ? (
          <Dropdown
            label=""
            dismissOnClick={false}
            renderTrigger={() => (
              <div className="w-10 hover:cursor-pointer">
                <Image src={dots} alt="actions" />
              </div>
            )}>
            <div className="rounded-lg  bg-[#4F4F4F] p-[1px]">
              <Dropdown.Item className="hover:cursor-pointer" onClick={() => onOpenAlert(row?.id)}>
                <MdDelete />
                <p className="mx-2">{t('common:delete')}</p>
              </Dropdown.Item>
            </div>
          </Dropdown>
        ) : (
          <p className="flex w-[25px] items-center justify-center">{'-'}</p>
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

  const { deletePickList } = usePickListMutation();

  const onDeletePickList = () => {
    deletePickList
      .trigger({ pickListId: activeId })
      .then(() => {
        // @ts-ignore
        refetchData(undefined, { revalidate: true });
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      })
      .finally(() => {
        onCloseAlert();
      });
  };

  return (
    <>
      <h1 className="mb-4 h-14 w-[400px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
        {t('page_title')}
      </h1>

      <div
        className={classNames('flex w-full grid-cols-2 flex-wrap  items-start justify-between', {
          'mb-4': filters.isFiltering,
          'mb-8': !filters.isFiltering,
        })}>
        <div className="mb-4">
          <div className="flex items-center justify-between gap-4 md:mr-4 md:max-w-[500px]">
            <TextInput
              full
              adornments={{
                position: 'end',
                content: HiSearch,
              }}
              inputstyles="truncate ... md:min-w-[350px] sensitive"
              type="text"
              placeholder={t('search_pickList_placeholder') as string}
              onChange={search.handleSearch}
            />

            <div className="invisible h-5 border-r border-dark-grey-300 md:visible"></div>

            <FilterDropdown
              {...filters}
              isFiltering={filters.isFiltering}
              state={filters.tempFilters}
              filters={filterConfig}
            />
          </div>
        </div>
      </div>
      {filters.isFiltering && (
        <div className="mb-2">
          <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filterConfig} />
        </div>
      )}

      <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
        <DataGridTable columns={columns} rows={pickList?.items || []} isLoading={isLoading} />
        {pickList?.items?.length ? <Pagination {...pagination} /> : null}
      </div>
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseAlert}
        onConfirm={onDeletePickList}
        title={t('common:delete')}
        message={t('common:deleteConfirmation')}
      />
    </>
  );
};

export default PickListPage;
