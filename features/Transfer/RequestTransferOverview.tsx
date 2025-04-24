import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useMemo, useState } from 'react';
import DetailsCard from '../Transportation/DetailsCard';
import { caneTransferStatuses } from '@/constants/transfers';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import {
  buildAdminCaneDetailsPageRoute,
  buildAdminGeneralPatientPageRoute,
  buildClinicAdminPatientDetailsPageRoute,
} from '@/constants/buildRoutes';
import { FaTruck, FaRegChartBar, FaStickyNote } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useGetToClinicByCane } from '@/api/queries/transfers.queries';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import useTransfersMutation from '@/api/mutations/useTransfersMutation';
import { formatDate } from '@/utils/formatDate';
import useToggleModal from '@/hooks/useToggleModal';
import AddTransferModal from '../Specimens/AddTransferModal';
import _ from 'lodash';
import StatusPanel from './StatusPanel';
import { editDateSchema } from '@/validations/transportation';
import UpdateCaneLocationModal from '../Specimens/UpdateCaneLocationModal';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toPascalCase } from '@/utils/toPascalCase';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { NotFound } from '../NotFound/NotFound';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';

const RequestTransferOverview = ({ user }: { user: string }) => {
  const { t } = useTranslation('transfers');
  const [rowSelectionModel, setRowSelectionModel] = useState<Array<string>>([]);
  const router = useRouter();
  const [specimens, setSpecimens] = useState<any>(null);
  const { returnCanesToLocation, updateTransferStatus, thawCane } = useTransfersMutation();
  const [updatedTransferStatuses, setUpdatedTransferStatuses] = useState<any[]>([]);
  const {
    isModalOpen: isReturnModalOpen,
    onCloseModal: onCloseReturnModal,
    onOpenModal: onOpenReturnModal,
  } = useToggleModal();
  const {
    isModalOpen: isStayModalOpen,
    onCloseModal: onCloseStayModal,
    onOpenModal: onOpenStayModal,
  } = useToggleModal();
  const {
    isModalOpen: isThawedModalOpen,
    onCloseModal: onCloseThawedModal,
    onOpenModal: onOpenThawedModal,
  } = useToggleModal();

  const {
    data: specimensData,
    isLoading,
    mutate,
    error,
  } = useGetToClinicByCane({
    id: router.query.id as string,
  });

  useEffect(() => {
    if (!isLoading && specimensData) {
      setSpecimens(
        specimensData?.caneTransfers?.map((item: any) => {
          return {
            ...item,
            id: item.caneId,
            processed:
              item.status !== null ||
              specimensData?.clinicTransferStatus === 'Requested' ||
              specimensData?.clinicTransferStatus === 'InProgress' ||
              specimensData?.clinicTransferStatus === 'ReadyForShipment' ||
              specimensData?.clinicTransferStatus === 'Shipped' ||
              specimensData?.clinicTransferStatus === 'Completed',
          };
        })
      );

      setStatus(specimensData?.clinicTransferStatus);

      setUpdatedTransferStatuses([
        { label: 'Requested', value: 'Requested', disabled: true },
        { label: 'In Progress', value: 'InProgress', disabled: true },
        { label: 'Ready for shipment', value: 'ReadyForShipment', disabled: true },
        {
          label: 'Shipped',
          value: 'Shipped',
          disabled:
            user === 'ClinicAdmin' ||
            specimensData?.clinicTransferStatus === 'Requested' ||
            specimensData?.clinicTransferStatus === 'InProgress' ||
            specimensData?.clinicTransferStatus === 'Delivered' ||
            specimensData?.clinicTransferStatus === 'Shipped' ||
            specimensData?.clinicTransferStatus === 'InTreatment' ||
            specimensData?.clinicTransferStatus === 'Completed',
        },
        {
          label: 'Delivered',
          value: 'Delivered',
          disabled:
            specimensData?.clinicTransferStatus === 'Requested' ||
            specimensData?.clinicTransferStatus === 'InProgress' ||
            specimensData?.clinicTransferStatus === 'ReadyForShipment' ||
            specimensData?.clinicTransferStatus === 'Completed',
        },
        {
          label: 'In Treatment',
          value: 'InTreatment',
          disabled:
            specimensData?.clinicTransferStatus === 'Requested' ||
            specimensData?.clinicTransferStatus === 'InProgress' ||
            specimensData?.clinicTransferStatus === 'ReadyForShipment' ||
            specimensData?.clinicTransferStatus === 'Completed',
        },
        {
          label: 'Completed',
          value: 'Completed',
        },
      ]);
    }
  }, [specimensData, isLoading]);

  const [status, setStatus] = useState('');

  const selectedCanes = useMemo(() => {
    return specimens?.filter((item: any) => rowSelectionModel?.includes(item.id)) || [];
  }, [specimens, rowSelectionModel]);

  const updateStatus = async (value: string) => {
    const updatedRequest = {
      transferId: router.query.id as string,
      status: value,
    };
    if (value === 'Completed' && specimens.filter((item: any) => item.status === null).length > 0) {
      toast.error('Please update all canes status to complete the transfer');
      return;
    }
    updateTransferStatus({ ...updatedRequest })
      .then(() => {
        setStatus(value);
        mutate(undefined, { revalidate: true });
        toast.success('Transfer status updated successfully');
      })
      .catch(reason => {
        if (!_.isEmpty(reason?.response?.data?.errors)) {
          handleBackendErrors(reason.response.data.errors);
        } else if (!!reason?.response?.data?.detail) {
          toast.error(reason?.response?.data?.detail);
        }
      });
  };

  const handleThawCane = async (data: any) => {
    await thawCane({
      caneIds: rowSelectionModel,
      thawDate: data?.date ? formatDate(new Date(data?.date)) : '',
      transferId: router.query.id as string,
    })
      .then(() => {
        toast.success('Cane status updated successfully');
        mutate(undefined, { revalidate: true });
        onCloseThawedModal();
        setRowSelectionModel([]);
      })
      .catch((reason: any) => {
        if (reason?.response?.data) {
          handleBackendErrors(reason.response.data.errors);
        }
      });
  };

  const handleReturn = (data: any) => {
    const transfersDate = data?.date ? formatDate(new Date(data?.date)) : '';
    const transfers = {
      caneIds: rowSelectionModel,
      shipmentDate: transfersDate,
      transferId: router.query.id as string,
    };

    returnCanesToLocation(transfers)
      .then(() => {
        setRowSelectionModel([]);
        onCloseReturnModal();
        mutate(undefined, { revalidate: true });
      })
      .catch((reason: any) => {
        if (reason?.response?.data) {
          if (reason.response.data.detail) {
            toast.error(reason.response.data.detail);
          } else {
            handleBackendErrors(reason.response.data.errors);
          }
        }
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
          <TableLink href={buildAdminCaneDetailsPageRoute(row.caneId)} name={row.rfid || 'View Cane'} />
        ) : (
          <p>{row.rfid}</p>
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
  ];

  const shipmentInfo = [
    {
      name: 'Receiving clinic',
      value: specimensData?.clinicName || 'N/A',
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
    {
      name: 'Technical Specialist',
      value: specimensData?.techInitials || 'N/A',
    },
    {
      name: 'Created by',
      value: specimensData?.createdBy || 'N/A',
    },
  ];
  const transferInfo = [
    {
      name: 'Return to Cryofuture',
      value: `${specimensData?.returnedCount ?? ''}/${specimens?.length ?? ''}` || 'N/A',
    },
    {
      name: 'Stay in Clinic',
      value:
        `${specimens?.filter((item: any) => item.status === 'StayAtClinic').length ?? ''}/${specimens?.length ?? ''}` ||
        'N/A',
    },
    {
      name: 'Thawed',
      value: `${specimensData?.thawedCount ?? ''}/${specimens?.length ?? ''}` || 'N/A',
    },
  ];
  const onSelectRow = (id: string) => {
    const copied = [...rowSelectionModel];
    if (rowSelectionModel.includes(id)) {
      var index = copied.indexOf(id);
      if (index >= 0) copied.splice(index, 1);
      setRowSelectionModel(copied);
    } else setRowSelectionModel([...copied, id]);
  };

  const onSelectAll = () => {
    const copied = [...rowSelectionModel];
    const copiedData = [...specimens].filter(item => !item.processed).map(el => el.caneId);

    if (_.isEmpty(rowSelectionModel) || rowSelectionModel.length !== copiedData.length) {
      setRowSelectionModel(_.union(copied, copiedData));
    } else {
      setRowSelectionModel([]);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  if (error && error?.response?.status == NOT_FOUND_STATUS_CODE) {
    return <NotFound text={t('notFound:transferRequestNotFound')} />;
  }

  return (
    <div className="text-start">
      <h1 className="w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent md:mb-10 ">
        {`Transfer request`}
      </h1>
      <StatusPanel statuses={updatedTransferStatuses} status={status} handleChange={updateStatus} disabled={false} />
      <div className="mb-4 flex flex-col gap-6 sm:flex-row">
        <div className="flex w-full min-w-[400px] max-w-[490px] flex-col gap-4">
          <DetailsCard
            details={transferInfo}
            title="Transfer info"
            icon={<FaRegChartBar />}
            isLoading={isLoading}></DetailsCard>
        </div>
        <div className="flex w-full min-w-[400px] max-w-[490px] flex-col gap-4">
          <DetailsCard
            details={shipmentInfo}
            title="Shipment info"
            icon={<FaTruck />}
            isLoading={isLoading}></DetailsCard>
        </div>
      </div>
      {specimensData?.notes ? (
        <div className="mb-4 flex min-w-full max-w-[370px] flex-col  gap-3 rounded-md border border-transparent px-4 py-4 sm:px-8 sm:py-8 md:max-w-full dark:bg-[#1E2021]">
          <div className="flex items-center justify-start gap-3 text-white">
            <div className="ustify-center flex h-[25px] w-[25px]">{<FaStickyNote />}</div>
            <span className="text-2xl font-normal text-white">Notes</span>
          </div>
          <div
            key={specimensData?.id}
            className="my-2 flex justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
            <span className="overflow-wrap-all flex items-center text-sm font-normal text-[#828282]">
              {specimensData?.notes}
            </span>
          </div>
        </div>
      ) : null}

      <div className="mb-4 flex flex-row flex-wrap justify-end gap-2">
        <Button
          className="cursor-pointer"
          gradientDuoTone="primary"
          onClick={onOpenReturnModal}
          disabled={!rowSelectionModel.length}>
          Return to CryoFuture
        </Button>
        <Button
          className="cursor-pointer"
          gradientDuoTone="primary"
          disabled={!rowSelectionModel.length}
          onClick={() => {
            onOpenStayModal();
          }}>
          Stay at clinic
        </Button>
        <Button
          gradientDuoTone="primary"
          className="cursor-pointer"
          disabled={!rowSelectionModel.length}
          onClick={() => {
            onOpenThawedModal();
          }}>
          Mark as thawed
        </Button>
      </div>

      <div className="row my-4 flex justify-between gap-6">
        <DataGridTable
          checkboxSelection={true}
          checkedIds={rowSelectionModel}
          onCheck={onSelectRow}
          onCheckAll={onSelectAll}
          columns={columns}
          rows={specimens || []}
          isLoading={isLoading}
        />
      </div>
      <AddTransferModal
        isOpen={isReturnModalOpen}
        onClose={onCloseReturnModal}
        onConfirm={handleReturn}
        validationSchema={editDateSchema}
        title={'Transfer request'}
        message={`Please choose the shipment date for the ${rowSelectionModel.length} ${
          rowSelectionModel.length !== 1 ? 'selected canes' : 'selected cane.'
        }`}
      />
      <AddTransferModal
        isOpen={isThawedModalOpen}
        onClose={onCloseThawedModal}
        onConfirm={handleThawCane}
        validationSchema={editDateSchema}
        title={'Update cane status'}
        message={`Please select a date for marking the ${rowSelectionModel.length} ${
          rowSelectionModel.length !== 1 ? 'selected canes' : 'selected cane'
        }  as thawed.`}
      />
      <UpdateCaneLocationModal
        isOpen={isStayModalOpen}
        onClose={onCloseStayModal}
        canes={selectedCanes}
        transferId={router.query.id as string}
        refetchCanesInfo={mutate}
        clinicName={specimensData?.clinicName}
        clinicId={specimensData?.clinicId}
        // Todo: find better solution
        closeModalAndChangeState={() => {
          setRowSelectionModel([]);
        }}
      />
    </div>
  );
};

export default RequestTransferOverview;
