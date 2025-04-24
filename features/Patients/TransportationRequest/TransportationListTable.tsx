import useTransportationMutation from '@/api/mutations/useTransportationMutation';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import CustomSelect from '@/components/Forms/Select/Select';
import { transportationStatuses } from '@/constants/states';
import useRole from '@/hooks/useRole';
import { ViewTypes } from '@/types';
import { hasPermission, isUserAccountAdmin, isUserAdmin, isUserClinicAdmin, isUserGodAdmin } from '@/utils';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { Button, Dropdown } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import useToggleModal from '@/hooks/useToggleModal';
import PencilAlt from '@/public/icons/PencilAlt';
import dots from '@/public/icons/dots-vertical.svg';
import Image from 'next/image';
import TransportationModal from '../TransportationModal/TransportationModal';
import { RequestCreationStep } from '@/types/Patients.enum';
import { toPascalCase } from '@/utils/toPascalCase';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

type TransportationListTableProps = {
  requests: ViewTypes.TransportationRequest[];
  refetchTransportationRequests: any;
  isLoading?: boolean;
};

export const TransportationListTable = ({
  requests,
  refetchTransportationRequests,
  isLoading,
}: TransportationListTableProps) => {
  const { roles } = useRole();
  const isClinicAdmin = isUserClinicAdmin(roles);
  const isNetworkAdmin = isUserAccountAdmin(roles);
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);

  const { t } = useTranslation('transportation');
  const {
    onOpenModal: onOpenTransportationModal,
    isModalOpen: isOpenTransportationModal,
    onCloseModal: onCloseTransportationModal,
  } = useToggleModal();

  const [openAlert, toggleAlert] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [isLastDraftRequest, setIsLastDraftRequest] = useState(false);
  const [
    isSelectedTransportaionRequestPatientIsTransportaion,
    setIsSelectedTransportaionRequestPatientIsTransportaion,
  ] = useState(false);

  const { userPermissions } = usePermissions();
  const isUserCanDeleteTransportations =
    hasPermission(userPermissions, 'create:transportations') && (isCryoAdmin || isNetworkAdmin);

  const { updateRequestStatus } = useTransportationMutation();
  const { deleteTransportationRequest } = useTransportationMutation();
  const onDeleteTransportationRequest = () => {
    deleteTransportationRequest
      .trigger({ transportationRequestId: activeId })
      .then(() => {
        // @ts-ignore
        refetchTransportationRequests(undefined, { revalidate: true });
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

  const handleChange = async (statuses: { value: string; label: string }[], id: string) => {
    const updatedRequest = {
      transportationStatuses: statuses.map(status => status.value),
      transportationRequestId: id,
    };
    updateRequestStatus({ ...updatedRequest })
      .then(() => {
        refetchTransportationRequests(undefined, { revalidate: true });
        toast.success('Transportation status updated successfully!');
      })
      .catch(() => {
        toast.error('Error updating transportation  status');
      });
  };

  const columns = [
    {
      headerName: 'Ticket number',
      field: 'orderNumber',
      renderCell: (row: any) =>
        isClinicAdmin ? (
          <span>{row.orderNumber || '-'}</span>
        ) : (
          <Link
            href={
              isNetworkAdmin ? `/account/transportation/request/${row.id}` : `/admin/transportation/request/${row.id}`
            }>
            <div className="flex max-w-[205px] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
              <Button size={'sm'} gradientDuoTone="primary" className="w-[140px]">
                <span className="w-[130px] truncate text-wrap px-2">{`View ticket ${row.orderNumber || ''}`}</span>
              </Button>
            </div>
          </Link>
        ),
      align: 'left',
      show: true,
    },
    {
      headerName: 'Patient',
      field: 'patient.id',
      renderCell: (row: any) =>
        row.patient?.id ? (
          <Link
            href={
              isNetworkAdmin
                ? `/account/transportation/${row.patientId}`
                : isClinicAdmin
                ? `/clinic/transportation/${row.patientId}`
                : `/admin/transportation/${row.patientId}`
            }>
            <div className="flex max-w-[205px] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
              <span className="sensitive overflow-ellipsis">{toPascalCase(row.patient.fullName)}</span>
            </div>
          </Link>
        ) : (
          <span>{row.patient.id}</span>
        ),
      align: 'left',
      show: true,
      wrapText: true,
    },
    {
      headerName: 'Transportation Status',
      field: 'transportationStatuses',
      renderCell: (row: any) => (
        <td className="min-w-[220px]">
          {isNetworkAdmin || isClinicAdmin ? (
            <div className="flex flex-wrap items-center gap-2 overflow-auto">
              {row.transportationStatuses
                ?.map((value: string) => transportationStatuses.find((status: any) => status.value === value)?.label)
                .join(', ')}
            </div>
          ) : (
            <CustomSelect
              isMulti
              options={transportationStatuses}
              value={row.transportationStatuses?.map((value: string) => ({
                value: value,
                label: transportationStatuses.find((status: any) => status.value === value)?.label,
              }))}
              placeholder={'Select status...'}
              onChange={e => handleChange(e, row.id)}
            />
          )}
        </td>
      ),
      align: 'left',
      show: true,
      wrapText: true,
    },
    {
      headerName: 'Creation date',
      field: 'created',
      renderCell: (row: any) => (row.created ? <span>{formatDataWithTime(row.created)}</span> : '-'),
      align: 'left',
      show: true,
    },
    {
      headerName: 'Shipper number',
      field: 'shipperNumber',
      align: 'left',
      show: true,
    },
    {
      headerName: 'Shipment sent date',
      field: 'shipmentSentDate',
      renderCell: (row: any) =>
        row.shipmentSentDate ? <span>{formatDateWithSlashSeparator(row.shipmentSentDate)}</span> : '-',
      align: 'left',
      show: true,
    },
    {
      headerName: 'Shipment received date',
      field: 'shipmentReceivedDate',
      renderCell: (row: any) =>
        row.shipmentSentDate ? <span>{formatDateWithSlashSeparator(row.shipmentReceivedDate)}</span> : '-',
      align: 'left',
      show: true,
    },
    {
      headerName: 'Shipment received date',
      field: 'shipmentReceivedDate',
      renderCell: (row: { shipmentSentDate: any; shipmentReceivedDate: string }) =>
        row.shipmentSentDate ? <span>{formatDateWithSlashSeparator(row.shipmentReceivedDate)}</span> : '-',
      align: 'left',
    },
    {
      headerName: 'Sending Clinic',
      field: 'sendingClinicName',
      align: 'left',
      wrapText: true,
      show: true,
    },
    {
      headerName: 'Receiving Clinic',
      field: 'receivingClinicName',
      align: 'left',
      wrapText: true,
      show: true,
    },
    {
      headerName: 'Billed to',
      field: 'payer',
      align: 'left',
      show: true,
    },
    {
      headerName: 'Billing Status',
      field: 'paymentStatus',
      align: 'left',
      show: true,
    },
    {
      headerName: 'Witness',
      field: 'witnessEmail',
      align: 'left',
      show: isCryoAdmin,
    },
    {
      field: 'action',
      headerName: 'Action',
      align: 'center',
      renderCell: (row: any) => (
        <Dropdown
          label=""
          dismissOnClick={false}
          renderTrigger={() => (
            <div className="w-10 hover:cursor-pointer">
              <Image src={dots} alt="actions" />
            </div>
          )}>
          <div className="rounded-lg  bg-[#4F4F4F] p-[1px]">
            {isCryoAdmin && (
              <Dropdown.Item
                className="hover:cursor-pointer"
                onClick={() => {
                  setActiveId(row.id);
                  onOpenTransportationModal();
                }}>
                <PencilAlt />
                <p className="hover:bg-blue mx-2">Edit request</p>
              </Dropdown.Item>
            )}
            {isUserCanDeleteTransportations && row.status === 'Draft' ? (
              <Dropdown.Item className="hover:cursor-pointer" onClick={() => onOpenAlert(row)}>
                <MdDelete />
                <p className="mx-2">Delete request</p>
              </Dropdown.Item>
            ) : null}
          </div>
        </Dropdown>
      ),
      show: isCryoAdmin,
    },
  ].filter(filter => filter.show);

  const onOpenAlert = (row: any) => {
    setActiveId(row.id);
    toggleAlert(true);
    setIsLastDraftRequest(row?.isLastDraftRequest);
    setIsSelectedTransportaionRequestPatientIsTransportaion(row?.patient?.patientType === 'Transportation');
  };

  const onCloseAlert = () => {
    toggleAlert(false);
    setActiveId('');
    setIsLastDraftRequest(false);
    setIsSelectedTransportaionRequestPatientIsTransportaion(false);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseAlert}
        onConfirm={onDeleteTransportationRequest}
        isLoading={deleteTransportationRequest?.isMutating}
        title={t('common:delete')}>
        <>
          {
            // check if it is a last draft request
            !!isLastDraftRequest && isSelectedTransportaionRequestPatientIsTransportaion ? (
              <div className="text-start text-lg font-light text-white">
                <p className="mb-2">{t('deleteModal.lastItem')}</p>
                <p>{t('deleteModal.lastItem2')}</p>
              </div>
            ) : (
              <p className="text-start text-lg font-light text-white">{t('deleteModal.general')}</p>
            )
          }
        </>
      </ConfirmationModal>
      <DataGridTable columns={columns} rows={requests || []} isLoading={isLoading} />
      {isOpenTransportationModal ? (
        <TransportationModal
          isOpen={isOpenTransportationModal}
          onClose={onCloseTransportationModal}
          isEditMode={true}
          refetchTransportationRequests={refetchTransportationRequests}
          transportationRequestData={{
            requestId: activeId,
            patientId: requests.find(request => request.id === activeId)?.patientId,
            hasPartner: Boolean(requests.find(request => request.id === activeId)?.partnerId),
            requestCreationStep: RequestCreationStep.PatientAssigned,
          }}
        />
      ) : null}
    </>
  );
};
