/* eslint-disable complexity */
import { Button, Modal, Spinner } from 'flowbite-react';
import { useRef } from 'react';
import Image from 'next/image';
import closeIcon from '@/public/icons/close-button.svg';
import useTranslation from 'next-translate/useTranslation';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
}

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  isLoading,
  children,
  cancelButtonText,
  confirmButtonText,
}: ConfirmationModalProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');
  return (
    <div ref={rootRef}>
      <Modal
        root={rootRef.current ?? undefined}
        show={isOpen}
        size="xl"
        onClose={onClose}
        data-testid="confirmation-modal">
        <div className="flex items-center justify-center p-5" data-testid="confirmation-modal-header">
          <div className="text-3xl font-light" data-testid="confirmation-modal-title">
            {title}
          </div>

          <div
            className="absolute right-4 cursor-pointer"
            onClick={onClose}
            data-testid="confirmation-modal-close-icon">
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body data-testid="confirmation-modal-body">
          {message ? (
            <div
              className="flex max-h-[100vh] items-center justify-center text-center"
              data-testid="confirmation-modal-message-container">
              <div className="flex w-full flex-col text-[20px] font-normal leading-[21px] text-gray-50">
                <p className="text-center" data-testid="confirmation-modal-message">
                  {message}
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </Modal.Body>

        <Modal.Footer className="my-4 justify-between" data-testid="confirmation-modal-footer">
          <Button
            color="transparent"
            onClick={onClose}
            className="capitalize"
            data-testid="confirmation-modal-cancel-button">
            {cancelButtonText ? cancelButtonText : t('cancel')}
          </Button>

          <Button
            gradientDuoTone="primary"
            onClick={onConfirm}
            className="w-auto capitalize"
            disabled={isLoading}
            data-testid="confirmation-modal-confirm-button">
            {isLoading ? (
              <div className="flex items-center gap-2" data-testid="confirmation-modal-loading-spinner">
                <Spinner size="sm" className="mt-[-1px]" />
                {t('common:loading')}
              </div>
            ) : confirmButtonText ? (
              confirmButtonText
            ) : (
              t('confirm')
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
