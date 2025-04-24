import usePickListMutation from '@/api/mutations/usePickListMutation';
import useReadersMutation from '@/api/mutations/useReaderMutation';
import { useGetReaders } from '@/api/queries/reader.queries';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { TableLink } from '@/components/DataGrid/TableComponents';
import { buildAdminClinicDetailsPageRoute, buildAdminFacilityDetailsPageRoute } from '@/constants/buildRoutes';
import { PickUpCaneStatusTitle } from '@/constants/specimens';
import { useCryoGattContext } from '@/contexts/CryoGattContext/CryoGattContext';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import useRole from '@/hooks/useRole';
import useToggleModal from '@/hooks/useToggleModal';
import dots from '@/public/icons/dots-vertical.svg';
import { Cane } from '@/types/view/Specimen.interface';
import { conditionComponent } from '@/utils/conditionComponent';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toPascalCase } from '@/utils/toPascalCase';
import classNames from 'classnames';
import { Button, Dropdown } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaPlus, FaTruck } from 'react-icons/fa';
import { MdDelete, MdOutlineQrCodeScanner } from 'react-icons/md';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';
import PickListAssignToModal from './PickListAssignToModal';
import PickListChooseReaderModal from './PickListChooseReader';
import { PickListStatus, PickListType, PickUpCaneStatus, pickListStatuses } from './PickListPage.constants';
import {
  buildRouteToCaneDetailsPage,
  buildRouteToPatientPage,
  useGetPickListDetailsPageColumn,
} from './PickListPage.utils';
import AddCaneLocationModal from './SetLocationModal/AddCaneLocationModal';

type RequestOverviewProps = {
  request: any;
  isLoading: boolean;
  refetchPickListDetails: KeyedMutator<any>;
  selectedReader: string | null;
  setSelectedReader: Dispatch<SetStateAction<string | null>>;
  isScanning: boolean;
};
const PickListDetailsPage = ({
  request,
  isLoading,
  refetchPickListDetails,
  selectedReader,
  setSelectedReader,
  isScanning,
}: RequestOverviewProps) => {
  // utils
  const { t } = useTranslation('pickList');
  const { roles } = useRole();
  const { firstColumn, secondColumn } = useGetPickListDetailsPageColumn(request);

  // states
  const [statuses, setStatuses] = useState<string[]>([]);
  const [isCurrentAdminAssignTo, setIsCurrentAdminAssignTo] = useState<boolean>(false);
  const [activeId, setActiveId] = useState('');
  const [activeCane, setActiveCane] = useState<Cane | null>(null);
  const { userData } = useGetCurrentUser();
  const [readerName, setReaderName] = useState('');
  const [readersList, setReadersList] = useState([]);
  const [pickList, setPickList] = useState<any[]>([]);

  // filtered statuses
  const filteredStatuses =
    request.type === PickListType.Create
      ? pickListStatuses.filter(status => status.value !== 'Requested')
      : pickListStatuses;

  // table columns
  const columns: ColDefType[] = [
    {
      headerName: t('table.patient'),
      field: 'patient.id',
      renderCell: row =>
        row.patientId ? (
          <TableLink
            href={buildRouteToPatientPage(row.patientId, roles)}
            name={toPascalCase(row.patientName) || 'View Patient'}
            styles={{ name: 'sensitive' }}
          />
        ) : (
          <p>{'-'}</p>
        ),
    },
    {
      headerName: t('table.RFID'),
      field: 'rfid',
      renderCell: row =>
        row.id ? (
          <TableLink href={buildRouteToCaneDetailsPage(row.id, roles)} name={row.rfid || 'View Cane'} />
        ) : (
          <p>{row.rfid || '-'}</p>
        ),
    },
    {
      headerName: t('table.pickUpStatus'),
      field: 'pickUpStatus',
      renderCell: row => (row.pickUpStatus ? PickUpCaneStatusTitle[row.pickUpStatus as PickUpCaneStatus] : '-'),
    },
    {
      headerName: t('table.clinicName'),
      field: 'clinicId',
      renderCell: row =>
        row.clinicId ? (
          <TableLink href={buildAdminClinicDetailsPageRoute(row.clinicId)} name={row.clinicName || 'View Clinic'} />
        ) : (
          <p>{row.clinicName || '-'}</p>
        ),
      wrapText: true,
    },
    {
      headerName: t('table.specimen'),
      field: 'specimenType',
      renderCell: row => (row.specimenTypes?.length ? getSpecimenLabels(row.specimenTypes) : '-'),
      wrapText: true,
    },
    {
      headerName: t('table.facility'),
      field: 'facilityId',
      renderCell: row =>
        row.facilityId ? (
          <TableLink
            href={buildAdminFacilityDetailsPageRoute(row.facilityId)}
            name={row.facilityName || 'View Facility'}
          />
        ) : (
          <p>{row.facilityName || '-'}</p>
        ),
      wrapText: true,
    },
    { headerName: t('table.vault'), field: 'vault' },
    { headerName: t('table.Tank'), field: 'tank' },
    { headerName: t('table.Canister'), field: 'canister' },
    { headerName: t('table.Pie'), field: 'pie' },
    {
      headerName: t('table.cane_Num'),
      field: 'number',
      renderCell: row => (!!Number(row?.number) ? row?.number : '-'),
    },
    {
      headerName: t('table.cane_color'),
      field: 'description',
    },
    { headerName: t('table.caneLabel'), field: 'label' },
    { headerName: t('table.idLabResult'), field: 'idLabResult' },
    {
      headerName: t('table.FDAEligibility'),
      field: 'fdaEligibility',
    },
    {
      headerName: t('table.reactivity'),
      field: 'reactivity',
      renderCell: row => conditionComponent(row.reactivity),
    },
    { headerName: t('table.reactive'), field: 'reactiveStatus' },
    {
      field: 'action',
      headerName: 'Action',
      align: 'center',
      renderCell: row => (
        <Dropdown
          label=""
          dismissOnClick={false}
          renderTrigger={() => (
            <div className="w-10 hover:cursor-pointer">
              <Image src={dots} alt="actions" />
            </div>
          )}>
          <div className="rounded-lg  bg-[#4F4F4F] p-[1px]">
            {request.type !== PickListType.Create && (
              <Dropdown.Item
                className="hover:cursor-pointer"
                onClick={() => {
                  // Check if the cane has already been withdrawn
                  if (row.pickUpStatus === PickUpCaneStatus.Withdrawn) {
                    const msg = t('errors.caneIsWithDrawn');
                    toast.error(msg);
                    return;
                  }

                  // Ensure the cane is assigned and the current admin is allowed to withdraw
                  if (!request?.assignedTo || !isCurrentAdminAssignTo) {
                    const msg = t('errors.assignToYourself');
                    toast.error(msg);
                    return;
                  }

                  // Open the withdraw modal if all checks pass
                  openWithDrawModal(row?.id || '');
                }}
                size={'sm'}>
                <MdOutlineQrCodeScanner />
                <p className="hover:bg-blue mx-2">{t('withdraw')}</p>
              </Dropdown.Item>
            )}

            {request.type === PickListType.Create &&
              request?.status !== PickListStatus.Completed &&
              !Number(row?.number) && (
                <Dropdown.Item
                  className="hover:cursor-pointer"
                  onClick={() => {
                    openAddLocationModal(row);
                  }}
                  size={'sm'}>
                  <FaPlus />
                  <p className="hover:bg-blue mx-2">{'Add location'}</p>
                </Dropdown.Item>
              )}

            {request.type === PickListType.Create && (
              <Dropdown.Item className="hover:cursor-pointer" onClick={() => openDeleteModal(row.id)}>
                <MdDelete />
                <p className="mx-2">Delete</p>
              </Dropdown.Item>
            )}
          </div>
        </Dropdown>
      ),
    },
  ];

  // apis
  const { canUseScanner } = useCryoGattContext();
  const { data: readers } = useGetReaders(canUseScanner);
  const { withDrawPickList, assignPickList, deleteCaneFromPickList } = usePickListMutation();
  const { getReaderTag } = useReadersMutation();

  // modal states
  const {
    isModalOpen: isModalWithDrawPickListOpen,
    onCloseModal: onCloseWithDrawPickListModal,
    onOpenModal: onOpenWithDrawPickListModal,
  } = useToggleModal();

  const {
    isModalOpen: isModalInitiateScanerOpen,
    onCloseModal: onCloseInitiateScanerModal,
    onOpenModal: onOpenInitiateScanerModal,
  } = useToggleModal();

  const {
    isModalOpen: isModalAssignOpen,
    onCloseModal: onCloseAssignModal,
    onOpenModal: onOpenAssignModal,
  } = useToggleModal();

  const {
    isModalOpen: isModalDeleteOpen,
    onCloseModal: onCloseDeleteModal,
    onOpenModal: onOpenDeleteModal,
  } = useToggleModal();

  const {
    isModalOpen: isModalAddLocationOpen,
    onCloseModal: onCloseAddLocationModal,
    onOpenModal: onOpenAddLocationModal,
  } = useToggleModal();

  // fns
  const openWithDrawModal = (id: string) => {
    setActiveId(id);
    onOpenWithDrawPickListModal();
  };

  const openDeleteModal = (id: string) => {
    setActiveId(id);
    onOpenDeleteModal();
  };

  const openAddLocationModal = (item: any) => {
    setActiveCane(item as Cane);
    onOpenAddLocationModal();
  };

  const closeAddLocationModal = () => {
    setActiveCane(null);
    onCloseAddLocationModal();
  };

  const withDrawCane = () => {
    withDrawPickList
      .trigger({
        pickListId: request?.id,
        caneId: activeId,
      })
      .then(() => {
        toast.success('Cane was withdrawn successfully');
        onCloseWithDrawPickListModal();
        refetchPickListDetails(undefined, { revalidate: true });
      })
      .catch((reason: any) => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      });
  };

  const onDeleteCaneFromPickList = () => {
    deleteCaneFromPickList
      .trigger({
        pickListId: request?.id,
        caneId: activeId,
      })
      .then(() => {
        toast.success(`${t('specimens:errors.deleteCaneSuccess')}`);
        onCloseWithDrawPickListModal();
        refetchPickListDetails(undefined, { revalidate: true });
      })
      .catch((reason: any) => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      });
  };

  const assignPickListFn = () => {
    assignPickList
      .trigger({
        pickListId: request?.id,
      })
      .then(() => {
        toast.success('Pick list was assigned successfully');
        refetchPickListDetails(undefined, { revalidate: true });
      })
      .catch((reason: any) => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      });
  };

  const initiateScanner = () => {
    if (canUseScanner) {
      onOpenInitiateScanerModal();
    } else {
      toast.error('No scanner found');
    }
  };

  const handleReaderRFID = (id: string) => {
    setSelectedReader(id);
    onCloseInitiateScanerModal();
    // One redundant request to connect to scanner and check if I can receive tags
    // I use it to not add additional checks to fetchReaderTag
    // because fetchReaderTag create a loop of requests and there can be tricky cases with message
    getReaderTag.trigger({ id: id as string }).then(() => {
      toast.success('Scanner was initiated successfully');
    });
  };

  // useEffect hooks
  useEffect(() => {
    setStatuses(request?.status);
    setPickList(
      request?.canes?.map((item: any) => {
        return {
          ...item,
          processed: item.pickUpStatus === PickUpCaneStatus.Withdrawn,
        };
      })
    );
  }, [request]);

  useEffect(() => {
    setIsCurrentAdminAssignTo(request?.assignedTo === userData?.userId);
  }, [userData, request]);

  useEffect(() => {
    if (!selectedReader || !readers || readers.length === 0) return;

    const reader = readers.find((item: any) => item.Id.toString() === selectedReader);

    if (reader) {
      setReaderName(reader.Name);
    }
  }, [selectedReader, readers]);

  useEffect(() => {
    if (readers) {
      const mappedReaders = readers.map((reader: { Name: string; Id: string | number }) => ({
        label: reader.Name,
        value: reader.Id.toString(),
      }));
      setReadersList(mappedReaders);
    }
  }, [readers]);

  return (
    <div>
      <div className="text-md mb-4 flex min-w-full max-w-[70px] flex-col items-center gap-3 rounded-md border border-transparent p-4 text-center sm:p-8 md:max-w-full dark:bg-[#1E2021]">
        <ol className="flex w-full flex-col flex-wrap items-start gap-1 space-y-4 border-gray-900 text-gray-500 sm:flex sm:space-x-8 sm:space-y-0 md:flex-row rtl:space-x-reverse">
          {filteredStatuses.map(({ label, value }, index) => (
            <li
              key={index}
              className={classNames('flex items-center space-x-2.5 ', {
                'bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text font-light text-transparent':
                  statuses?.includes(value),
              })}>
              <button className="cursor-default font-medium leading-tight">
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
      {request.type !== PickListType.Create && (
        <div className="my-3 flex flex-col items-end justify-end gap-5 sm:flex-row sm:items-start">
          <Button
            className="w-[175px]"
            onClick={assignPickListFn}
            size={'sm'}
            gradientDuoTone="primary"
            disabled={isCurrentAdminAssignTo || request?.status === PickListStatus.Completed}>
            <div className="mr-2"></div>
            <div>{t('assign_to_myself')}</div>
          </Button>

          <Button
            className="w-[175px]"
            onClick={onOpenAssignModal}
            size={'sm'}
            gradientDuoTone="primary"
            disabled={request?.status === PickListStatus.Completed}>
            <div className="mr-2"></div>
            <div>{t('assign_to')}</div>
          </Button>

          <div className="max-w-[190px]">
            <Button
              className="w-[185px]"
              onClick={initiateScanner}
              size={'sm'}
              gradientDuoTone="primary"
              disabled={
                !request?.assignedTo || request?.status === PickListStatus.Completed || !isCurrentAdminAssignTo
              }>
              <div className="mr-2"></div>
              <div>{selectedReader ? t('choose_scanner') : t('initiate_scanner')}</div>
            </Button>
            {isScanning ? (
              <div className="mt-4 text-center text-sm text-green-500">
                <p>{'You are scanning now with'}</p>
                <p className="break-words">{readerName}</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <div className="mb-4 flex flex-col-reverse justify-between gap-6 xl:flex-row">
        <div className="w-full items-center gap-3 rounded-md border border-transparent p-4 text-white sm:p-8  xl:w-2/3 dark:bg-[#1E2021] ">
          <div className="flex items-center gap-1 text-center">
            <div className="flex h-[25px] w-[25px] justify-center">{<FaTruck />}</div>

            <div className="flex items-center text-center">
              <span className="text-2xl font-normal text-white">{t('ticket_info')}</span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 md:flex-row">
            <div className="w-full">
              {firstColumn?.map(
                ({ name, value, link }: any) =>
                  !!value && (
                    <div
                      key={name}
                      className="my-2 flex justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
                      <div>{name}</div>
                      {!!link ? (
                        <TableLink href={link} name={value} styles={{ name: 'w-auto break-all' }} />
                      ) : (
                        <div className="w-auto break-all">{value}</div>
                      )}
                    </div>
                  )
              )}
            </div>
            <div className="w-full">
              {secondColumn?.map(
                ({ name, value, link }: any) =>
                  !!value && (
                    <div
                      key={name}
                      className="my-2 flex justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
                      <div>{name}</div>
                      {!!link ? (
                        <TableLink href={link} name={value} styles={{ name: 'w-auto break-all' }} />
                      ) : (
                        <div className="w-auto break-all">{value}</div>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
        <DataGridTable columns={columns} rows={pickList || []} isLoading={isLoading} />
      </div>

      <ConfirmationModal
        isOpen={isModalWithDrawPickListOpen}
        onClose={onCloseWithDrawPickListModal}
        onConfirm={withDrawCane}
        title={t('withdraw')}
        message={t('modal.description')}
      />

      <PickListChooseReaderModal
        isOpen={isModalInitiateScanerOpen}
        onClose={onCloseInitiateScanerModal}
        onSubmit={handleReaderRFID}
        readers={readersList}
        initialValue={selectedReader}
      />
      <PickListAssignToModal isOpen={isModalAssignOpen} onClose={onCloseAssignModal} mutate={refetchPickListDetails} />
      <ConfirmationModal
        isOpen={isModalDeleteOpen}
        onClose={onCloseDeleteModal}
        onConfirm={onDeleteCaneFromPickList}
        isLoading={deleteCaneFromPickList.isMutating}
        title={t('common:delete')}
        message={t('deleteCaneFromPickList')}
      />
      <AddCaneLocationModal
        isOpen={isModalAddLocationOpen}
        onClose={closeAddLocationModal}
        refetchCanesInfo={refetchPickListDetails}
        cane={activeCane}
        pickListId={request?.id}
      />
    </div>
  );
};

export default PickListDetailsPage;
