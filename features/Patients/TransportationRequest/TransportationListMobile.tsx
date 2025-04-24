import useTransportationMutation from '@/api/mutations/useTransportationMutation';
import { Badge } from '@/components/Badge/Badge';
import CustomSelect from '@/components/Forms/Select/Select';
import { transportationStatuses } from '@/constants/states';
import { ViewTypes } from '@/types';
import { Button } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { HiChevronDown, HiChevronLeft } from 'react-icons/hi';
import { toast } from 'react-toastify';

import useRole from '@/hooks/useRole';
import { hasPermission, isUserAccountAdmin, isUserAdmin, isUserGodAdmin } from '@/utils';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toPascalCase } from '@/utils/toPascalCase';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const PatientInfoItem = ({ header, value, isLast = false }: { header: string; value: ReactNode; isLast?: boolean }) => {
  const mainClasses = `grid grid-cols-2 mb-2.5 ${isLast ? '' : 'border-b border-dark-grey-300'}`;
  return (
    <div className={mainClasses}>
      <div className="pts__item__title py-1 pl-4 text-sm font-semibold uppercase text-gray-400">{header}</div>
      <div className="pts__item__value text-medium py-1 pl-4">{value}</div>
    </div>
  );
};

type TransportationListTableProps = {
  requests: ViewTypes.TransportationRequest[];
  refetchTransportationRequests: any;
  userRole?: string;
};

export const TransportationListMobile = ({
  requests,
  refetchTransportationRequests,
  userRole,
}: TransportationListTableProps) => {
  const { t } = useTranslation('patients');
  const { t: tTransp } = useTranslation('transportation');
  const [openedId, setOpenedId] = useState<string>('');
  const { updateRequestStatus } = useTransportationMutation();
  const [openAlert, toggleAlert] = useState(false);
  const [isLastDraftRequest, setIsLastDraftRequest] = useState(false);

  const { roles } = useRole();
  const isNetworkAdmin = isUserAccountAdmin(roles);
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const { userPermissions } = usePermissions();
  const isUserCanDeleteTransportations =
    hasPermission(userPermissions, 'create:transportations') && (isCryoAdmin || isNetworkAdmin);
  const handlePatientOpen = (id: string) => {
    if (openedId === id) {
      setOpenedId('');
      return;
    }
    setOpenedId(id);
  };

  const itemIsOpened = (id: string) => openedId === id;

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

  const { deleteTransportationRequest } = useTransportationMutation();
  const onDeleteTransportationRequest = () => {
    deleteTransportationRequest
      .trigger({ transportationRequestId: openedId })
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

  const onOpenAlert = (row: any) => {
    setOpenedId(row.id);
    toggleAlert(true);
    setIsLastDraftRequest(row?.isLastDraftRequest);
  };

  const onCloseAlert = () => {
    toggleAlert(false);
    setOpenedId('');
    setIsLastDraftRequest(false);
  };

  return (
    <div>
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseAlert}
        onConfirm={onDeleteTransportationRequest}
        isLoading={deleteTransportationRequest?.isMutating}
        title={t('common:delete')}>
        <>
          {
            // check if it is a last draft request
            !!isLastDraftRequest ? (
              <div className="text-start text-lg font-light text-white">
                <p className="mb-2">{tTransp('deleteModal.lastItem')}</p>
                <p>{tTransp('deleteModal.lastItem2')}</p>
              </div>
            ) : (
              <p className="text-start text-lg font-light text-white">{tTransp('deleteModal.general')}</p>
            )
          }
        </>
      </ConfirmationModal>
      {!!requests.length &&
        requests.map((transportationRequest: ViewTypes.TransportationRequest, idx: number) => {
          return (
            <div key={idx} className="border-b border-dark-grey-300 text-sm font-normal">
              <div className="flex flex-row items-center justify-between py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="... sensitive max-w-[136px] truncate  text-white hover:cursor-pointer hover:underline">
                    {toPascalCase(transportationRequest.patient.fullName)}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="cursor-pointer text-white">
                    {itemIsOpened(`${idx}`) && <HiChevronDown size={20} onClick={() => handlePatientOpen(`${idx}`)} />}
                    {!itemIsOpened(`${idx}`) && <HiChevronLeft size={20} onClick={() => handlePatientOpen(`${idx}`)} />}
                  </span>
                </div>
              </div>

              {itemIsOpened(`${idx}`) && (
                <div>
                  <div className="align-center text-white">
                    {userRole === 'AccountAdmin' || userRole === 'ClinicAdmin'
                      ? transportationRequest.transportationStatuses && (
                          <PatientInfoItem
                            header={t('table.status')}
                            value={
                              <Badge textColor={'primary'}>
                                {' '}
                                {transportationRequest.transportationStatuses
                                  ?.map(
                                    (value: string) =>
                                      transportationStatuses.find((status: any) => status.value === value)?.label
                                  )
                                  .join(', ')}
                              </Badge>
                            }
                          />
                        )
                      : transportationRequest.transportationStatuses && (
                          <PatientInfoItem
                            header={t('table.status')}
                            value={
                              <CustomSelect
                                isMulti
                                options={transportationStatuses}
                                value={transportationRequest.transportationStatuses?.map((value: string) => ({
                                  value: value,
                                  label: transportationStatuses.find((status: any) => status.value === value)?.label,
                                }))}
                                placeholder={'Select status...'}
                                onChange={e => handleChange(e, transportationRequest.id)}
                              />
                            }
                          />
                        )}
                    {transportationRequest.created && (
                      <PatientInfoItem
                        header={t('table.creation_date')}
                        value={<Badge textColor={'primary'}>{formatDataWithTime(transportationRequest.created)}</Badge>}
                      />
                    )}
                    {transportationRequest.shipperNumber && (
                      <PatientInfoItem header={t('table.shipper_number')} value={transportationRequest.shipperNumber} />
                    )}
                    {transportationRequest.sendingClinicName && (
                      <PatientInfoItem
                        header={t('table.sending_clinic')}
                        value={transportationRequest.sendingClinicName}
                      />
                    )}
                    {transportationRequest.shipmentSentDate && (
                      <PatientInfoItem
                        header={t('table.shipment_date')}
                        value={formatDateWithSlashSeparator(transportationRequest.shipmentSentDate)}
                      />
                    )}
                    {transportationRequest.shipmentSentDate && (
                      <PatientInfoItem
                        header={t('table.shipment_received_date')}
                        value={formatDateWithSlashSeparator(transportationRequest.shipmentReceivedDate)}
                      />
                    )}
                    {transportationRequest.receivingClinicName && (
                      <PatientInfoItem
                        header={t('table.receiving_clinic')}
                        value={transportationRequest.receivingClinicName}
                      />
                    )}
                    {transportationRequest.payer && (
                      <PatientInfoItem header={t('table.payer')} value={transportationRequest.payer} />
                    )}
                    {transportationRequest.paymentStatus && (
                      <PatientInfoItem
                        isLast={true}
                        header={t('table.payment_status')}
                        value={<Badge textColor="primary">{transportationRequest.paymentStatus}</Badge>}
                      />
                    )}
                  </div>
                  <div>
                    <Button size={'sm'} className={'mb-4 w-full'} color={'grayBorderedDefault'}>
                      <Link
                        href={
                          userRole === 'AccountAdmin'
                            ? `/account/transportation/${transportationRequest.patientId}`
                            : userRole === 'ClinicAdmin'
                            ? `/clinic/transportation/${transportationRequest.patientId}`
                            : `/admin/transportation/${transportationRequest.patientId}`
                        }>
                        View Details
                      </Link>
                    </Button>
                    {isUserCanDeleteTransportations && transportationRequest.status === 'Draft' && (
                      <Button
                        size={'sm'}
                        className={'mb-4 w-full'}
                        color={'grayBorderedDefault'}
                        onClick={() => onOpenAlert(transportationRequest)}>
                        {t('common:delete')}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
