import dots from '@/public/icons/dots-vertical.svg';
import { ViewTypes } from '@/types';
import { ChargeStatus } from '@/types/ChargeStatus.enum';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { isDateWithinRange } from '@/utils/isDateWithinRange';
import { Accordion, Badge, Dropdown } from 'flowbite-react';
import Image from 'next/image';
import { FaRegCircleCheck, FaRegCirclePause, FaRegCircleXmark, FaRegClock } from 'react-icons/fa6';
import { SubscriptionActionType, useSubscriptionActions } from './useSubscriptionActions';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import UnpauseSubscriptionModal from '../UnpauseSubscriptionModal/UnpauseSubscriptionModal';
import useTranslation from 'next-translate/useTranslation';
import useRole from '@/hooks/useRole';
import { isUserAdmin, isUserGodAdmin } from '@/utils';

const PaymentDetails = ({
  label,
  payment,
  showDraftStatus,
  refetchPatientInfo,
}: {
  label: string;
  payment: ViewTypes.PatientDetails[];
  showDraftStatus?: boolean;
  refetchPatientInfo?: ((id: any, options?: any) => void) | undefined;
}) => {
  const { t } = useTranslation('patients');
  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const { Panel, Title, Content } = Accordion;

  const statusIcon = (status: string): JSX.Element => {
    switch (status) {
      case ChargeStatus.Succeeded:
        return <FaRegCircleCheck color="#84E1BC" size={15} />;
      case ChargeStatus.Upcoming:
        return <FaRegClock color="#FDF6B2" size={15} />;
      case ChargeStatus.Overdue:
        return <FaRegClock color="#F98080" size={15} />;
      case ChargeStatus.Draft:
        return <FaRegClock color="#FDF6B2" size={15} />;
      case ChargeStatus.Paused:
        return <FaRegCirclePause color="#FDF6B2" size={15} />;
      default:
        return <FaRegCircleXmark color="#F98080" size={15} />;
    }
  };

  const {
    selectedPayment,
    isPauseModalOpen,
    isStopModalOpen,
    isUnpauseModalOpen,
    handleAction,
    handleConfirmAction,
    onClosePauseModal,
    onCloseStopModal,
    onCloseUnpauseModal,
    getSubscriptionsWithSameId,
  } = useSubscriptionActions();

  const multipleSubscriptionNames = selectedPayment
    ? getSubscriptionsWithSameId(payment, selectedPayment?.subscriptionId)
    : [];

  return (
    <>
      <Accordion className="border-0">
        <Panel>
          <Title>
            <div className="flex items-center gap-3">
              {label}
              <Badge color={'cryo'} className="item-center flex h-[22px] w-[28px] justify-center text-center">
                {payment.length}
              </Badge>
            </div>
          </Title>
          <Content>
            {payment.map((elem, i) => (
              <div key={i} className="flex justify-between py-3">
                <div className="flex items-center justify-center gap-3">
                  <div>{statusIcon(elem?.status)}</div>
                  <div>
                    <p className="max-w-[250px] break-words text-xs font-semibold uppercase lg:max-w-full">
                      {elem.name}
                    </p>
                    <p className="text-xs font-medium text-[#828282]">
                      {elem.date ? formatDateWithSlashSeparator(elem.date) : 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {showDraftStatus && (
                    <span className="ml-2 text-xs font-medium text-gray-50">
                      {elem?.status === ChargeStatus.Draft ? 'Draft' : ''}
                    </span>
                  )}
                  {elem?.status === ChargeStatus.Overdue && (
                    <span className="ml-2 text-xs font-medium text-[#F98080]">{'Overdue'}</span>
                  )}
                  {elem?.status === ChargeStatus.Paused && (
                    <span className="ml-2 text-xs font-medium text-gray-50">{'Paused'}</span>
                  )}
                  {isDateWithinRange(elem.date, 90) && (
                    <span className="min-w-[55px] text-end text-xs font-medium text-gray-50">
                      {elem.formattedAmount}
                    </span>
                  )}
                  <div>
                    {isCryoAdmin && label === 'Upcoming Charges' && !!elem.subscriptionId && (
                      <Dropdown
                        label=""
                        placement="right-start"
                        dismissOnClick={false}
                        renderTrigger={() => (
                          <div className="flex min-h-6 min-w-6 gap-1 hover:cursor-pointer">
                            <Image src={dots} alt="actions" />
                          </div>
                        )}>
                        <div className="rounded-lg bg-[#4F4F4F] p-[1px] text-start">
                          {elem.status !== ChargeStatus.Paused && (
                            <Dropdown.Item
                              onClick={() => handleAction(SubscriptionActionType.PAUSE, elem)}
                              className="text-start">
                              {t('paymentDetails.pause_automatic_billing')}
                            </Dropdown.Item>
                          )}
                          {elem.status === ChargeStatus.Paused && (
                            <Dropdown.Item
                              onClick={() => handleAction(SubscriptionActionType.UNPAUSE, elem)}
                              className="text-start">
                              {t('paymentDetails.unpause_automatic_billing')}
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item
                            onClick={() => handleAction(SubscriptionActionType.STOP, elem)}
                            className="text-start">
                            {t('paymentDetails.stop_billing')}
                          </Dropdown.Item>
                        </div>
                      </Dropdown>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Content>
        </Panel>
      </Accordion>
      {/* Pause Confirmation Modal */}
      <ConfirmationModal
        isOpen={isPauseModalOpen}
        onClose={onClosePauseModal}
        onConfirm={() => handleConfirmAction(SubscriptionActionType.PAUSE, refetchPatientInfo)}
        title={t('paymentDetails.confirm_pause')}>
        <p className="text-center text-lg text-gray-50">{t('paymentDetails.confirm_pause_message')}</p>
        {multipleSubscriptionNames.length > 1 && (
          <div className="mt-5 text-lg text-gray-50">
            <p className="text-start font-['Inter'] text-lg font-light text-white">
              <span className="font-semibold">{t('common:warning')}: </span>
              <span>{t('paymentDetails.warning_multiple_subscriptions')}</span>
            </p>
            <ul className="list-inside list-disc">
              {multipleSubscriptionNames.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </ConfirmationModal>

      {/* Stop Confirmation Modal */}
      <ConfirmationModal
        isOpen={isStopModalOpen}
        onClose={onCloseStopModal}
        onConfirm={() => handleConfirmAction(SubscriptionActionType.STOP, refetchPatientInfo)}
        title={t('paymentDetails.confirm_stop')}>
        <p className="text-center text-lg text-gray-50">{t('paymentDetails.confirm_stop_message')}</p>
        {multipleSubscriptionNames.length > 1 && (
          <div className="mt-5 text-lg text-gray-50">
            <p className="text-start font-['Inter'] text-lg font-light text-white">
              <span className="font-semibold">{t('common:warning')}: </span>
              <span>{t('paymentDetails.warning_multiple_subscriptions')}</span>
            </p>
            <ul className="list-inside list-disc">
              {multipleSubscriptionNames.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </ConfirmationModal>

      {/* Unpause Subscription Modal */}
      {selectedPayment && (
        <UnpauseSubscriptionModal
          isOpen={isUnpauseModalOpen}
          onClose={onCloseUnpauseModal}
          onSubmit={data => handleConfirmAction(SubscriptionActionType.UNPAUSE, refetchPatientInfo, data.date)}
          date={selectedPayment?.dueDate}
          label={t('paymentDetails.select_due_date')}
        />
      )}
    </>
  );
};

export default PaymentDetails;
