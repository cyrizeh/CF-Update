import { Spinner, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import DetailsCard from '../Transportation/DetailsCard';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { FaUser, FaVial } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import useToggleModal from '@/hooks/useToggleModal';
import _ from 'lodash';
import { useGetTerminationRequestsById } from '@/api/queries/termination.queries';
import Link from 'next/link';
import { terminationStatuses } from '@/constants/terminations';
import { MdDriveFolderUpload } from 'react-icons/md';
import AddAttachment from './AddAttachment';
import useTerminationsMutation from '@/api/mutations/useTerminationsMutation';
import TerminationNotes from './TerminationNotes';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import useTranslation from 'next-translate/useTranslation';
import { NotFound } from '../NotFound/NotFound';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';

const TerminationRequestOverview = () => {
  const { t } = useTranslation('terminations');
  const router = useRouter();
  const [specimens, setSpecimens] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [statuses, setStatuses] = useState<string[]>([]);

  const { cancelTerminatinRequest, updateRequestStatus } = useTerminationsMutation();

  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const {
    isModalOpen: isAttachModalOpen,
    onCloseModal: onCloleAttachModal,
    onOpenModal: onOpenAttachModal,
  } = useToggleModal();

  const {
    data: terminationRequestData,
    isLoading,
    mutate,
    error,
  } = useGetTerminationRequestsById({
    id: router.query.id as string,
  });

  useEffect(() => {
    if (!isLoading && terminationRequestData) {
      setSpecimens(
        terminationRequestData?.specimenTerminations?.map((item: any) => {
          return {
            ...item,
          };
        })
      );

      setStatuses(terminationRequestData?.terminationStatuses);
    }
  }, [terminationRequestData, isLoading]);

  const updateStatus = async (value: string) => {
    if (value === 'Cooldown' && !specimens.every((specimen: any) => specimen.notarizedFile)) {
      toast.warning('Please attach files for all specimen types');
      return;
    }
    const statusesUpdated = statuses.includes(value)
      ? statuses.filter((status: string) => status !== value)
      : [...statuses, value];

    const updatedRequest = {
      terminationStatuses: statusesUpdated,
      terminationRequestId: router.query.id as string,
    };
    updateRequestStatus({ ...updatedRequest })
      .then(() => {
        toast.success('Termination status updated successfully');
        setStatuses(statusesUpdated);
      })
      .catch(error => {
        toast.error('Error updating Termination  status');
      });
  };

  const onCancel = () => {
    cancelTerminatinRequest({
      id: router.query.id as string,
    })
      .then(() => {
        toast.success('Request closed successfully');
        // @ts-ignore
        mutate(undefined, { revalidate: true });
      })
      .catch((reason: any) => {
        if (reason?.response?.data) {
          toast.error(reason.response.data?.errors?.CaneIds[0]);
        }
      })
      .finally(() => {
        onCloseModal();
      });
  };

  const patientInfo = [
    {
      name: 'Name',
      value: (
        <Link
          className="sensitive hover:underline"
          href={`/admin/transportation/${terminationRequestData?.patient?.id}`}>
          {terminationRequestData?.patient?.firstName} {terminationRequestData?.patient?.lastName}
        </Link>
      ),
    },
    {
      name: 'Email',
      value: <div className="sensitive">{terminationRequestData?.patient?.email}</div>,
    },
  ];

  const requestInfo = [
    {
      name: 'Created',
      value: formatDateWithSlashSeparator(terminationRequestData?.created) || 'N/A',
    },
    {
      name: 'Stored At',
      value: terminationRequestData?.facilityName || 'N/A',
    },
    {
      name: 'Clinic',
      value: terminationRequestData?.clinicName || 'N/A',
    },
  ];

  const columns: ColDefType[] = [
    {
      headerName: 'Specimen Type',
      field: 'specimenType',
      renderCell: row => <span>{getSpecimenLabels(row.specimenType)}</span>,
    },
    {
      headerName: 'Termination Type',
      field: 'terminationType',
      renderCell: row => <span>{row.terminationType}</span>,
    },
    {
      headerName: 'Quantity',
      field: 'specimenTerminationQty',
    },
    {
      headerName: 'File',
      field: 'fileName',
      renderCell: row => (
        <td className="min-w-[220px] ">
          <div
            className="flex items-center gap-2 overflow-hidden whitespace-pre-wrap pr-2"
            style={{ maxHeight: '4rem', position: 'relative' }}>
            <div className="overflow-hidden overflow-ellipsis pr-2">{row.notarizedFile?.fileName}</div>
          </div>
        </td>
      ),
    },
    {
      headerName: 'Attach File',
      field: 'file',
      align: 'left',
      renderCell: row => (
        <td className="max-w-[220px] ">
          <MdDriveFolderUpload
            className={`cursor-pointer ${!!row?.notarizedFile ? 'pointer-events-none text-gray-400' : ''}`}
            onClick={() => {
              setSelectedItem(row.id);
              onOpenAttachModal();
            }}
          />
        </td>
      ),
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
    return <NotFound text={t('notFound:terminationNotFound')} />;
  }

  return (
    <div className="text-start">
      <div className="flex flex-row justify-between">
        <h1 className="w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent md:mb-10 ">
          {t('title')}
        </h1>
        <Button
          gradientDuoTone="primary"
          disabled={statuses.includes('Completed') || statuses.includes('Cancelled')}
          outline
          onClick={onOpenModal}>
          {t('cancelRequest')}
        </Button>
      </div>
      <div className="text-md mb-4 flex min-w-full max-w-[70px] flex-col items-center gap-3 rounded-md border border-transparent p-4 text-center sm:p-8 md:max-w-full dark:bg-[#1E2021]">
        <ol className="flex w-full flex-col flex-wrap items-start gap-1 space-y-4 border-gray-900 text-gray-500 sm:flex sm:space-x-8 sm:space-y-0 md:flex-row rtl:space-x-reverse">
          {terminationStatuses.map(({ label, value }, index) => (
            <li
              key={index}
              className={classNames('flex items-center space-x-2.5 ', {
                'bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text font-light text-transparent':
                  statuses?.includes(value),
              })}>
              <button
                disabled={value === 'Cancelled' || (value === 'Completed' && statuses?.includes('Cancelled'))}
                className="font-medium leading-tight"
                onClick={e => updateStatus(value)}>
                <div className="flex gap-2">
                  <span
                    className={classNames('flex h-8 w-8 shrink-0  items-center justify-center rounded-full border-2', {
                      'border-cryo-blue': statuses?.includes(value),
                      'border-gray-500': !statuses?.includes(value),
                    })}>
                    {statuses?.includes(value) && (
                      <svg
                        className={classNames('h-3.5 w-3.5', {
                          'text-cyan-300 ': statuses?.includes(value),
                        })}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12">
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                    )}
                  </span>
                  <span>{label}</span>
                </div>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="mb-4 flex gap-6">
        <div className="flex w-full min-w-[400px] max-w-[490px] flex-col gap-4">
          <DetailsCard details={requestInfo} title="Termination request details" icon={<FaVial />}></DetailsCard>
        </div>
        <div className="flex w-full min-w-[400px] max-w-[490px] flex-col gap-4">
          <DetailsCard details={patientInfo} title="Patient info" icon={<FaUser />}></DetailsCard>
        </div>
      </div>
      <div className="row my-4 flex justify-between gap-6">
        <DataGridTable columns={columns} rows={specimens || []} isLoading={isLoading} />
      </div>
      <div className="row my-8">
        <TerminationNotes
          notes={terminationRequestData?.notes}
          title={'Notes'}
          terminationRequestId={router.query.id as string}
          refetchNotes={mutate}
        />
      </div>
      <AddAttachment
        isOpen={isAttachModalOpen}
        onClose={onCloleAttachModal}
        id={selectedItem}
        terminationRequestId={router.query.id as string}
        onSubmit={() => {
          mutate(undefined, { revalidate: true });
        }}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        title={'Cancel termination request'}
        message={'Are you sure you want to cancel this request?'}
        onClose={onCloseModal}
        onConfirm={onCancel}
        cancelButtonText={t('common:close')}
      />
    </div>
  );
};

export default TerminationRequestOverview;
