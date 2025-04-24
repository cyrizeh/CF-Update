import closeIcon from '@/public/icons/close-button.svg';
import { Button, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: any;
  isLoading: boolean;
}

const ExtraProtectionAutoRenewSubscriptionModal = ({ isOpen, onClose, onSubmit, isLoading }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');

  function onCloseModal() {
    onClose();
  }

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white">{t('extraProtection.autoRenew.turnOffTitle')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <div className="mb-3 text-sm font-light dark:text-white">
                <span>{t('extraProtection.autoRenew.turnOff')}</span>
              </div>
            </Modal.Body>

            <Modal.Footer className="justify-between">
              <Button color="transparent" onClick={onCloseModal}>
                {t('common:cancel')}
              </Button>

              <Button type="submit" gradientDuoTone="primary" onClick={onSubmit} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="mt-[-1px]" /> {t('common:loading')}
                  </div>
                ) : (
                  <div className="flex gap-2">{t('common:confirm')}</div>
                )}
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExtraProtectionAutoRenewSubscriptionModal;
