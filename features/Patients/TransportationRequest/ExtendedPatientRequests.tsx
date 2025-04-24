import { Button, Dropdown, Table } from 'flowbite-react';
import { Accordion, Badge } from 'flowbite-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dots from '@/public/icons/dots-vertical.svg';
import Image from 'next/image';
import PlusIcon from '@/public/icons/PlusIcon';
import { useEffect, useState } from 'react';
import PatientComponentLayout from '@/features/PatientOverview/components/PatientComponentLayout';
import useToggleModal from '@/hooks/useToggleModal';
import { hasPermission } from '@/utils';
import TransportationModal from '../TransportationModal/TransportationModal';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import EditTrackingUrlModal from './EditTrackingUrlModal';
import PencilAlt from '@/public/icons/PencilAlt';
import useTransportationMutation from '@/api/mutations/useTransportationMutation';
import CustomSelect from '@/components/Forms/Select/Select';
import { transportationStatuses } from '@/constants/states';
import { toast } from 'react-toastify';
import { useGetTransportationPatients } from '@/api/queries/transportation.queries';
import { useTableControls } from '@/hooks/useTableControls';
import Pagination from '@/components/Pagination/Pagination';
import { AdminRoute, ApiTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { RequestCreationStep } from '@/types/Patients.enum';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const ExtendedPatientRequests = () => {
  const [transportationRequests, setTransportationRequests] = useState<ApiTypes.TransportationResponse>(
    {} as ApiTypes.TransportationResponse
  );
  const [draftRequests, setDraftRequests] = useState<ApiTypes.TransportationResponse>(
    {} as ApiTypes.TransportationResponse
  );
  const [selectedTransportationRequest, setSelectedTransportationRequest] = useState<any>();
  const { updateRequest, updateRequestStatus } = useTransportationMutation();
  const [draftTotalCount, setDraftTotalCount] = useState(0);
  const [createdTotalCount, setCreatedTotalCount] = useState(0);

  const router = useRouter();
  const { userPermissions } = usePermissions();
  const isUserCanAddTransportationPatient = hasPermission(userPermissions, 'create:transportations');
  const { Panel, Title, Content } = Accordion;

  const { t } = useTranslation('transportation');

  // Draft requests
  const { pagination: paginationdraftTransRequestsPagination } = useTableControls(draftRequests, {});
  const { data: draftTransportationRequests, mutate: draftMutate } = useGetTransportationPatients({
    pageSize: paginationdraftTransRequestsPagination.size,
    pageNumber: paginationdraftTransRequestsPagination.currentPage,
    patientId: router?.query?.id as string,
    status: 'Draft',
  });

  // Created requests
  const { pagination: paginationCreatedTransRequestsPagination } = useTableControls(transportationRequests, {});
  const { data: createdTransportationRequests, mutate: createdMutate } = useGetTransportationPatients({
    pageSize: paginationCreatedTransRequestsPagination.size,
    pageNumber: paginationCreatedTransRequestsPagination.currentPage,
    patientId: router?.query?.id as string,
    status: 'Created',
  });

  useEffect(() => {
    if (draftTransportationRequests?.items) {
      setDraftRequests(draftTransportationRequests);
      setDraftTotalCount(draftTransportationRequests?.totalCount);
    }
  }, [draftTransportationRequests]);

  useEffect(() => {
    if (createdTransportationRequests?.items) {
      setTransportationRequests(createdTransportationRequests);
      setCreatedTotalCount(createdTransportationRequests?.totalCount);
    }
  }, [createdTransportationRequests]);

  const {
    onOpenModal: onOpenTransportationModal,
    isModalOpen: isOpenTransportationModal,
    onCloseModal: onCloseTransportationModal,
  } = useToggleModal();

  const {
    onOpenModal: onOpenCompleteRequestModal,
    isModalOpen: isOpenCompleteRequestModal,
    onCloseModal: onCloseComleteRequestModal,
  } = useToggleModal();

  const {
    onOpenModal: onOpenDeleteDraftRequestModal,
    isModalOpen: isOpenDeleteDraftRequestModal,
    onCloseModal: onCloseDeleteDrafttModal,
  } = useToggleModal();

  const {
    onOpenModal: onOpenEditRequestModal,
    isModalOpen: isOpenEditRequestModal,
    onCloseModal: onCloseEditRequestModal,
  } = useToggleModal();

  const { isModalOpen: isEditModalOpen, onCloseModal: closeEditModal, onOpenModal: openEditModal } = useToggleModal();

  const openTrackUrl = (trackingUrl: string) => {
    if (trackingUrl) {
      window.open(trackingUrl, '_blank');
    } else {
      console.error('Tracking URL is not available.');
    }
  };
  const handleChange = async (statuses: { value: string; label: string }[], id: string) => {
    const updatedRequest = {
      transportationStatuses: statuses.map(status => status.value),
      transportationRequestId: id,
    };
    updateRequestStatus({ ...updatedRequest })
      .then(() => {
        // @ts-ignore
        draftMutate(undefined, { revalidate: true });
        // @ts-ignore
        createdMutate(undefined, { revalidate: true });
        toast.success('Transportation status updated successfully!');
      })
      .catch(() => {
        toast.error('Error updating transportation  status');
      });
  };

  const isALastDraftRequest = draftRequests?.items?.length == 1 && transportationRequests?.items?.length == 0;
  const { deleteTransportationRequest } = useTransportationMutation();
  const onDeleteTransportationRequest = () => {
    deleteTransportationRequest
      .trigger({ transportationRequestId: selectedTransportationRequest?.id })
      .then(() => {
        if (isALastDraftRequest) {
          router.push(`${AdminRoute.Transportation}`);
        }
        // @ts-ignore
        draftMutate(undefined, { revalidate: true });
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      })
      .finally(() => {
        onCloseDeleteDrafttModal();
      });
  };

  return (
    <PatientComponentLayout col>
      {isUserCanAddTransportationPatient && (
        <>
          <TransportationModal
            isOpen={isOpenTransportationModal}
            onClose={() => {
              onCloseTransportationModal();
              // @ts-ignore
              draftMutate(undefined, { revalidate: true });
              // @ts-ignore
              createdMutate(undefined, { revalidate: true });
            }}
            refetchTransportationRequests={() => {
              // @ts-ignore
              draftMutate(undefined, { revalidate: true });
              // @ts-ignore
              createdMutate(undefined, { revalidate: true });
            }}
            transportationRequestData={{
              patientId: router?.query?.id as string,
            }}
          />

          <TransportationModal
            isOpen={isOpenCompleteRequestModal}
            onClose={onCloseComleteRequestModal}
            isEditMode={true}
            refetchTransportationRequests={() => {
              // @ts-ignore
              draftMutate(undefined, { revalidate: true });
              // @ts-ignore
              createdMutate(undefined, { revalidate: true });
            }}
            transportationRequestData={{
              requestId: selectedTransportationRequest?.id,
              patientId: selectedTransportationRequest?.patientId,
              hasPartner: Boolean(selectedTransportationRequest?.partnerId || ''),
              requestCreationStep: selectedTransportationRequest?.creationStep,
            }}
          />

          <TransportationModal
            isOpen={isOpenEditRequestModal}
            onClose={onCloseEditRequestModal}
            isEditMode={true}
            refetchTransportationRequests={() => {
              // @ts-ignore
              draftMutate(undefined, { revalidate: true });
              // @ts-ignore
              createdMutate(undefined, { revalidate: true });
            }}
            transportationRequestData={{
              requestId: selectedTransportationRequest?.id,
              patientId: selectedTransportationRequest?.patientId,
              hasPartner: Boolean(selectedTransportationRequest?.partnerId || ''),
              requestCreationStep: RequestCreationStep.PatientAssigned,
            }}
          />

          <EditTrackingUrlModal
            isOpen={isEditModalOpen}
            onClose={() => {
              closeEditModal();
              // @ts-ignore
              draftMutate(undefined, { revalidate: true });
              // @ts-ignore
              createdMutate(undefined, { revalidate: true });
              setSelectedTransportationRequest(undefined);
            }}
            updateDetails={updateRequest}
            requestId={selectedTransportationRequest?.id}
            refetchTransportations={() => {
              // @ts-ignore
              draftMutate(undefined, { revalidate: true });
              // @ts-ignore
              createdMutate(undefined, { revalidate: true });
            }}
          />

          <ConfirmationModal
            isOpen={isOpenDeleteDraftRequestModal}
            onClose={onCloseDeleteDrafttModal}
            onConfirm={onDeleteTransportationRequest}
            isLoading={deleteTransportationRequest?.isMutating}
            title={t('common:delete')}
            message={t('common:deleteConfirmation')}>
            <>
              {
                // check if it is a last draft request
                isALastDraftRequest && selectedTransportationRequest?.patient?.patientType === 'Transportation' ? (
                  <div className="text-start font-['Inter'] text-lg font-light text-white">
                    <p className="mb-2">{t('deleteModal.lastItem')}</p>
                    <p>{t('deleteModal.lastItem2')}</p>
                  </div>
                ) : (
                  <p className="text-start font-['Inter'] text-lg font-light text-white">{t('deleteModal.general')}</p>
                )
              }
            </>
          </ConfirmationModal>
        </>
      )}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <span className=" text-2xl font-normal text-white">Transportation Requests</span>

        {isUserCanAddTransportationPatient && (
          <Button gradientDuoTone="primary" onClick={onOpenTransportationModal}>
            <div className="mr-2">
              <PlusIcon />
            </div>
            Transportation request
          </Button>
        )}
      </div>

      <Accordion className="border-0">
        <Panel>
          <Title>
            <div className="flex items-center gap-3">
              Draft Requests
              <Badge color={'cryo'} className="item-center flex h-[22px] w-[28px] justify-center text-center">
                {draftTotalCount}
              </Badge>
            </div>
          </Title>
          <Content>
            {draftRequests?.items?.length !== 0 ? (
              <div>
                <div className="scrollbar block w-full overflow-hidden overflow-x-auto">
                  <Table>
                    <Table.Head>
                      <Table.HeadCell className="text-left">Creation date</Table.HeadCell>
                      <Table.HeadCell className="min-w-[280px] text-left">Transportation status</Table.HeadCell>
                      <Table.HeadCell className="text-right">Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {draftRequests?.items?.map((item: any, i: number) => (
                        <Table.Row
                          key={i}
                          color="baseReverse"
                          className="w-auto bg-dark-grey-100 px-6 py-3 text-sm font-normal text-white dark:bg-dark-grey-100 hover:dark:bg-dark-grey-200">
                          <>
                            <Table.Cell>{formatDataWithTime(item?.created)}</Table.Cell>
                            <Table.Cell className="w-[220px]">
                              <CustomSelect
                                isMulti
                                options={transportationStatuses}
                                value={item.transportationStatuses?.map((value: string) => ({
                                  value: value,
                                  label: transportationStatuses.find((status: any) => status.value === value)?.label,
                                }))}
                                placeholder={'Select status...'}
                                onChange={e => handleChange(e, item.id)}
                              />
                            </Table.Cell>
                          </>

                          <Table.Cell className="flex justify-end">
                            <div className="flex justify-between gap-3">
                              <Button
                                size={'sm'}
                                gradientDuoTone="primary"
                                onClick={() => {
                                  setSelectedTransportationRequest(item);
                                  onOpenCompleteRequestModal();
                                }}>
                                Complete request
                              </Button>
                              <Button
                                size={'sm'}
                                gradientDuoTone="primary"
                                onClick={() => {
                                  setSelectedTransportationRequest(item);
                                  onOpenDeleteDraftRequestModal();
                                }}>
                                {t('common:delete')}
                              </Button>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
                <div className="flex pt-8">
                  <Pagination {...paginationdraftTransRequestsPagination} />
                </div>
              </div>
            ) : null}
          </Content>
        </Panel>
      </Accordion>
      <Accordion className="mt-8 border-0">
        <Panel>
          <Title>
            <div className="flex items-center gap-3">
              Initiated Requests
              <Badge color={'cryo'} className="item-center flex h-[22px] w-[28px] justify-center text-center">
                {createdTotalCount}
              </Badge>
            </div>
          </Title>
          <Content>
            {transportationRequests?.items?.length !== 0 ? (
              <div>
                <div className="scrollbar block w-full overflow-hidden overflow-x-auto">
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Ticket number</Table.HeadCell>
                      <Table.HeadCell className="min-w-[260px]">Transportation Status</Table.HeadCell>
                      <Table.HeadCell>Creation date</Table.HeadCell>

                      <Table.HeadCell>Sending Clinic</Table.HeadCell>
                      <Table.HeadCell>Receiving Clinic</Table.HeadCell>
                      <Table.HeadCell>Billed to</Table.HeadCell>
                      <Table.HeadCell>Billing status</Table.HeadCell>
                      <Table.HeadCell>Witness</Table.HeadCell>
                      <Table.HeadCell>Track shipment</Table.HeadCell>
                      <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {transportationRequests?.items?.map((item: any, i: number) => (
                        <Table.Row
                          key={i}
                          color="baseReverse"
                          className="bg-dark-grey-100 px-6 py-3 text-sm font-normal text-white dark:bg-dark-grey-100 hover:dark:bg-dark-grey-200">
                          <Table.Cell color="reverse">
                            <Link href={`/admin/transportation/request/${item.id}`}>
                              <div className="flex max-w-[205px] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                                <Button size={'sm'} gradientDuoTone="primary">
                                  <span className="w-[130px] truncate text-wrap px-2">{`View ticket ${
                                    item.orderNumber || ''
                                  }`}</span>
                                </Button>
                              </div>
                            </Link>
                          </Table.Cell>

                          <Table.Cell className="min-w-[220px]">
                            <CustomSelect
                              isMulti
                              options={transportationStatuses}
                              value={item.transportationStatuses?.map((value: string) => ({
                                value: value,
                                label: transportationStatuses.find((status: any) => status.value === value)?.label,
                              }))}
                              placeholder={'Select status...'}
                              onChange={e => handleChange(e, item.id)}
                            />
                          </Table.Cell>
                          <Table.Cell>{formatDataWithTime(item?.created)}</Table.Cell>
                          <Table.Cell>{item?.sendingClinicName}</Table.Cell>
                          <Table.Cell>{item?.receivingClinicName}</Table.Cell>
                          <Table.Cell>{item?.payer}</Table.Cell>
                          <Table.Cell>{item?.paymentStatus}</Table.Cell>
                          <Table.Cell>{item?.witnessEmail}</Table.Cell>
                          <Table.Cell>
                            {item?.trackingUrl ? (
                              <Button
                                gradientDuoTone="primary"
                                size="sm"
                                onClick={() => openTrackUrl(item?.trackingUrl)}>
                                Track
                              </Button>
                            ) : (
                              <span>No tracking link</span>
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <Dropdown
                              label=""
                              dismissOnClick={false}
                              renderTrigger={() => (
                                <div className="w-10 hover:cursor-pointer">
                                  <Image src={dots} alt="actions" />
                                </div>
                              )}>
                              <div className="rounded-lg  bg-[#4F4F4F] p-[1px]">
                                <Dropdown.Item
                                  className="hover:cursor-pointer"
                                  onClick={() => {
                                    setSelectedTransportationRequest(item);
                                    openEditModal();
                                  }}>
                                  <PencilAlt />
                                  <p className="hover:bg-blue mx-2">Edit tracking link</p>
                                </Dropdown.Item>

                                <Dropdown.Item
                                  className="hover:cursor-pointer"
                                  onClick={() => {
                                    setSelectedTransportationRequest(item);
                                    onOpenEditRequestModal();
                                  }}>
                                  <PencilAlt />
                                  <p className="mx-2">
                                    <div>Edit request</div>
                                  </p>
                                </Dropdown.Item>
                              </div>
                            </Dropdown>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
                <div className="flex pt-8">
                  <Pagination {...paginationCreatedTransRequestsPagination} />
                </div>
              </div>
            ) : null}
          </Content>
        </Panel>
      </Accordion>
    </PatientComponentLayout>
  );
};

export default ExtendedPatientRequests;
