import usePatientPaymentMutation from '@/api/mutations/usePatientPaymentMutation';
import PatientBillingFormSquare from '@/features/Patients/PatientBilling/PatientBiilingFormSquare/PatientBiilingFormSquare';
import closeIcon from '@/public/icons/close-button.svg';
import { PaymentSquareRequest } from '@/types/view/PatientPaymentDateSource.type';
import { Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
type EditPatientPaymentmethodProps = {
  isOpen: boolean;
  onClose: (isSubmitted?: boolean) => void;
  refetchPaymentDetails: any;
};

const EditPaymentMethodModal: React.FC<EditPatientPaymentmethodProps> = ({
  isOpen,
  onClose: onCloseModal,
  refetchPaymentDetails,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');
  const [key, setKey] = useState(Date.now());
  const { handleSchedulePayment } = usePatientPaymentMutation();
  const handleSubmit = async ({ paymentMethodToken, verificationToken }: PaymentSquareRequest) => {
    let response;
    {
      response = await handleSchedulePayment.trigger({ paymentMethodToken, verificationToken }).catch(() => {
        toast.error(`${t('failed_billing')}`);
      });
    }
    return response;
  };

  const handleDone = () => {
    onCloseModal();
    refetchPaymentDetails();
  };

  useEffect(() => {
    if (!isOpen) {
      setKey(Date.now());
    }
  }, [isOpen]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={() => onCloseModal()}>
        <div className="flex items-center justify-between p-5">
          <div></div>
          <div className="text-3xl font-light">{t('editPaymentMethod')}</div>
          <div className="cursor-pointer" onClick={() => onCloseModal()}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body>
          <PatientBillingFormSquare
            key={key}
            btnLabel={t('common:save')}
            total={undefined}
            handleDone={handleDone}
            handlePayment={handleSubmit}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditPaymentMethodModal;
