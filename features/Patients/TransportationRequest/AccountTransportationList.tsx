import { useGetAccountById, useGetAccountsTransportationRequests } from '@/api/queries/account.queries';
import { useGetUsers } from '@/api/queries/user.queries';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { billedToFilter, billingStatusFilter, transportationStatusesFilter } from '@/constants/filters';
import { useScreenWidth } from '@/hooks';
import { useTableControls } from '@/hooks/useTableControls';
import { convertFilterToString } from '@/utils/filterUtils';
import { useUser } from '@auth0/nextjs-auth0/client';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { TransportationListMobile } from './TransportationListMobile';
import { TransportationListTable } from './TransportationListTable';

const AccountTransportationList = () => {
  const { t } = useTranslation('transportation');
  const { isSmallScreen } = useScreenWidth();
  const [transportationRequests, setTransportationRequests] = useState<any>(null);
  const { data: usersData } = useGetUsers();

  const { user } = useUser();
  const { data: account } = useGetAccountById(usersData?.accountId as string);
  const { filters, pagination, search } = useTableControls(transportationRequests, {
    BilledTo: '',
    BillingStatus: '',
    TransportationStatus: '',
  });

  const {
    data: transportationRequestsData,
    isLoading,
    mutate: refetchTransportationRequests,
  } = useGetAccountsTransportationRequests({
    id: usersData?.accountId,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    q: search.searchTerm,
    filters: {
      Payer: convertFilterToString(filters.actualFilters.BilledTo),
      PaymentStatus: convertFilterToString(filters.actualFilters.BillingStatus),
      TransportationStatus: convertFilterToString(filters.actualFilters.TransportationStatus),
    },
  });

  useEffect(() => {
    if (!isLoading && transportationRequestsData) {
      setTransportationRequests(transportationRequestsData);
    }
  }, [transportationRequestsData, isLoading]);

  const filterConfig = [
    {
      type: 'select',
      value: 'BilledTo',
      placeholder: 'Billed to',
      options: billedToFilter,
    },
    {
      type: 'select',
      value: 'BillingStatus',
      placeholder: 'Billing status',
      options: billingStatusFilter,
    },
    {
      type: 'select',
      value: 'TransportationStatus',
      placeholder: 'Transportation Status',
      options: transportationStatusesFilter,
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="mb-0 flex flex-col gap-4 text-[40px] font-light leading-[60px] md:mb-4 md:flex-row md:items-center">
          <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text pb-2 text-5xl text-transparent md:h-14">
            {account?.name}
          </p>
        </div>

        <p className="mb-0 w-72 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light text-transparent">
          {t('page_title')}
        </p>

        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center justify-between gap-4 md:mr-4 md:max-w-[500px]">
            <TextInput
              full
              adornments={{
                position: 'end',
                content: HiSearch,
              }}
              inputstyles="truncate ... md:min-w-[250px] sensitive"
              type="text"
              placeholder={t('search_transportation_placeholder') as string}
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

        {filters.isFiltering && (
          <div className="mb-2">
            <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filterConfig} />
          </div>
        )}

        <div className="rounded-md bg-dark-grey-400 p-4 md:p-8">
          <div className="table-header mb-4 flex flex-wrap items-center md:mb-4"></div>

          {!isSmallScreen && (
            <TransportationListTable
              requests={transportationRequests?.items || []}
              refetchTransportationRequests={refetchTransportationRequests}
              isLoading={isLoading}
            />
          )}

          {isSmallScreen && (
            <TransportationListMobile
              requests={transportationRequests?.items || []}
              refetchTransportationRequests={refetchTransportationRequests}
              userRole={usersData?.role}
            />
          )}

          {transportationRequests?.items.length ? <Pagination {...pagination} /> : null}
        </div>
      </div>
    </>
  );
};

export default AccountTransportationList;
