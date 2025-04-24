import useTransportationMutation from '@/api/mutations/useTransportationMutation';
import { useGetTransportationPatients } from '@/api/queries/transportation.queries';
import Pagination from '@/components/Pagination/Pagination';
import PatientComponentLayout from '@/features/PatientOverview/components/PatientComponentLayout';
import { useTableControls } from '@/hooks/useTableControls';
import useToggleModal from '@/hooks/useToggleModal';
import { hasPermission } from '@/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import EditTrackingUrlModal from './EditTrackingUrlModal';
import PatientRequestsTable from './PatientRequestsTable';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const PatientRequests = ({ isReadonly }: { isReadonly?: boolean }) => {
  const [transportationRequests, setTransportationRequests] = useState<any>([]);
  const [selectedTransportationRequest, setSelectedTransportationRequest] = useState<any>();
  const { updateRequest } = useTransportationMutation();
  const router = useRouter();

  const { pagination: pagination } = useTableControls(transportationRequests, {});
  const { data, isLoading, mutate } = useGetTransportationPatients({
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    patientId: router?.query?.id as string,
  });

  useEffect(() => {
    if (data && !isLoading) {
      setTransportationRequests(data);
    }
  }, [data, isLoading]);
  const { isModalOpen: isEditModalOpen, onCloseModal: closeEditModal, onOpenModal: openEditModal } = useToggleModal();

  const { userPermissions } = usePermissions();
  const isUserCanAddTransportationPatient = hasPermission(userPermissions, 'create:transportations') && !isReadonly;

  const onActionClick = (item: any) => {
    setSelectedTransportationRequest(item);
    openEditModal();
  };

  return (
    <PatientComponentLayout col>
      {isUserCanAddTransportationPatient && (
        <>
          <EditTrackingUrlModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            updateDetails={updateRequest}
            requestId={selectedTransportationRequest?.id}
            refetchTransportations={() => {
              // @ts-ignore
              mutate(undefined, { revalidate: true });
            }}
          />
        </>
      )}
      {!!transportationRequests?.items?.length && (
        <div>
          <PatientRequestsTable
            transportationRequests={transportationRequests}
            isReadonly={isReadonly}
            onActionClick={onActionClick}
          />
          <div className="flex pt-8">
            {transportationRequests?.items?.length ? <Pagination {...pagination} /> : null}
          </div>
        </div>
      )}
    </PatientComponentLayout>
  );
};

export default PatientRequests;
