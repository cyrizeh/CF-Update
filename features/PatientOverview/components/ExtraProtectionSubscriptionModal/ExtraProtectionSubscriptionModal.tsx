import Image from 'next/image';
import { useRef } from 'react';

import usePatientPaymentMutation from '@/api/mutations/usePatientPaymentMutation';
import { SUPPORT_CRYO_EMAIL } from '@/constants/support';
import closeIcon from '@/public/icons/close-button.svg';
import { PatientExtraProtectionSubscriptionStatus } from '@/types/view/PatientPayments.type';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { Button, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { toast } from 'react-toastify';
interface EditDevicemodalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchPatientExtraProtectionStatus: any;
  subscriptionStatus: PatientExtraProtectionSubscriptionStatus;
  data: any;
}

const ExtraProtectionSubscriptionModal = ({
  isOpen,
  onClose,
  refetchPatientExtraProtectionStatus,
  subscriptionStatus,
  data,
}: EditDevicemodalProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');
  const { subscribeOnExtraprotectionProgram, unSubscribeOnExtraprotectionProgram } = usePatientPaymentMutation();
  const isLoadingSubscribeToProgram = subscribeOnExtraprotectionProgram?.isMutating;
  const isLoadingUNSubscribeToProgram = unSubscribeOnExtraprotectionProgram?.isMutating;

  function onCloseModal() {
    onClose();
  }

  function centsToDollars(cents: number): string {
    const dollars = cents / 100;
    return dollars.toFixed(2);
  }

  const handleError = (data: any) => {
    const isSuccess = data?.succeeded;
    if (isSuccess) {
      onClose();
      refetchPatientExtraProtectionStatus();
    } else {
      const errorMessagesArray = data?.errors?.map((error: any) => error);
      if (errorMessagesArray) {
        const allErrorMessages = errorMessagesArray.join(', ');
        toast.error(allErrorMessages);
      }
    }
  };

  const handleExtraSubscription = async () => {
    try {
      if (
        subscriptionStatus === PatientExtraProtectionSubscriptionStatus.Unsubscribed ||
        subscriptionStatus === PatientExtraProtectionSubscriptionStatus.OptedOut
      ) {
        await subscribeOnExtraprotectionProgram.trigger().then(response => {
          handleError(response?.data);
        });
      } else {
        await unSubscribeOnExtraprotectionProgram.trigger().then(response => {
          handleError(response?.data);
        });
      }
    } catch (err: any) {
      handleError(err?.data);
    }
  };
  const statusLabel =
    subscriptionStatus === PatientExtraProtectionSubscriptionStatus.Subscribed ? t('unSubscribe') : t('subscribe');
  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white">{statusLabel}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              {subscriptionStatus === PatientExtraProtectionSubscriptionStatus.Unsubscribed ||
              subscriptionStatus === PatientExtraProtectionSubscriptionStatus.OptedOut ? (
                <>
                  {!!data?.paymentAmount && (
                    <div className="mb-3 text-sm font-light dark:text-white">
                      <span>{t('extraProtection.subscribe.description.1stPart')}</span>
                      <span>{formatDateWithSlashSeparator(data?.nextBillingDate || '')}:</span>
                      <span> ${centsToDollars(data?.paymentAmount)}.</span>
                    </div>
                  )}
                  {!!data?.extraProtectionPrice && (
                    <div className="mb-3 text-sm font-light dark:text-white">
                      <span>{t('extraProtection.subscribe.description.2ndPart')}</span>
                      <span> ${centsToDollars(data?.extraProtectionPrice)} </span>
                      <span>{t('extraProtection.subscribe.description.3rdPart')}</span>
                    </div>
                  )}
                  <div className="text-sm font-light dark:text-white">
                    <span>{t('extraProtection.subscribe.description.4thPart')}</span>
                    <a href={`mailto: ${SUPPORT_CRYO_EMAIL}`} className="underline underline-offset-2">
                      {SUPPORT_CRYO_EMAIL}
                    </a>
                    <span>{t('extraProtection.subscribe.description.5thPart')}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3 text-sm font-light dark:text-white">
                    <span>{t('extraProtection.unSubscribe.description.1stPart')}</span>
                  </div>
                </>
              )}
            </Modal.Body>

            <Modal.Footer className="justify-between">
              <Button color="transparent" onClick={onCloseModal}>
                {t('common:cancel')}
              </Button>

              <Button
                type="submit"
                gradientDuoTone="primary"
                onClick={handleExtraSubscription}
                disabled={isLoadingSubscribeToProgram || isLoadingUNSubscribeToProgram}>
                {isLoadingSubscribeToProgram ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="mt-[-1px]" /> {t('common:loading')}
                  </div>
                ) : (
                  <div className="flex gap-2">{statusLabel}</div>
                )}
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExtraProtectionSubscriptionModal;
