import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import DetailsCard from '../Transportation/DetailsCard';
import { transferOutStatuses, caneTransferStatuses } from '@/constants/transfers';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import {
  buildAdminCaneDetailsPageRoute,
  buildAdminInitialTransferDetailsPageRoute,
  buildAdminGeneralPatientPageRoute,
  buildClinicAdminInitialTransferDetailsPageRoute,
  buildClinicAdminPatientDetailsPageRoute,
} from '@/constants/buildRoutes';
import { toast } from 'react-toastify';
import { FaTruck } from 'react-icons/fa';
import { useGetToLocationByCane } from '@/api/queries/transfers.queries';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import useTransfersMutation from '@/api/mutations/useTransfersMutation';
import { formatDate } from '@/utils/formatDate';
import useToggleModal from '@/hooks/useToggleModal';
import Link from 'next/link';
import StatusPanel from './StatusPanel';
import UpdateCaneLocationModal from '../Specimens/UpdateCaneLocationModal';
import { useGetCaneById } from '@/api/queries/speciment.queries';
import { toPascalCase } from '@/utils/toPascalCase';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { NotFound } from '../NotFound/NotFound';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';

const RequestTransferOutOverview = ({ user }: { user: string }) => {
  const { t } = useTranslation('transfers');
  const router = useRouter();
  const [specimens, setSpecimens] = useState<any>(null);
  const [selectedCane, setSelectedCane] = useState<any>(null);
  const [status, setStatus] = useState('');
  const { updateLocationTransferStatus, confirmArrival } = useTransfersMutation();
  const { data: cane } = useGetCaneById(selectedCane?.id);
  const {
    data: specimensData,
    isLoading,
    mutate,
    error,
  } = useGetToLocationByCane({
    id: router.query.id as string,
  });

  useEffect(() => {
    if (!isLoading && specimensData) {
      setSpecimens(
        specimensData?.caneTransfers?.map((item: any) => {
          return {
            ...item,
            id: item.caneId,
            processed: item.status !== null,
          };
        })
      );

      setStatus(specimensData?.locationTransferStatus);
    }
  }, [specimensData, isLoading]);

  const {
    isModalOpen: isConfirmModalOpen,
    onCloseModal: onCloseConfirmModal,
    onOpenModal: onOpenConfirmModal,
  } = useToggleModal();

  const updateStatus = async (value: string) => {
    const updatedRequest = {
      transferId: router.query.id as string,
      status: value,
    };
    if (value === 'ReturnedToTanks' && specimens.filter((item: any) => item.status === null).length > 0) {
      toast.error('Please confirm receiving all canes to complete the transfer');
      return;
    }
    updateLocationTransferStatus({ ...updatedRequest })
      .then(() => {
        setStatus(value);
        mutate(undefined, { revalidate: true });
        toast.success('Transfer status updated successfully');
      })
      .catch(() => {
        toast.error('Error updating transfer status');
      });
  };

  const handleConfirmArrival = async (value?: string) => {
    await confirmArrival({
      slotId: value || '',
      caneId: selectedCane.id,
      transferId: router.query.id as string,
    })
      .then(() => {
        mutate(undefined, { revalidate: true });
        toast.success('Cane status updated successfully');
        onCloseConfirmModal();
      })
      .catch(() => {
        toast.error('Error updating status');
      });
  };

  const columns: ColDefType[] = [
    {
      headerName: t('table.patient'),
      field: 'patient.id',
      renderCell: row =>
        row.patient.id ? (
          <TableLink
            href={
              user === 'ClinicAdmin'
                ? buildClinicAdminPatientDetailsPageRoute(row.patient.id)
                : buildAdminGeneralPatientPageRoute(row.patient.id)
            }
            name={toPascalCase(row.patient.firstAndLast)}
            styles={{ name: 'sensitive' }}
          />
        ) : (
          <p className="sensitive">{toPascalCase(row.patient.firstAndLast)}</p>
        ),
    },
    {
      headerName: t('table.RFID'),
      field: 'rfid',
      renderCell: row =>
        row.caneId && user === 'Admin' ? (
          <TableLink href={buildAdminCaneDetailsPageRoute(row.caneId)} name={row?.rfid} />
        ) : (
          <p>{row?.rfid}</p>
        ),
    },
    {
      headerName: t('table.transferStatus'),
      field: 'status',
      renderCell: row => <p>{caneTransferStatuses.find(item => item.value === row.status)?.label || '-'}</p>,
    },
    {
      headerName: t('table.specimen'),
      field: 'specimenTypes',
      renderCell: row => (
        <div
          className="mr-2 flex items-center gap-2 overflow-hidden whitespace-pre-wrap"
          style={{ maxHeight: '4rem', position: 'relative' }}>
          <div className="overflow-hidden overflow-ellipsis">
            <p>{getSpecimenLabels(row.specimenTypes)}</p>
          </div>
        </div>
      ),
    },
    {
      headerName: t('table.facility'),
      field: 'facilityId',
      renderCell: row =>
        row.facilityId && user === 'Admin' ? (
          <TableLink href={`/admin/facilities/${row.facilityId}`} name={row.facilityName} />
        ) : (
          <p>{row.facilityName || '-'}</p>
        ),
    },
    { headerName: t('table.vault'), field: 'vault' },
    { headerName: t('table.Tank'), field: 'tank' },
    { headerName: t('table.Canister'), field: 'canister' },
    { headerName: t('table.Pie'), field: 'pie' },
    { headerName: t('table.Cane'), field: 'number' },
    { headerName: t('table.cane_description'), field: 'caneDescription' },
    user !== 'ClinicAdmin'
      ? {
          field: 'action',
          headerName: 'Action',
          align: 'center',
          renderCell: row => (
            <div className="flex flex-col gap-2">
              <Button
                gradientDuoTone="primary"
                className="cursor-pointer"
                disabled={row.status === 'ConfirmedArrival'}
                onClick={() => {
                  setSelectedCane(row);
                  onOpenConfirmModal();
                }}>
                Confirm
              </Button>{' '}
            </div>
          ),
        }
      : {
          field: 'action',
          headerName: null,
        },
  ];

  const shipmentInfo = [
    {
      name: 'Sending clinic',
      value: specimensData?.sendingClinicName || 'N/A',
    },
    {
      name: 'Shipment date',
      value: specimensData?.shipmentDate ? formatDateWithSlashSeparator(specimensData?.shipmentDate) : 'N/A',
    },
    {
      name: 'Number of canes',
      value: specimensData?.caneTransfers?.length || 'N/A',
    },
    {
      name: 'Created',
      value: specimensData?.created ? formatDateWithSlashSeparator(specimensData?.created) : 'N/A',
    },
  ];

  if (isLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );
  }

  if (error && error?.response?.status == NOT_FOUND_STATUS_CODE) {
    return <NotFound text={t('notFound:transferRequestNotFound')} />;
  }

  return (
    <div className="text-start">
      <div className="flex w-auto flex-row items-center justify-between md:mb-10">
        <h1 className="w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent  ">
          {`Transfer request`}
        </h1>
        {specimensData?.parentTransferId && (
          <Link
            href={
              user === 'ClinicAdmin'
                ? buildClinicAdminInitialTransferDetailsPageRoute(specimensData?.parentTransferId)
                : buildAdminInitialTransferDetailsPageRoute(specimensData?.parentTransferId)
            }>
            <div className="flex items-center gap-2 ">
              <span
                className={
                  'p-2 text-base font-light   font-light text-white transition hover:cursor-pointer hover:underline dark:text-gray-400 dark:hover:text-white'
                }>
                {' '}
                View initial request
              </span>
            </div>
          </Link>
        )}
      </div>

      <StatusPanel
        statuses={transferOutStatuses}
        status={status}
        handleChange={updateStatus}
        disabled={user === 'ClinicAdmin'}
      />
      <div className="mb-4 flex gap-6">
        <div className="flex w-full min-w-[400px] max-w-[490px] flex-col gap-4">
          <DetailsCard
            details={shipmentInfo}
            title="Shipment info"
            icon={<FaTruck />}
            isLoading={isLoading}></DetailsCard>
        </div>
      </div>
      <div className="row my-4 flex justify-between gap-6">
        <DataGridTable columns={columns} rows={specimens || []} isLoading={isLoading} />
      </div>
      <UpdateCaneLocationModal
        isOpen={isConfirmModalOpen}
        onClose={onCloseConfirmModal}
        canes={[selectedCane]}
        transferId={router.query.id as string}
        refetchCanesInfo={mutate}
        clinicName={specimensData?.clinicName}
        clinicId={specimensData?.clinicId}
        caneDetails={cane}
        onConfirm={handleConfirmArrival}
      />
    </div>
  );
};

export default RequestTransferOutOverview;
