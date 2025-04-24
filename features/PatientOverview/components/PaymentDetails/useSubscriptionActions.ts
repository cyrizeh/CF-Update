import useSubscriptionMutation from '@/api/mutations/useSubscriptionMutation';
import useToggleModal from '@/hooks/useToggleModal';
import { PatientDetails } from '@/types/view';
import { formatDate } from '@/utils/formatDate';
import { handleApiResponseError } from '@/utils/handleBackendErrors';
import { useState } from 'react';
import { toast } from 'react-toastify';

export enum SubscriptionActionType {
  PAUSE = 'pause',
  UNPAUSE = 'unpause',
  STOP = 'stop',
}

export const useSubscriptionActions = () => {
  const { pauseSubscription, unpauseSubscription, deactivateSubscription } = useSubscriptionMutation();

  const {
    isModalOpen: isPauseModalOpen,
    onOpenModal: onOpenPauseModal,
    onCloseModal: onClosePauseModal,
  } = useToggleModal();

  const {
    isModalOpen: isStopModalOpen,
    onOpenModal: onOpenStopModal,
    onCloseModal: onCloseStopModal,
  } = useToggleModal();

  const {
    isModalOpen: isUnpauseModalOpen,
    onOpenModal: onOpenUnpauseModal,
    onCloseModal: onCloseUnpauseModal,
  } = useToggleModal();

  const [selectedPayment, setSelectedPayment] = useState<PatientDetails | null>(null);

  const handleAction = (action: SubscriptionActionType, payment: any) => {
    setSelectedPayment(payment);
    if (action === SubscriptionActionType.PAUSE) {
      onOpenPauseModal();
    } else if (action === SubscriptionActionType.STOP) {
      onOpenStopModal();
    } else if (action === SubscriptionActionType.UNPAUSE) {
      onOpenUnpauseModal();
    }
  };

  const handleConfirmAction = async (action: SubscriptionActionType, refetchPatientInfo?: any, date?: string) => {
    if (!selectedPayment || !selectedPayment.subscriptionId) return;

    if (action === SubscriptionActionType.PAUSE) {
      await pauseSubscription
        .trigger({ subscriptionId: selectedPayment.subscriptionId })
        .then(() => {
          onClosePauseModal();
          toast.success('The subscription has been paused.');
          refetchPatientInfo?.();
        })
        .catch((reason: any) => {
          handleApiResponseError(reason, 'Cannot pause subscription');
        });
    } else if (action === SubscriptionActionType.STOP) {
      await deactivateSubscription
        .trigger({ subscriptionId: selectedPayment.subscriptionId })
        .then(() => {
          onCloseStopModal();
          toast.success('The subscription has been stopped.');
          refetchPatientInfo?.();
        })
        .catch((reason: any) => {
          handleApiResponseError(reason, 'Cannot stop subscription');
        });
    } else if (action === SubscriptionActionType.UNPAUSE) {
      await unpauseSubscription
        .trigger({
          subscriptionId: selectedPayment.subscriptionId,
          dueDate: date ? formatDate(new Date(date)) : '',
        })
        .then(() => {
          onCloseUnpauseModal();
          toast.success('The subscription has been unpaused.');
          refetchPatientInfo?.();
        })
        .catch((reason: any) => {
          handleApiResponseError(reason, 'Cannot unpause subscription');
        });
    }
  };

  const getSubscriptionsWithSameId = (payment: any[], subscriptionId?: string) => {
    if (!subscriptionId) return [];
    return payment.filter(p => p.subscriptionId === subscriptionId).map(p => p.name);
  };

  return {
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
  };
};
