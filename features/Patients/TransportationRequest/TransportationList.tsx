import { useScreenWidth } from '@/hooks';
import Pagination from '@/components/Pagination/Pagination';
import { TransportationListTable } from './TransportationListTable';
import { TransportationListMobile } from './TransportationListMobile';
import { useTransportationContext } from '@/contexts/TransportationContext';

const TransportationList = () => {
  const { isSmallScreen } = useScreenWidth();

  const { transportationRequests, pagination, mutate, isLoading } = useTransportationContext();

  return (
    <div className="rounded-md bg-dark-grey-400">
      {!isSmallScreen && (
        <TransportationListTable
          requests={transportationRequests?.items || []}
          refetchTransportationRequests={mutate}
          isLoading={isLoading}
        />
      )}

      {isSmallScreen && (
        <TransportationListMobile
          requests={transportationRequests?.items || []}
          refetchTransportationRequests={mutate}
        />
      )}

      {transportationRequests?.items.length ? <Pagination {...pagination} /> : null}
    </div>
  );
};

export default TransportationList;
